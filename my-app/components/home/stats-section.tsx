import { metrics } from "./content";

export function StatsSection() {
  return (
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
  );
}
