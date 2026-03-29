import { quickLinks } from "./content";

export function OverviewSection() {
  return (
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
          Мы сохраняем понятную логику EduPage: новости, расписание, объявления и роль
          школы. Но добавляем AI-наставника, мониторинг динамики и достижения как
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
  );
}
