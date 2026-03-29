const state = {
  user: readStoredUser(),
  dashboard: null,
  kioskMode: false,
  autoScrollTimer: null
};

const elements = {
  activeUser: document.querySelector("#active-user"),
  openAuth: document.querySelector("#open-auth"),
  openAuthHero: document.querySelector("#open-auth-hero"),
  logoutButton: document.querySelector("#logout-button"),
  authHero: document.querySelector("#auth-hero"),
  authModal: document.querySelector("#auth-modal"),
  authBackdrop: document.querySelector("#auth-backdrop"),
  closeAuth: document.querySelector("#close-auth"),
  authMessage: document.querySelector("#auth-message"),
  authTabs: document.querySelectorAll(".auth-tab"),
  loginForm: document.querySelector("#login-form"),
  registerForm: document.querySelector("#register-form"),
  registerRole: document.querySelector("#register-role"),
  authRoleFields: document.querySelector("#auth-role-fields"),
  heroTitle: document.querySelector("#hero-title"),
  heroText: document.querySelector("#hero-text"),
  summaryGrid: document.querySelector("#summary-grid"),
  dashboardMain: document.querySelector("#dashboard-main"),
  dashboardSide: document.querySelector("#dashboard-side"),
  managementSection: document.querySelector("#manage-section"),
  aiForm: document.querySelector("#ai-form"),
  aiPrompt: document.querySelector("#ai-prompt"),
  aiOutput: document.querySelector("#ai-output"),
  aiStatus: document.querySelector("#ai-status"),
  refreshAi: document.querySelector("#refresh-ai"),
  toggleKiosk: document.querySelector("#toggle-kiosk"),
  kioskFeed: document.querySelector("#kiosk-feed"),
  navLinks: document.querySelectorAll(".nav-link")
};

function readStoredUser() {
  try {
    return JSON.parse(localStorage.getItem("aqbobek-user") || "null");
  } catch {
    return null;
  }
}

function saveStoredUser(user) {
  localStorage.setItem("aqbobek-user", JSON.stringify(user));
}

function clearStoredUser() {
  localStorage.removeItem("aqbobek-user");
}

function currentRole() {
  return state.user?.role || "guest";
}

function roleDisplayName(role) {
  const map = {
    student: "Ученик",
    teacher: "Учитель",
    parent: "Родитель",
    admin: "Администратор",
    guest: "Гость"
  };
  return map[role] || role;
}

function setAuthMessage(message, tone = "info") {
  elements.authMessage.textContent = message || "";
  elements.authMessage.dataset.tone = tone;
}

function openAuthModal(tab = "login") {
  resetAuthForms();
  elements.authModal.classList.remove("is-hidden");
  setActiveAuthTab(tab);
}

function closeAuthModal() {
  elements.authModal.classList.add("is-hidden");
  resetAuthForms();
  setAuthMessage("");
}

function setActiveAuthTab(tab) {
  elements.authTabs.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.authTab === tab);
  });
  elements.loginForm.classList.toggle("is-hidden", tab !== "login");
  elements.registerForm.classList.toggle("is-hidden", tab !== "register");
  setAuthMessage("");
}

function renderRoleFields(role) {
  const templates = {
    student: `
      <label>
        Класс
        <input type="text" name="className" placeholder="9B" required>
      </label>
      <label>
        ID ученика
        <input type="text" name="studentId" placeholder="ST-2026-001" required>
      </label>
    `,
    teacher: `
      <label>
        Предмет
        <input type="text" name="subject" placeholder="Математика" required>
      </label>
      <label>
        Табельный номер
        <input type="text" name="staffId" placeholder="T-041" required>
      </label>
    `,
    parent: `
      <label>
        Имя ребёнка
        <input type="text" name="childName" placeholder="Алия Нуржан">
      </label>
      <label>
        Email ребёнка
        <input type="email" name="childEmail" placeholder="student@aqbobek.edu" required>
      </label>
    `
  };

  elements.authRoleFields.innerHTML = templates[role] || "";
}

function resetAuthForms() {
  elements.loginForm?.reset();
  elements.registerForm?.reset();
  if (elements.registerRole) {
    elements.registerRole.value = "student";
  }
  renderRoleFields("student");
  setAuthMessage("");
}

async function apiRequest(url, payload) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.error || "Request failed");
  }
  return result;
}

