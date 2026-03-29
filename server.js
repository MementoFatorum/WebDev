const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const {
  DB_FILE,
  initDb,
  getUsers,
  getUserByEmail,
  createUser,
  getStudents,
  getAnnouncements,
  getEvents,
  getAchievements,
  getGrades,
  getAttendance,
  getKioskHighlights,
  insertAnnouncement,
  insertEvent,
  insertAchievement,
  insertGrade,
  insertAttendance,
  insertKioskHighlight,
  deleteAnnouncement,
  deleteEvent,
  deleteKioskHighlight
} = require("./db");

loadEnvFile(path.join(__dirname, ".env"));

const PORT = process.env.PORT || 3000;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const AI_MODEL = process.env.AI_MODEL || "gpt-5-mini";
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";
const ROOT = __dirname;

initDb();

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".webmanifest": "application/manifest+json; charset=utf-8"
};

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return;
  }

  const raw = fs.readFileSync(filePath, "utf8");
  raw.split(/\r?\n/).forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      return;
    }

    const separatorIndex = trimmed.indexOf("=");
    if (separatorIndex === -1) {
      return;
    }

    const key = trimmed.slice(0, separatorIndex).trim();
    const value = trimmed.slice(separatorIndex + 1).trim();

    if (key && !(key in process.env)) {
      process.env[key] = value;
    }
  });
}

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(payload));
}

