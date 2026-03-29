import {
  achievementItems,
  aiBenefits,
  featureCards,
  kioskItems,
  newsCards,
  pulseMetrics,
  roleCards,
} from "./content";

export function HighlightsSection() {
  return (
    <>
      <section className="mt-6 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-[32px] bg-white/80 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-700">
            Новости школы
          </p>
          <div className="mt-4 grid gap-4">
            {newsCards.map((card) => (
              <article key={card.title} className={`rounded-[28px] p-5 ${card.tone}`}>
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
            Пульс школы
          </p>
          <h2 className="font-display mt-2 text-3xl font-bold">
            Мониторинг успеваемости в реальном времени
          </h2>
          <div className="mt-6 space-y-4">
            {pulseMetrics.map(([label, value]) => (
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
            <p className="text-sm text-emerald-50/70">AI-инсайт недели</p>
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
            Всё, что раньше было разрознено, теперь связано
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
            {roleCards.map((card) => (
              <div
                key={card.role}
                className="rounded-[24px] border border-amber-200/70 bg-white/80 p-5"
              >
                <p className="font-display text-xl font-bold text-slate-950">
                  {card.role}
                </p>
                <p className="mt-2 text-sm leading-7 text-slate-600">{card.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="ai-mentor" className="mt-6 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[32px] bg-[#0d2f37] p-6 text-white shadow-[0_20px_60px_rgba(13,47,55,0.28)]">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-100/80">
            AI-наставник
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
              У ученика сильная динамика по английскому и информатике. По алгебре средний
              балл снизился на 0.5 за последние три недели, поэтому система рекомендует
              3 короткие практики и консультацию у учителя.
            </p>
          </div>
        </div>

        <div className="rounded-[32px] border border-slate-200/70 bg-white/80 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
          <div className="grid gap-4 sm:grid-cols-2">
            {aiBenefits.map((text, index) => (
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
            В центре внимания
          </p>
          <h2 className="font-display mt-2 text-3xl font-bold text-slate-950">
            Достижения как часть живой школьной культуры
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {achievementItems.map((item) => (
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
            Режим киоска
          </p>
          <h2 className="font-display mt-2 text-3xl font-bold">
            Стенгазета для интерактивной доски
          </h2>
          <div className="mt-6 space-y-4">
            {kioskItems.map((item) => (
              <div key={item} className="rounded-[24px] border border-white/10 bg-white/10 p-4">
                {item}
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-[28px] bg-white/10 p-5">
            <p className="text-sm text-violet-100/80">Предпросмотр</p>
            <p className="mt-3 text-lg font-semibold">
              Новости. Топ недели. Достижения. События. Всё читается с расстояния и
              работает как цифровая школьная стенгазета.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