async function loadDashboard() {
  state.dashboard = await apiRequest("/api/dashboard-data", {
    user: state.user
  });
  renderDashboard();
}

function updateUserChrome() {
  const label = state.user
    ? `${state.user.fullName} · ${roleDisplayName(state.user.role)}`
    : "Гость";

  elements.activeUser.textContent = label;
  elements.openAuth.classList.toggle("is-hidden", Boolean(state.user));
  elements.logoutButton.classList.toggle("is-hidden", !state.user);
  elements.authHero.classList.toggle("is-hidden", Boolean(state.user));
}

function renderHero() {
  const content = {
    guest: {
      title: "Единый портал школьных данных",
      text: "Войдите в систему, чтобы увидеть персональный экран и работать только с реальными данными, добавленными в портал."
    },
    student: {
      title: "Дашборд ученика",
      text: "Здесь отображаются только те оценки, посещаемость и достижения, которые реально внесли учителя или администрация."
    },
    parent: {
      title: "Дашборд родителя",
      text: "Вы видите динамику ребёнка по реальным школьным записям без скрытых или выдуманных показателей."
    },
    teacher: {
      title: "Дашборд учителя",
      text: "Добавляйте оценки, посещаемость и достижения учеников, а система сразу собирает единую картину класса."
    },
    admin: {
      title: "Дашборд администратора",
      text: "Публикуйте объявления, события и контент для стенгазеты, а также контролируйте общую картину школы."
    }
  };

  const role = currentRole();
  elements.heroTitle.textContent = content[role].title;
  elements.heroText.textContent = content[role].text;
}

function renderSummary() {
  const items = state.dashboard?.summary || [];
  if (!items.length) {
    elements.summaryGrid.innerHTML = `
      <article class="summary-card summary-card--empty">
        <strong>Пока нет персональных данных</strong>
        <p>После входа и первых записей в системе здесь появятся ключевые показатели.</p>
      </article>
    `;
    return;
  }

  elements.summaryGrid.innerHTML = items
    .map((item) => `
      <article class="summary-card">
        <span>${item.label}</span>
        <strong>${item.value}</strong>
      </article>
    `)
    .join("");
}

function renderEmptyState(title, text) {
  return `
    <div class="empty-state">
      <strong>${title}</strong>
      <p>${text}</p>
    </div>
  `;
}