function sendHtml(res, statusCode, html) {
  res.writeHead(statusCode, { "Content-Type": "text/html; charset=utf-8" });
  res.end(html);
}

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function hashPassword(password, salt = crypto.randomBytes(16).toString("hex")) {
  const derived = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${derived}`;
}

function verifyPassword(password, storedHash) {
  const [salt, hash] = String(storedHash || "").split(":");
  if (!salt || !hash) {
    return false;
  }

  const derived = crypto.scryptSync(password, salt, 64).toString("hex");
  return crypto.timingSafeEqual(Buffer.from(hash, "hex"), Buffer.from(derived, "hex"));
}

function sanitizeUser(user) {
  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    profile: user.profile
  };
}

function validateRegistration(payload) {
  const role = String(payload.role || "").trim();
  const fullName = String(payload.fullName || "").trim();
  const email = normalizeEmail(payload.email);
  const password = String(payload.password || "");
  const profile = payload.profile || {};

  if (!fullName || !email || !password || !role) {
    return "Заполните обязательные поля.";
  }

  if (password.length < 6) {
    return "Пароль должен содержать минимум 6 символов.";
  }

  if (!["student", "teacher", "parent"].includes(role)) {
    return "Некорректная роль.";
  }

  if (role === "student" && (!profile.className || !profile.studentId)) {
    return "Для ученика нужны класс и ID ученика.";
  }

  if (role === "teacher" && (!profile.subject || !profile.staffId)) {
    return "Для учителя нужны предмет и табельный номер.";
  }

  if (role === "parent" && !profile.childEmail) {
    return "Для родителя нужен email ребёнка.";
  }

  return null;
}

function serveStatic(req, res) {
  const requestPath = req.url === "/" ? "/index.html" : req.url.split("?")[0];
  const targetPath = path.join(ROOT, decodeURIComponent(requestPath));

  if (!targetPath.startsWith(ROOT)) {
    sendJson(res, 403, { error: "Forbidden" });
    return;
  }

  fs.readFile(targetPath, (error, data) => {
    if (error) {
      const notFoundPath = path.join(ROOT, "404.html");
      fs.readFile(notFoundPath, (notFoundError, notFoundHtml) => {
        if (notFoundError) {
          sendJson(res, 404, { error: "Not found" });
          return;
        }
        sendHtml(res, 404, notFoundHtml);
      });
      return;
    }

    const extension = path.extname(targetPath).toLowerCase();
    res.writeHead(200, { "Content-Type": MIME_TYPES[extension] || "application/octet-stream" });
    res.end(data);
  });
}

async function readBody(req) {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks).toString("utf8");
}

function parseAiSections(text) {
  const normalized = String(text || "").replace(/\r/g, "");
  const lines = normalized.split("\n").map((line) => line.trim()).filter(Boolean);
  const sections = { diagnosis: "", actions: [], outlook: "" };
  let current = "diagnosis";

  lines.forEach((line) => {
    const clean = line.replace(/^\d+[\.\)]\s*/, "").replace(/^[-•]\s*/, "");
    const lower = clean.toLowerCase();

    if (lower.includes("диагноз")) {
      current = "diagnosis";
      return;
    }

    if (lower.includes("действ") || lower.includes("шаг")) {
      current = "actions";
      return;
    }

    if (lower.includes("профориента") || lower.includes("мотивац")) {
      current = "outlook";
      return;
    }

    if (current === "actions") {
      sections.actions.push(clean);
      return;
    }

    if (current === "outlook") {
      sections.outlook += `${sections.outlook ? " " : ""}${clean}`;
      return;
    }

    sections.diagnosis += `${sections.diagnosis ? " " : ""}${clean}`;
  });

  if (!sections.actions.length) {
    sections.actions = lines.slice(0, 3).map((line) => line.replace(/^[-•]\s*/, ""));
  }

  if (!sections.diagnosis) {
    sections.diagnosis = normalized || "Пока недостаточно данных для анализа.";
  }

  if (!sections.outlook) {
    sections.outlook = "Продолжайте добавлять реальные записи и пересматривать план каждую неделю.";
  }

  return sections;
}

function buildFallbackAdvice(payload) {
  const grades = payload.grades || [];
  const weakest = [...grades].sort((a, b) => a.scorePercent - b.scorePercent)[0];
  const strongest = [...grades].sort((a, b) => b.scorePercent - a.scorePercent)[0];
  const role = payload.role || "student";

  const byRole = {
    student: `Опирайся на сильный предмет ${strongest?.subject || "без явного лидера"} и усиливай ${weakest?.subject || "пока без записей"} через короткие регулярные практики.`,
    teacher: `Сконцентрируйтесь на учениках с низкой динамикой и добавьте больше целевых записей, чтобы AI видел реальную картину класса.`,
    parent: `Сначала проверьте свежие записи учителя и спокойно закрепите дома предмет с наименьшим текущим результатом.`,
    admin: `Порталу нужна регулярная публикация событий и достижений, чтобы управленческая картина школы была полной.`
  };

  return {
    source: "fallback",
    text: byRole[role],
    sections: {
      diagnosis: `Сильная зона: ${strongest?.subject || "ещё не определена"}. Зона внимания: ${weakest?.subject || "ещё нет данных"}.`,
      actions: [
        "Добавить больше реальных записей в портал.",
        "Пересмотреть динамику через 7 дней.",
        "Сравнить успеваемость, посещаемость и внеучебные достижения."
      ],
      outlook: byRole[role]
    }
  };
}

function ensureActorCanMutate(actor, allowedRoles) {
  if (!actor || !allowedRoles.includes(actor.role)) {
    return "Недостаточно прав для этого действия.";
  }
  return null;
}

function computeStudentMetrics(studentEmail, schoolData) {
  const grades = schoolData.grades.filter((item) => item.studentEmail === studentEmail);
  const attendance = schoolData.attendance.filter((item) => item.studentEmail === studentEmail);
  const achievements = schoolData.achievements.filter((item) => item.studentEmail === studentEmail);
  const average = grades.length
    ? grades.reduce((sum, item) => sum + item.scorePercent, 0) / grades.length
    : null;
  const absences = attendance.filter((item) => item.status === "absent").length;

  return {
    grades,
    attendance,
    achievements,
    average,
    absences
  };
}

function buildRiskList(users, schoolData) {
  return users
    .filter((user) => user.role === "student")
    .map((student) => {
      const metrics = computeStudentMetrics(student.email, schoolData);
      const risks = [];

      if (metrics.average !== null && metrics.average < 65) {
        risks.push(`средний результат ${metrics.average.toFixed(1)}%`);
      }

      if (metrics.absences > 2) {
        risks.push(`пропусков: ${metrics.absences}`);
      }

      return {
        studentEmail: student.email,
        studentName: student.fullName,
        className: student.profile?.className || "Не указан",
        riskLevel: risks.length === 0 ? "low" : risks.length > 1 ? "high" : "medium",
        note: risks.length ? risks.join(", ") : "Критических сигналов нет"
      };
    })
    .filter((item) => item.riskLevel !== "low");
}

function buildDashboardData(user) {
  const users = getUsers();
  const schoolData = {
    announcements: getAnnouncements(),
    events: getEvents(),
    achievements: getAchievements(),
    grades: getGrades(),
    attendance: getAttendance(),
    kioskHighlights: getKioskHighlights()
  };
  const students = users
    .filter((item) => item.role === "student")
    .map((item) => ({
      fullName: item.fullName,
      email: item.email,
      className: item.profile?.className || ""
    }));

  const announcements = schoolData.announcements.slice().sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const events = schoolData.events.slice().sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const kioskHighlights = schoolData.kioskHighlights.slice().sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const riskList = buildRiskList(users, schoolData);

  if (!user) {
    return {
      role: "guest",
      summary: [],
      records: {},
      announcements,
      events,
      kioskHighlights,
      students: []
    };
  }

  if (user.role === "student") {
    const metrics = computeStudentMetrics(user.email, schoolData);

    return {
      role: "student",
      summary: [
        { label: "Оценок", value: String(metrics.grades.length) },
        { label: "Средний результат", value: metrics.average === null ? "Нет данных" : `${metrics.average.toFixed(1)}%` },
        { label: "Пропусков", value: String(metrics.absences) },
        { label: "Достижений", value: String(metrics.achievements.length) }
      ],
      records: {
        grades: metrics.grades,
        attendance: metrics.attendance,
        achievements: metrics.achievements,
        riskList: [],
        announcements,
        events
      },
      announcements,
      events,
      kioskHighlights
    };
  }

  if (user.role === "parent") {
    const childEmail = normalizeEmail(user.profile?.childEmail);
    const linkedStudent = users.find((item) => item.email === childEmail && item.role === "student");
    const metrics = computeStudentMetrics(childEmail, schoolData);

    return {
      role: "parent",
      summary: [
        { label: "Ребёнок", value: linkedStudent?.fullName || user.profile?.childName || "Не найден" },
        { label: "Оценок", value: String(metrics.grades.length) },
        { label: "Средний результат", value: metrics.average === null ? "Нет данных" : `${metrics.average.toFixed(1)}%` },
        { label: "Пропусков", value: String(metrics.absences) }
      ],
      records: {
        child: linkedStudent ? { fullName: linkedStudent.fullName, className: linkedStudent.profile?.className || "" } : null,
        grades: metrics.grades,
        attendance: metrics.attendance,
        achievements: metrics.achievements,
        announcements,
        events
      },
      announcements,
      events,
      kioskHighlights
    };
  }

  if (user.role === "teacher") {
    return {
      role: "teacher",
      summary: [
        { label: "Учеников", value: String(students.length) },
        { label: "Оценок внесено", value: String(schoolData.grades.length) },
        { label: "Отметок посещаемости", value: String(schoolData.attendance.length) },
        { label: "Риск-сигналов", value: String(riskList.length) }
      ],
      records: {
        grades: schoolData.grades.slice().sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 8),
        attendance: schoolData.attendance.slice().sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 8),
        achievements: schoolData.achievements.slice().sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 8),
        riskList,
        announcements,
        events
      },
      announcements,
      events,
      kioskHighlights,
      students
    };
  }

  return {
    role: "admin",
    summary: [
      { label: "Пользователей", value: String(users.length) },
      { label: "Новостей", value: String(announcements.length) },
      { label: "Событий", value: String(events.length) },
      { label: "Kiosk карточек", value: String(kioskHighlights.length) }
    ],
    records: {
      grades: schoolData.grades.slice().sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 8),
      achievements: schoolData.achievements.slice().sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 8),
      riskList,
      announcements,
      events
    },
    announcements,
    events,
    kioskHighlights,
    students
  };
}

function handleRegister(payload, res) {
  const error = validateRegistration(payload);
  if (error) {
    sendJson(res, 400, { error });
    return;
  }

  const users = getUsers();
  const email = normalizeEmail(payload.email);
  if (users.some((user) => user.email === email)) {
    sendJson(res, 409, { error: "Пользователь с таким email уже существует." });
    return;
  }

  const profile = { ...(payload.profile || {}) };
  if (profile.childEmail) {
    profile.childEmail = normalizeEmail(profile.childEmail);
  }
  delete profile.accessCode;

  const user = {
    id: crypto.randomUUID(),
    fullName: String(payload.fullName).trim(),
    email,
    role: payload.role,
    passwordHash: hashPassword(String(payload.password)),
    profile,
    createdAt: new Date().toISOString()
  };

  createUser(user);

  sendJson(res, 201, {
    message: "Аккаунт создан. Теперь можно войти в портал.",
    user: sanitizeUser(user)
  });
}

function handleLogin(payload, res) {
  const email = normalizeEmail(payload.email);
  const password = String(payload.password || "");
  const user = getUserByEmail(email);

  if (!user || !verifyPassword(password, user.passwordHash)) {
    sendJson(res, 401, { error: "Неверный email или пароль." });
    return;
  }

  sendJson(res, 200, {
    message: "Вход выполнен успешно.",
    user: sanitizeUser(user)
  });
}

function handleDashboardData(payload, res) {
  const user = payload.user || null;
  sendJson(res, 200, buildDashboardData(user));
}

function createRecord(payload, res) {
  const actor = payload.actor;
  const type = String(payload.type || "");
  const data = payload.data || {};
  const users = getUsers();

  const now = new Date().toISOString();
  const baseRecord = {
    id: crypto.randomUUID(),
    createdAt: now,
    createdByName: actor?.fullName || "Unknown"
  };

  if (type === "grade") {
    const permissionError = ensureActorCanMutate(actor, ["teacher", "admin"]);
    if (permissionError) {
      sendJson(res, 403, { error: permissionError });
      return;
    }

    const student = users.find((item) => item.email === normalizeEmail(data.studentEmail) && item.role === "student");
    if (!student || !data.subject || data.score === undefined || data.maxScore === undefined) {
      sendJson(res, 400, { error: "Нужны ученик, предмет, балл и максимум баллов." });
      return;
    }

    const score = Number(data.score);
    const maxScore = Number(data.maxScore);
    const scorePercent = maxScore > 0 ? Number(((score / maxScore) * 100).toFixed(1)) : 0;

    insertGrade({
      ...baseRecord,
      studentEmail: student.email,
      studentName: student.fullName,
      subject: String(data.subject).trim(),
      score,
      maxScore,
      scorePercent,
      comment: String(data.comment || "").trim()
    });
  } else if (type === "attendance") {
    const permissionError = ensureActorCanMutate(actor, ["teacher", "admin"]);
    if (permissionError) {
      sendJson(res, 403, { error: permissionError });
      return;
    }

    const student = users.find((item) => item.email === normalizeEmail(data.studentEmail) && item.role === "student");
    if (!student || !data.status || !data.date) {
      sendJson(res, 400, { error: "Нужны ученик, статус и дата." });
      return;
    }

    insertAttendance({
      ...baseRecord,
      studentEmail: student.email,
      studentName: student.fullName,
      status: String(data.status).trim(),
      date: String(data.date).trim(),
      comment: String(data.comment || "").trim()
    });
  } else if (type === "achievement") {
    const permissionError = ensureActorCanMutate(actor, ["teacher", "admin"]);
    if (permissionError) {
      sendJson(res, 403, { error: permissionError });
      return;
    }

    const student = users.find((item) => item.email === normalizeEmail(data.studentEmail) && item.role === "student");
    if (!student || !data.title) {
      sendJson(res, 400, { error: "Нужны ученик и название достижения." });
      return;
    }

    insertAchievement({
      ...baseRecord,
      studentEmail: student.email,
      studentName: student.fullName,
      title: String(data.title).trim(),
      body: String(data.body || "").trim()
    });
  } else if (type === "announcement") {
    const permissionError = ensureActorCanMutate(actor, ["admin"]);
    if (permissionError) {
      sendJson(res, 403, { error: permissionError });
      return;
    }

    if (!data.title || !data.body) {
      sendJson(res, 400, { error: "Нужны заголовок и текст объявления." });
      return;
    }

    insertAnnouncement({
      ...baseRecord,
      title: String(data.title).trim(),
      body: String(data.body).trim(),
      audience: String(data.audience || "school").trim()
    });
  } else if (type === "event") {
    const permissionError = ensureActorCanMutate(actor, ["admin"]);
    if (permissionError) {
      sendJson(res, 403, { error: permissionError });
      return;
    }

    if (!data.title || !data.eventDate) {
      sendJson(res, 400, { error: "Нужны название события и дата." });
      return;
    }

    insertEvent({
      ...baseRecord,
      title: String(data.title).trim(),
      body: String(data.body || "").trim(),
      eventDate: String(data.eventDate).trim()
    });
  } else if (type === "kiosk") {
    const permissionError = ensureActorCanMutate(actor, ["admin"]);
    if (permissionError) {
      sendJson(res, 403, { error: permissionError });
      return;
    }

    if (!data.title) {
      sendJson(res, 400, { error: "Нужен заголовок для стенгазеты." });
      return;
    }

    insertKioskHighlight({
      ...baseRecord,
      title: String(data.title).trim(),
      body: String(data.body || "").trim()
    });
  } else {
    sendJson(res, 400, { error: "Неизвестный тип записи." });
    return;
  }
  sendJson(res, 201, { message: "Запись успешно сохранена." });
}

function deleteRecord(payload, res) {
  const actor = payload.actor;
  const type = String(payload.type || "");
  const id = String(payload.id || "");

  const permissionError = ensureActorCanMutate(actor, ["admin"]);
  if (permissionError) {
    sendJson(res, 403, { error: permissionError });
    return;
  }

  if (!id) {
    sendJson(res, 400, { error: "Не указан идентификатор записи." });
    return;
  }

  let result;
  if (type === "announcement") {
    result = deleteAnnouncement(id);
  } else if (type === "event") {
    result = deleteEvent(id);
  } else if (type === "kiosk") {
    result = deleteKioskHighlight(id);
  } else {
    sendJson(res, 400, { error: "Удаление для этого типа не поддерживается." });
    return;
  }

  if (!result.changes) {
    sendJson(res, 404, { error: "Запись не найдена." });
    return;
  }

  sendJson(res, 200, { message: "Запись удалена." });
}

async function handleAiAdvice(payload, res) {
  if (!GEMINI_API_KEY && !OPENAI_API_KEY) {
    sendJson(res, 200, buildFallbackAdvice(payload));
    return;
  }

  const prompt = [
    "Ты AI-наставник школьного портала Aqbobek Lyceum.",
    `Роль пользователя: ${payload.role || "guest"}.`,
    `Пользовательский запрос: ${payload.prompt || "Проанализируй текущую ситуацию."}`,
    `Оценки: ${JSON.stringify(payload.grades || [])}.`,
    `Посещаемость: ${JSON.stringify(payload.attendance || [])}.`,
    `Достижения: ${JSON.stringify(payload.achievements || [])}.`,
    `События: ${JSON.stringify(payload.events || [])}.`,
    "Дай ответ на русском языке.",
    "Сделай 3 части с явными заголовками: Диагноз, Действия на неделю, Профориентация.",
    "В блоке Действия на неделю дай 3 коротких пункта."
  ].join("\n");

  if (GEMINI_API_KEY) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": GEMINI_API_KEY
          },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [{ text: prompt }]
              }
            ]
          })
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        sendJson(res, 502, { error: "Gemini request failed", details: errorText });
        return;
      }

      const result = await response.json();
      const text = (result.candidates || [])
        .flatMap((candidate) => candidate.content?.parts || [])
        .map((part) => part.text || "")
        .join("\n")
        .trim();

      sendJson(res, 200, {
        source: "gemini",
        model: GEMINI_MODEL,
        text: text || "Gemini не вернул текстовый ответ.",
        sections: parseAiSections(text)
      });
      return;
    } catch (error) {
      sendJson(res, 500, {
        error: "Server error while calling Gemini",
        details: error instanceof Error ? error.message : String(error)
      });
      return;
    }
  }

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: AI_MODEL,
        input: prompt
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      sendJson(res, 502, { error: "OpenAI request failed", details: errorText });
      return;
    }

    const result = await response.json();
    const text = result.output_text || "AI не вернул текстовый ответ.";
    sendJson(res, 200, {
      source: "openai",
      model: AI_MODEL,
      text,
      sections: parseAiSections(text)
    });
  } catch (error) {
    sendJson(res, 500, {
      error: "Server error while calling OpenAI",
      details: error instanceof Error ? error.message : String(error)
    });
  }
}

async function handlePostJson(req, res, handler) {
  try {
    const payload = JSON.parse(await readBody(req));
    handler(payload, res);
  } catch {
    sendJson(res, 400, { error: "Invalid JSON body" });
  }
}

const server = http.createServer((req, res) => {
  if (req.method === "POST" && req.url === "/api/auth/register") {
    handlePostJson(req, res, handleRegister);
    return;
  }

  if (req.method === "POST" && req.url === "/api/auth/login") {
    handlePostJson(req, res, handleLogin);
    return;
  }

  if (req.method === "POST" && req.url === "/api/dashboard-data") {
    handlePostJson(req, res, handleDashboardData);
    return;
  }

  if (req.method === "POST" && req.url === "/api/data/create") {
    handlePostJson(req, res, createRecord);
    return;
  }

  if (req.method === "POST" && req.url === "/api/data/delete") {
    handlePostJson(req, res, deleteRecord);
    return;
  }

  if (req.method === "POST" && req.url === "/api/ai-advice") {
    handlePostJson(req, res, (payload, response) => {
      handleAiAdvice(payload, response);
    });
    return;
  }

  if (req.method === "GET") {
    serveStatic(req, res);
    return;
  }

  sendJson(res, 405, { error: "Method not allowed" });
});

server.listen(PORT, () => {
  console.log(`Aqbobek portal started on http://localhost:${PORT} using SQLite at ${DB_FILE}`);
});
