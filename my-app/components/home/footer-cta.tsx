export function FooterCta() {
  return (
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
            Главная страница уже задаёт тон всему продукту: официальный школьный портал
            с живой аналитикой, AI-наставником и акцентом на рост ученика.
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
  );
}