function formatDate(value) {
  if (!value) {
    return "Без даты";
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

function renderGradesPanel(grades, title = "Оценки") {
  if (!grades?.length) {
    return `
      <article class="panel">
        <div class="panel__head"><h3>${title}</h3></div>
        ${renderEmptyState("Пока нет оценок", "Учитель ещё не добавил записи успеваемости.")}
      </article>
    `;
  }

  return `
    <article class="panel">
      <div class="panel__head"><h3>${title}</h3></div>
      <div class="table-list">
        ${grades
          .map((item) => `
            <div class="table-row">
              <div>
                <strong>${item.subject}</strong>
                <span>${item.studentName || "Ученик"} · ${formatDate(item.createdAt)}</span>
              </div>
              <div><span class="pill pill--blue">${item.score} / ${item.maxScore}</span></div>
              <div><span class="pill ${item.scorePercent >= 75 ? "pill--green" : item.scorePercent >= 60 ? "pill--orange" : "pill--red"}">${item.scorePercent}%</span></div>
              <div><span>${item.comment || "Без комментария"}</span></div>
            </div>
          `)
          .join("")}
      </div>
    </article>
  `;
}

function renderAttendancePanel(attendance) {
  if (!attendance?.length) {
    return `
      <article class="panel">
        <div class="panel__head"><h3>Посещаемость</h3></div>
        ${renderEmptyState("Нет отметок посещаемости", "Учитель ещё не внёс записи посещаемости.")}
      </article>
    `;
  }

  return `
    <article class="panel">
      <div class="panel__head"><h3>Посещаемость</h3></div>
      <div class="feed-list">
        ${attendance
          .map((item) => `
            <article class="feed-item">
              <strong>${item.studentName || "Ученик"} · ${item.date}</strong>
              <p>Статус: ${item.status === "present" ? "Присутствовал" : item.status === "late" ? "Опоздал" : "Отсутствовал"}${item.comment ? `. ${item.comment}` : ""}</p>
            </article>
          `)
          .join("")}
      </div>
    </article>
  `;
}

function renderAnnouncementsPanel(items, title = "Объявления") {
  const canDelete = currentRole() === "admin";
  if (!items?.length) {
    return `
      <article class="panel">
        <div class="panel__head"><h3>${title}</h3></div>
        ${renderEmptyState("Пока нет публикаций", "Администратор ещё не добавил новости или объявления.")}
      </article>
    `;
  }

  return `
    <article class="panel">
      <div class="panel__head"><h3>${title}</h3></div>
      <div class="feed-list">
        ${items
          .map((item) => `
            <article class="feed-item">
              <div class="record-head">
                <strong>${item.title}</strong>
                ${canDelete ? `<button class="record-delete" type="button" data-delete-type="announcement" data-delete-id="${item.id}">Удалить</button>` : ""}
              </div>
              <p>${item.body || "Без описания"}</p>
              <span class="meta-line">${formatDate(item.createdAt)}</span>
            </article>
          `)
          .join("")}
      </div>
    </article>
  `;
}

function renderAchievementsPanel(items) {
  if (!items?.length) {
    return `
      <article class="panel">
        <div class="panel__head"><h3>Достижения</h3></div>
        ${renderEmptyState("Пока нет достижений", "Учитель или администратор ещё не добавили достижения.")}
      </article>
    `;
  }

  return `
    <article class="panel">
      <div class="panel__head"><h3>Достижения</h3></div>
      <div class="feed-list">
        ${items
          .map((item) => `
            <article class="feed-item">
              <strong>${item.studentName || ""} ${item.title}</strong>
              <p>${item.body || "Без описания"}</p>
              <span class="meta-line">Добавил: ${item.createdByName} · ${formatDate(item.createdAt)}</span>
            </article>
          `)
          .join("")}
      </div>
    </article>
  `;
}

function renderRiskPanel(items) {
  if (!items?.length) {
    return `
      <article class="panel">
        <div class="panel__head"><h3>Зона риска</h3></div>
        ${renderEmptyState("Критических сигналов нет", "По текущим данным система не видит учеников в зоне риска.")}
      </article>
    `;
  }

  return `
    <article class="panel">
      <div class="panel__head"><h3>Зона риска</h3></div>
      <div class="feed-list">
        ${items
          .map((item) => `
            <article class="feed-item">
              <strong>${item.studentName} · ${item.className}</strong>
              <p>${item.note}</p>
              <span class="meta-line">Уровень: ${item.riskLevel === "high" ? "Высокий" : "Средний"}</span>
            </article>
          `)
          .join("")}
      </div>
    </article>
  `;
}

function renderEventsPanel(items) {
  const canDelete = currentRole() === "admin";
  if (!items?.length) {
    return `
      <article class="panel">
        <div class="panel__head"><h3>События</h3></div>
        ${renderEmptyState("Пока нет событий", "Администратор ещё не опубликовал школьные события.")}
      </article>
    `;
  }

  return `
    <article class="panel">
      <div class="panel__head"><h3>События</h3></div>
      <div class="feed-list">
        ${items
          .map((item) => `
            <article class="feed-item">
              <div class="record-head">
                <strong>${item.title}</strong>
                ${canDelete ? `<button class="record-delete" type="button" data-delete-type="event" data-delete-id="${item.id}">Удалить</button>` : ""}
              </div>
              <p>${item.body || "Без описания"}</p>
              <span class="meta-line">${item.eventDate}</span>
            </article>
          `)
          .join("")}
      </div>
    </article>
  `;
}

function renderGuestDashboard() {
  elements.dashboardMain.innerHTML = `
    <article class="panel">
      <div class="panel__head"><h3>Добро пожаловать</h3></div>
      ${renderEmptyState("Войдите в портал", "После входа вы увидите свой ролевой дашборд и реальные записи системы.")}
    </article>
  `;
  elements.dashboardSide.innerHTML = `
    <article class="panel">
      <div class="panel__head"><h3>Как устроен портал</h3></div>
      <div class="feed-list">
        <article class="feed-item"><strong>Учитель</strong><p>Добавляет оценки, посещаемость и достижения.</p></article>
        <article class="feed-item"><strong>Администратор</strong><p>Публикует объявления, события и материалы стенгазеты.</p></article>
        <article class="feed-item"><strong>Ученик и родитель</strong><p>Видят только реальные записи, которые уже внесены в систему.</p></article>
      </div>
    </article>
  `;
}

function renderStudentDashboard(records) {
  elements.dashboardMain.innerHTML = [
    renderGradesPanel(records.grades, "Мои оценки"),
    renderAttendancePanel(records.attendance)
  ].join("");

  elements.dashboardSide.innerHTML = [
    renderAchievementsPanel(records.achievements),
    renderAnnouncementsPanel(records.announcements),
    renderEventsPanel(records.events)
  ].join("");
}

function renderParentDashboard(records) {
  const childPanel = records.child
    ? `
      <article class="panel">
        <div class="panel__head"><h3>Связанный ребёнок</h3></div>
        <div class="feed-item">
          <strong>${records.child.fullName}</strong>
          <p>Класс: ${records.child.className || "Не указан"}</p>
        </div>
      </article>
    `
    : `
      <article class="panel">
        <div class="panel__head"><h3>Связанный ребёнок</h3></div>
        ${renderEmptyState("Ребёнок не найден", "Проверьте email ребёнка в профиле регистрации.")}
      </article>
    `;

  elements.dashboardMain.innerHTML = [
    childPanel,
    renderGradesPanel(records.grades, "Успеваемость ребёнка"),
    renderAttendancePanel(records.attendance)
  ].join("");

  elements.dashboardSide.innerHTML = [
    renderAchievementsPanel(records.achievements),
    renderAnnouncementsPanel(records.announcements),
    renderEventsPanel(records.events)
  ].join("");
}

function renderTeacherDashboard(records) {
  elements.dashboardMain.innerHTML = [
    renderRiskPanel(records.riskList),
    renderGradesPanel(records.grades, "Последние внесённые оценки"),
    renderAttendancePanel(records.attendance)
  ].join("");

  elements.dashboardSide.innerHTML = [
    renderAchievementsPanel(records.achievements),
    renderAnnouncementsPanel(records.announcements),
    renderEventsPanel(records.events)
  ].join("");
}

function renderAdminDashboard(records) {
  elements.dashboardMain.innerHTML = [
    renderAnnouncementsPanel(records.announcements, "Новости и объявления"),
    renderEventsPanel(records.events),
    renderRiskPanel(records.riskList)
  ].join("");

  elements.dashboardSide.innerHTML = [
    renderGradesPanel(records.grades, "Последние оценки"),
    renderAchievementsPanel(records.achievements)
  ].join("");
}

function buildStudentOptions() {
  const students = state.dashboard?.students || [];
  if (!students.length) {
    return `<option value="">Сначала зарегистрируйте учеников</option>`;
  }

  return students
    .map((student) => `<option value="${student.email}">${student.fullName}${student.className ? ` · ${student.className}` : ""}</option>`)
    .join("");
}

function managementFormCard(title, fields, type, buttonLabel) {
  return `
    <article class="panel manage-card">
      <div class="panel__head"><h3>${title}</h3></div>
      <form class="manage-form" data-create-type="${type}">
        ${fields}
        <button class="button button--primary" type="submit">${buttonLabel}</button>
      </form>
    </article>
  `;
}

function renderManagementSection() {
  const role = currentRole();
  if (role === "guest" || role === "student" || role === "parent") {
    elements.managementSection.innerHTML = "";
    return;
  }

  const studentOptions = buildStudentOptions();
  const teacherForms = [
    managementFormCard(
      "Добавить оценку",
      `
        <label>Ученик<select name="studentEmail" required>${studentOptions}</select></label>
        <label>Предмет<input type="text" name="subject" placeholder="Математика" required></label>
        <div class="manage-form__split">
          <label>Балл<input type="number" name="score" min="0" required></label>
          <label>Максимум<input type="number" name="maxScore" min="1" required></label>
        </div>
        <label>Комментарий<input type="text" name="comment" placeholder="Что стоит подтянуть"></label>
      `,
      "grade",
      "Сохранить оценку"
    ),
    managementFormCard(
      "Отметить посещаемость",
      `
        <label>Ученик<select name="studentEmail" required>${studentOptions}</select></label>
        <div class="manage-form__split">
          <label>Дата<input type="date" name="date" required></label>
          <label>Статус
            <select name="status" required>
              <option value="present">Присутствовал</option>
              <option value="late">Опоздал</option>
              <option value="absent">Отсутствовал</option>
            </select>
          </label>
        </div>
        <label>Комментарий<input type="text" name="comment" placeholder="Причина или пояснение"></label>
      `,
      "attendance",
      "Сохранить посещаемость"
    ),
    managementFormCard(
      "Добавить достижение",
      `
        <label>Ученик<select name="studentEmail" required>${studentOptions}</select></label>
        <label>Заголовок<input type="text" name="title" placeholder="Победа в олимпиаде" required></label>
        <label>Описание<textarea name="body" rows="3" placeholder="Короткое описание достижения"></textarea></label>
      `,
      "achievement",
      "Сохранить достижение"
    )
  ];

  const adminForms = [
    managementFormCard(
      "Опубликовать объявление",
      `
        <label>Заголовок<input type="text" name="title" placeholder="Родительское собрание" required></label>
        <label>Текст<textarea name="body" rows="3" placeholder="Текст объявления" required></textarea></label>
        <label>Аудитория
          <select name="audience">
            <option value="school">Вся школа</option>
            <option value="students">Ученики</option>
            <option value="parents">Родители</option>
            <option value="teachers">Учителя</option>
          </select>
        </label>
      `,
      "announcement",
      "Опубликовать объявление"
    ),
    managementFormCard(
      "Добавить событие",
      `
        <label>Название<input type="text" name="title" placeholder="STEM Week" required></label>
        <div class="manage-form__split">
          <label>Дата<input type="date" name="eventDate" required></label>
          <span></span>
        </div>
        <label>Описание<textarea name="body" rows="3" placeholder="Что будет происходить"></textarea></label>
      `,
      "event",
      "Сохранить событие"
    ),
    managementFormCard(
      "Карточка для стенгазеты",
      `
        <label>Заголовок<input type="text" name="title" placeholder="Топ ученица недели" required></label>
        <label>Описание<textarea name="body" rows="3" placeholder="Краткий текст для общего экрана"></textarea></label>
      `,
      "kiosk",
      "Добавить в стенгазету"
    )
  ];

  elements.managementSection.innerHTML = `
    <div class="management-header">
      <p class="eyebrow">Управление данными</p>
      <h2>${role === "teacher" ? "Учитель добавляет реальные записи класса" : "Администратор управляет публикациями школы"}</h2>
    </div>
    <div class="management-grid">
      ${(role === "teacher" ? teacherForms : adminForms).join("")}
    </div>
    <div class="manage-feedback" id="manage-feedback" aria-live="polite"></div>
  `;

  bindManagementForms();
}

function renderDashboard() {
  updateUserChrome();
  renderHero();
  renderSummary();

  if (!state.dashboard || currentRole() === "guest") {
    renderGuestDashboard();
    renderManagementSection();
    renderKiosk();
    return;
  }

  const records = state.dashboard.records || {};
  const role = currentRole();
  if (role === "student") {
    renderStudentDashboard(records);
  } else if (role === "parent") {
    renderParentDashboard(records);
  } else if (role === "teacher") {
    renderTeacherDashboard(records);
  } else if (role === "admin") {
    renderAdminDashboard(records);
  }

  renderManagementSection();
  renderKiosk();
}

function renderAiResponse(result) {
  const sections = result.sections || {
    diagnosis: result.text,
    actions: [],
    outlook: "Продолжайте отслеживать изменения в системе."
  };

  elements.aiOutput.innerHTML = `
    <div class="ai-response">
      <article class="ai-response__card">
        <span class="ai-response__label">Диагноз</span>
        <div class="ai-response__text">${formatAiText(sections.diagnosis || "Недостаточно данных")}</div>
      </article>
      <article class="ai-response__card">
        <span class="ai-response__label">Действия на неделю</span>
        <ul class="ai-response__list">
          ${(sections.actions || []).map((item) => `<li>${formatAiText(item)}</li>`).join("") || "<li>Нет конкретных действий.</li>"}
        </ul>
      </article>
      <article class="ai-response__card">
        <span class="ai-response__label">Профориентация / мотивация</span>
        <div class="ai-response__text">${formatAiText(sections.outlook || "Продолжайте развивать сильные стороны.")}</div>
      </article>
    </div>
  `;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatAiText(text) {
  const escaped = escapeHtml(text);
  const withoutMarkdownBullets = escaped.replace(/^\s*[\*\-]\s+/gm, "");
  const strongFormatted = withoutMarkdownBullets.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  const emphasisFormatted = strongFormatted.replace(/\*(.+?)\*/g, "<span class=\"ai-response__emphasis\">$1</span>");
  return emphasisFormatted.replace(/\n/g, "<br>");
}

async function requestAiAdvice(customPrompt) {
  elements.aiStatus.textContent = "Loading";

  const records = state.dashboard?.records || {};
  const grades = (records.grades || []).map((item) => ({
    subject: item.subject,
    scorePercent: item.scorePercent
  }));

  try {
    const result = await apiRequest("/api/ai-advice", {
      role: currentRole(),
      prompt: customPrompt,
      grades,
      attendance: records.attendance || [],
      achievements: records.achievements || [],
      events: state.dashboard?.events || []
    });

    elements.aiStatus.textContent = result.source === "gemini"
      ? `Gemini · ${result.model}`
      : result.source === "openai"
        ? `OpenAI · ${result.model}`
        : "Fallback";
    renderAiResponse(result);
  } catch (error) {
    elements.aiStatus.textContent = "Error";
    elements.aiOutput.innerHTML = `
      <div class="ai-response">
        <article class="ai-response__card ai-response__card--error">
          <span class="ai-response__label">Ошибка AI</span>
          <strong>${error.message}</strong>
        </article>
      </div>
    `;
  }
}

function renderKiosk() {
  const items = state.dashboard?.kioskHighlights || [];
  if (!items.length) {
    elements.kioskFeed.innerHTML = renderEmptyState(
      "Стенгазета пока пуста",
      "Администратор ещё не добавил карточки для общего экрана."
    );
    return;
  }

  elements.kioskFeed.innerHTML = items
    .map((item) => `
      <article class="kiosk-item">
        <div class="record-head">
          <strong>${item.title}</strong>
          ${currentRole() === "admin" ? `<button class="record-delete record-delete--dark" type="button" data-delete-type="kiosk" data-delete-id="${item.id}">Удалить</button>` : ""}
        </div>
        <p>${item.body || "Без описания"}</p>
      </article>
    `)
    .join("");
}

async function createRecord(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const type = form.dataset.createType;
  const formData = new FormData(form);
  const payload = {};

  formData.forEach((value, key) => {
    payload[key] = String(value).trim();
  });

  if (payload.score) {
    payload.score = Number(payload.score);
  }
  if (payload.maxScore) {
    payload.maxScore = Number(payload.maxScore);
  }

  const feedback = document.querySelector("#manage-feedback");

  try {
    const result = await apiRequest("/api/data/create", {
      actor: state.user,
      type,
      data: payload
    });
    if (feedback) {
      feedback.textContent = result.message;
      feedback.dataset.tone = "success";
    }
    form.reset();
    await loadDashboard();
  } catch (error) {
    if (feedback) {
      feedback.textContent = error.message;
      feedback.dataset.tone = "error";
    }
  }
}

function bindManagementForms() {
  document.querySelectorAll(".manage-form").forEach((form) => {
    form.addEventListener("submit", createRecord);
  });
}

async function deleteRecord(button) {
  const type = button.dataset.deleteType;
  const id = button.dataset.deleteId;
  const feedback = document.querySelector("#manage-feedback");

  try {
    button.disabled = true;
    const result = await apiRequest("/api/data/delete", {
      actor: state.user,
      type,
      id
    });
    if (feedback) {
      feedback.textContent = result.message;
      feedback.dataset.tone = "success";
    }
    await loadDashboard();
  } catch (error) {
    if (feedback) {
      feedback.textContent = error.message;
      feedback.dataset.tone = "error";
    }
  } finally {
    button.disabled = false;
  }
}

function handleDocumentClick(event) {
  const deleteButton = event.target.closest(".record-delete");
  if (deleteButton) {
    deleteRecord(deleteButton);
  }
}

async function registerUser(event) {
  event.preventDefault();
  const formData = new FormData(elements.registerForm);
  const role = String(formData.get("role"));
  const payload = {
    fullName: String(formData.get("fullName") || "").trim(),
    email: String(formData.get("email") || "").trim(),
    password: String(formData.get("password") || ""),
    role,
    profile: {}
  };

  if (role === "student") {
    payload.profile.className = String(formData.get("className") || "").trim();
    payload.profile.studentId = String(formData.get("studentId") || "").trim();
  } else if (role === "teacher") {
    payload.profile.subject = String(formData.get("subject") || "").trim();
    payload.profile.staffId = String(formData.get("staffId") || "").trim();
  } else if (role === "parent") {
    payload.profile.childName = String(formData.get("childName") || "").trim();
    payload.profile.childEmail = String(formData.get("childEmail") || "").trim();
  }

  try {
    const result = await apiRequest("/api/auth/register", payload);
    setAuthMessage(result.message, "success");
    setActiveAuthTab("login");
    elements.loginForm.elements.email.value = payload.email;
  } catch (error) {
    setAuthMessage(error.message, "error");
  }
}

async function loginUser(event) {
  event.preventDefault();
  const formData = new FormData(elements.loginForm);
  try {
    const result = await apiRequest("/api/auth/login", {
      email: String(formData.get("email") || "").trim(),
      password: String(formData.get("password") || "")
    });

    state.user = result.user;
    saveStoredUser(result.user);
    closeAuthModal();
    await loadDashboard();
  } catch (error) {
    setAuthMessage(error.message, "error");
  }
}

async function logoutUser() {
  state.user = null;
  state.dashboard = null;
  clearStoredUser();
  elements.aiStatus.textContent = "Mock";
  elements.aiOutput.innerHTML = `
    <strong>Что умеет блок</strong>
    <p>Берёт реальные записи портала по текущему пользователю и формирует структурированные рекомендации.</p>
  `;
  await loadDashboard();
}

function scrollToSection(section) {
  const map = {
    overview: "#overview-section",
    records: "#records-section",
    manage: "#manage-section",
    ai: "#ai-section",
    wall: "#wall-section"
  };
  document.querySelector(map[section] || "#overview-section")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function startKioskAutoScroll() {
  stopKioskAutoScroll();
  state.autoScrollTimer = window.setInterval(() => {
    if (!state.kioskMode) {
      return;
    }
    const max = elements.kioskFeed.scrollHeight - elements.kioskFeed.clientHeight;
    if (elements.kioskFeed.scrollTop >= max - 2) {
      elements.kioskFeed.scrollTop = 0;
      return;
    }
    elements.kioskFeed.scrollTop += 1;
  }, 35);
}

function stopKioskAutoScroll() {
  if (state.autoScrollTimer) {
    window.clearInterval(state.autoScrollTimer);
    state.autoScrollTimer = null;
  }
}

function toggleKioskMode() {
  state.kioskMode = !state.kioskMode;
  document.body.classList.toggle("kiosk-mode", state.kioskMode);
  if (state.kioskMode) {
    startKioskAutoScroll();
  } else {
    stopKioskAutoScroll();
  }
}

function bindEvents() {
  elements.openAuth?.addEventListener("click", () => openAuthModal("login"));
  elements.openAuthHero?.addEventListener("click", () => openAuthModal("register"));
  elements.closeAuth?.addEventListener("click", closeAuthModal);
  elements.authBackdrop?.addEventListener("click", closeAuthModal);
  elements.logoutButton?.addEventListener("click", logoutUser);
  elements.authTabs.forEach((button) => {
    button.addEventListener("click", () => setActiveAuthTab(button.dataset.authTab));
  });
  elements.registerRole?.addEventListener("change", (event) => renderRoleFields(event.target.value));
  elements.loginForm?.addEventListener("submit", loginUser);
  elements.registerForm?.addEventListener("submit", registerUser);
  elements.aiForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    await requestAiAdvice(elements.aiPrompt.value.trim() || "Проанализируй текущие записи и предложи план действий на неделю.");
  });
  elements.refreshAi?.addEventListener("click", async () => {
    await requestAiAdvice("Проанализируй текущие данные пользователя и выдели ближайшие действия.");
  });
  elements.toggleKiosk?.addEventListener("click", toggleKioskMode);
  document.addEventListener("click", handleDocumentClick);
  elements.navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      elements.navLinks.forEach((item) => item.classList.remove("is-active"));
      link.classList.add("is-active");
      scrollToSection(link.dataset.section);
    });
  });
}

async function init() {
  renderRoleFields("student");
  bindEvents();
  await loadDashboard();
}

init();
