export default function Home() {
  const quickLinks = [
    "Расписание",
    "Оценки",
    "События",
    "Достижения",
    "AI-наставник",
    "Kiosk Mode",
  ];

  const featureCards = [
    {
      title: "Успеваемость",
      text: "Собираем оценки, динамику по предметам и сигналы для раннего реагирования.",
    },
    {
      title: "Достижения",
      text: "Показываем олимпиады, спорт, дебаты, волонтерство и творческие победы.",
    },
    {
      title: "Школьные события",
      text: "Новости, объявления и календарь школы живут в одном понятном потоке.",
    },
    {
      title: "AI Mentor",
      text: "Даёт персональные рекомендации ученику, учителю, родителю и администрации.",
    },
  ];

  const roleCards = [
    "Ученик видит рост, цели, рейтинг и персональные AI-подсказки.",
    "Учитель быстро находит учеников в зоне внимания и фиксирует победы.",
    "Родитель наблюдает динамику ребёнка без перегруза сложными таблицами.",
    "Администрация управляет новостями и видит здоровье школы на одном экране.",
  ];

  const newsCards = [
    {
      title: "Научная выставка",
      meta: "5 апреля",
      text: "Ученики представят проекты по робототехнике, биологии и городской экологии.",
    },
    {
      title: "Неделя языков",
      meta: "8 апреля",
      text: "Дебаты, speaking club и открытые уроки с приглашёнными наставниками.",
    },
    {
      title: "Победа в олимпиаде",
      meta: "Aqbobek Team",
      text: "Лицеисты взяли призовые места по английскому и информатике на городском этапе.",
    },
  ];

  const metrics = [
    { value: "1200+", label: "оценок синхронизировано" },
    { value: "300+", label: "достижений зафиксировано" },
    { value: "40+", label: "событий в школьном календаре" },
    { value: "85%", label: "AI-советов персонализированы по данным" },
  ];

  return (
    <main className="text-slate-900">
      <section className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        <header className="rounded-[30px] border border-white/60 bg-white/75 px-5 py-4 shadow-[0_18px_60px_rgba(16,24,40,0.08)] backdrop-blur md:px-7">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-display text-xl font-bold tracking-tight text-teal-950">
                  Aqbobek Portal
                </p>
                <p className="text-sm text-slate-500">
                  Unified ecosystem for Aqbobek Lyceum
                </p>
              </div>
              <div className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 lg:hidden">
                RU / KZ / EN
              </div>
            </div>

            <nav className="flex flex-wrap gap-3 text-sm text-slate-600">
              {["Главная", "Новости", "Успеваемость", "Достижения", "AI Mentor", "Kiosk"].map(
                (item) => (
                  <a
                    key={item}
                    href="#"
                    className="rounded-full px-3 py-2 transition hover:bg-slate-100 hover:text-slate-900"
                  >
                    {item}
                  </a>
                ),
              )}
            </nav>

            <div className="flex items-center gap-3">
              <span className="hidden rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 lg:inline-flex">
                RU / KZ / EN
              </span>
              <a
                href="#"
                className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-900 hover:text-slate-900"
              >
                Войти
              </a>
              <a
                href="#overview"
                className="rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800"
              >
                Открыть портал
              </a>
            </div>
          </div>
        </header>

        <section className="relative mt-6 overflow-hidden rounded-[36px] bg-[#123c3a] px-6 py-8 text-white shadow-[0_24px_80px_rgba(18,60,58,0.34)] md:px-10 md:py-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.16),_transparent_25%),linear-gradient(135deg,_rgba(255,255,255,0.04),_transparent_65%)]" />
          <div className="relative grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-6">
              <div className="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-1 text-sm font-medium text-emerald-50">
                Единый школьный портал Aqbobek Lyceum
              </div>
              <div className="space-y-4">
                <h1 className="font-display max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                  Школа в одном цифровом пространстве
                </h1>
                <p className="max-w-2xl text-lg leading-8 text-emerald-50/82">
                  Оценки, достижения, школьные события и AI-поддержка для ученика,
                  учителя, родителя и администрации. Основа как у школьного портала,
                  ощущение как у современного edtech-продукта.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <a
                  href="#overview"
                  className="rounded-full bg-[#f4b860] px-6 py-3 text-center text-sm font-bold text-slate-950 transition hover:bg-[#ffcb7f]"
                >
                  Смотреть демо
                </a>
                <a
                  href="#ai-mentor"
                  className="rounded-full border border-white/20 bg-white/10 px-6 py-3 text-center text-sm font-bold text-white transition hover:bg-white/18"
                >
                  Посмотреть AI-анализ
                </a>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  ["Средний балл", "4.6", "+0.4 за месяц"],
                  ["AI Insight недели", "8 учеников", "в зоне внимания"],
                  ["Новые достижения", "12", "добавлено за неделю"],
                  ["События недели", "5", "готовы для kiosk mode"],
                ].map(([label, value, sub]) => (
                  <div
                    key={label}
                    className="rounded-3xl border border-white/10 bg-white/10 p-4 backdrop-blur"
                  >
                    <p className="text-sm text-emerald-50/75">{label}</p>
                    <p className="mt-3 font-display text-3xl font-bold">{value}</p>
                    <p className="mt-1 text-sm text-emerald-50/75">{sub}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-4">
              <div className="rounded-[28px] bg-[#f8f7f2] p-5 text-slate-900">
                <div className="flex items-center justify-between text-sm text-slate-500">
                  <span>Academic Progress</span>
                  <span>Quarter 3</span>
                </div>
                <div className="mt-5 flex h-40 items-end gap-3">
                  {[45, 68, 54, 82, 76, 98, 88].map((height, index) => (
                    <div key={height} className="flex flex-1 flex-col items-center gap-2">
                      <div
                        className={`w-full rounded-t-2xl ${
                          index > 4 ? "bg-emerald-500" : "bg-teal-900"
                        }`}
                        style={{ height: `${height}%` }}
                      />
                      <span className="text-xs text-slate-400">W{index + 1}</span>
                    </div>
                  ))}
                </div>
                <p className="mt-4 text-sm text-slate-600">
                  Лучший рост: English. Требует внимания: Algebra.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-[28px] bg-white/95 p-5 text-slate-900">
                  <p className="text-sm text-slate-500">AI Mentor Insight</p>
                  <p className="mt-3 text-lg font-bold">
                    Сильный рост в English и Informatics. Повторить Algebra 3 раза на этой
                    неделе.
                  </p>
                </div>
                <div className="rounded-[28px] border border-white/15 bg-white/10 p-5">
                  <p className="text-sm text-emerald-50/75">Top Students</p>
                  <div className="mt-4 space-y-3 text-sm">
                    {["Amina S.", "Dias K.", "Aruzhan T."].map((name, index) => (
                      <div key={name} className="flex items-center justify-between">
                        <span>
                          0{index + 1}. {name}
                        </span>
                        <span className="rounded-full bg-white/10 px-3 py-1 text-xs">
                          {4.9 - index * 0.1}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          id="overview"
          className="mt-6 rounded-[32px] border border-slate-200/70 bg-white/80 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)] backdrop-blur"
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-700">
                Быстрый доступ
              </p>
              <h2 className="font-display mt-2 text-3xl font-bold text-slate-950">
                Формат школьного портала, усиленный новыми преимуществами
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-7 text-slate-600">
              Мы сохраняем понятную логику EduPage: новости, расписание, объявления и
              роль школы. Но добавляем AI-наставника, мониторинг динамики и достижения как
              полноценный слой продукта.
            </p>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
            {quickLinks.map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-center text-sm font-semibold text-slate-700 transition hover:-translate-y-1 hover:bg-emerald-50 hover:text-emerald-800"
              >
                {item}
              </div>
            ))}
          </div>
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-[32px] bg-white/80 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-700">
              Новости школы
            </p>
            <div className="mt-4 grid gap-4">
              {newsCards.map((card, index) => (
                <article
                  key={card.title}
                  className={`rounded-[28px] p-5 ${
                    index === 0
                      ? "bg-[#f4efe2]"
                      : index === 1
                        ? "bg-[#ecf6f2]"
                        : "bg-[#eef1f7]"
                  }`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="font-display text-2xl font-bold text-slate-950">
                      {card.title}
                    </h3>
                    <span className="rounded-full bg-white/70 px-3 py-1 text-xs font-semibold text-slate-600">
                      {card.meta}
                    </span>
                  </div>
                  <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
                    {card.text}
                  </p>
                </article>
              ))}
            </div>
          </div>

          <div className="rounded-[32px] bg-[#1d4d4d] p-6 text-white shadow-[0_20px_60px_rgba(29,77,77,0.25)]">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-100/80">
              School Pulse
            </p>
            <h2 className="font-display mt-2 text-3xl font-bold">
              Мониторинг успеваемости в реальном времени
            </h2>
            <div className="mt-6 space-y-4">
              {[
                ["Средний балл по школе", "4.3"],
                ["Ученики в зоне внимания", "8"],
                ["Лучший рост за месяц", "23 ученика"],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/8 px-4 py-4"
                >
                  <span className="text-sm text-emerald-50/80">{label}</span>
                  <span className="font-display text-2xl font-bold">{value}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-[28px] bg-white/10 p-5">
              <p className="text-sm text-emerald-50/70">AI Insight of the week</p>
              <p className="mt-3 text-lg font-semibold">
                У большинства 8-х классов просадка по алгебре, но заметный рост по
                английскому и дебатной активности.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="rounded-[32px] border border-slate-200/70 bg-white/80 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-700">
              Преимущества
            </p>
            <h2 className="font-display mt-2 text-3xl font-bold text-slate-950">
              Все, что раньше было разрознено, теперь связано
            </h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {featureCards.map((card) => (
                <div key={card.title} className="rounded-[24px] bg-slate-50 p-5">
                  <h3 className="font-display text-xl font-bold text-slate-950">
                    {card.title}
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-slate-600">{card.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[32px] border border-slate-200/70 bg-[#f6f1e4] p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-amber-700">
              Роли системы
            </p>
            <h2 className="font-display mt-2 text-3xl font-bold text-slate-950">
              Один портал для всей школьной экосистемы
            </h2>
            <div className="mt-6 space-y-4">
              {["Ученик", "Учитель", "Родитель", "Администрация"].map((role, index) => (
                <div
                  key={role}
                  className="rounded-[24px] border border-amber-200/70 bg-white/80 p-5"
                >
                  <p className="font-display text-xl font-bold text-slate-950">{role}</p>
                  <p className="mt-2 text-sm leading-7 text-slate-600">{roleCards[index]}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="ai-mentor" className="mt-6 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[32px] bg-[#0d2f37] p-6 text-white shadow-[0_20px_60px_rgba(13,47,55,0.28)]">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-100/80">
              AI Mentor
            </p>
            <h2 className="font-display mt-2 text-3xl font-bold">
              AI-наставник, который помогает расти
            </h2>
            <p className="mt-4 text-sm leading-7 text-cyan-50/78">
              Не просто чат, а слой аналитики, встроенный в учебный ритм ученика и школы.
            </p>
            <div className="mt-6 rounded-[28px] bg-white/10 p-5">
              <p className="text-sm text-cyan-50/75">Пример реального инсайта</p>
              <p className="mt-3 text-lg font-semibold">
                У ученика сильная динамика по English и Informatics. По Algebra средний
                балл снизился на 0.5 за последние три недели, поэтому система рекомендует
                3 короткие практики и консультацию у учителя.
              </p>
            </div>
          </div>

          <div className="rounded-[32px] border border-slate-200/70 bg-white/80 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                "Определяет зоны риска до того, как проблема станет системной.",
                "Подсказывает, что подтянуть именно на этой неделе.",
                "Помогает ученику ставить достижимые цели и видеть рост.",
                "Даёт профориентационные намёки на основе сильных сторон и достижений.",
              ].map((text, index) => (
                <div key={text} className="rounded-[24px] bg-slate-50 p-5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 font-display text-lg font-bold text-emerald-800">
                    0{index + 1}
                  </div>
                  <p className="mt-4 text-sm leading-7 text-slate-600">{text}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-[28px] bg-emerald-50 p-5">
              <p className="font-display text-2xl font-bold text-emerald-950">
                От данных к понятным действиям
              </p>
              <p className="mt-2 text-sm leading-7 text-emerald-900/80">
                Сначала собираем оценки и достижения, затем AI анализирует динамику, и в
                конце каждая роль видит персональные рекомендации в своём интерфейсе.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[32px] border border-slate-200/70 bg-white/80 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-700">
              Achievement Spotlight
            </p>
            <h2 className="font-display mt-2 text-3xl font-bold text-slate-950">
              Достижения как часть живой школьной культуры
            </h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {[
                "2 место на городской олимпиаде по английскому",
                "Победа в турнире по волейболу",
                "Лучший спикер школьных дебатов",
                "Волонтёрский проект по экопросвещению",
              ].map((item) => (
                <div key={item} className="rounded-[24px] bg-[#eef6f3] p-5">
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">
                    Aqbobek Pride
                  </p>
                  <p className="mt-3 text-lg font-semibold text-slate-900">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[32px] bg-[#261f3f] p-6 text-white shadow-[0_20px_60px_rgba(38,31,63,0.28)]">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-violet-100/80">
              Kiosk Mode
            </p>
            <h2 className="font-display mt-2 text-3xl font-bold">
              Стенгазета для интерактивной доски
            </h2>
            <div className="mt-6 space-y-4">
              {[
                "Крупная типографика для экранов в коридоре",
                "Автоскролл новостей, достижений и анонсов",
                "Топ учеников недели и рост месяца",
                "QR-код для быстрого перехода в портал",
              ].map((item) => (
                <div key={item} className="rounded-[24px] border border-white/10 bg-white/10 p-4">
                  {item}
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-[28px] bg-white/10 p-5">
              <p className="text-sm text-violet-100/80">Preview</p>
              <p className="mt-3 text-lg font-semibold">
                Новости. Топ недели. Достижения. События. Всё читается с расстояния и
                работает как цифровая школьная стенгазета.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-6 rounded-[32px] border border-slate-200/70 bg-white/80 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-700">
                Метрики
              </p>
              <h2 className="font-display mt-2 text-3xl font-bold text-slate-950">
                Портал, который делает школьную жизнь видимой
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-7 text-slate-600">
              Здесь можно будет выводить реальные показатели после подключения BilimClass
              или использовать качественный mock API для хакатонного MVP.
            </p>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {metrics.map((metric) => (
              <div key={metric.label} className="rounded-[24px] bg-slate-50 p-5">
                <p className="font-display text-4xl font-bold text-slate-950">
                  {metric.value}
                </p>
                <p className="mt-2 text-sm leading-7 text-slate-600">{metric.label}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-6 mb-4 rounded-[36px] bg-slate-950 px-6 py-8 text-white shadow-[0_22px_80px_rgba(15,23,42,0.28)] md:px-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-300">
                Aqbobek Lyceum
              </p>
              <h2 className="font-display mt-2 max-w-3xl text-4xl font-bold">
                Единая цифровая экосистема школы: от успеваемости до мотивации
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">
                Главная страница уже задаёт тон всему продукту: официальный школьный
                портал с живой аналитикой, AI-наставником и акцентом на рост ученика.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <a
                href="#"
                className="rounded-full bg-[#f4b860] px-6 py-3 text-center text-sm font-bold text-slate-950 transition hover:bg-[#ffcb7f]"
              >
                Открыть портал
              </a>
              <a
                href="#"
                className="rounded-full border border-white/15 px-6 py-3 text-center text-sm font-bold text-white transition hover:bg-white/8"
              >
                Запустить демо
              </a>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
