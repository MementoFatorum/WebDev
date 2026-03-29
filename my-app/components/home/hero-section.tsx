import { chartHeights, heroStats, topStudents } from "./content";

export function HeroSection() {
  return (
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
              Оценки, достижения, школьные события и AI-поддержка для ученика, учителя,
              родителя и администрации. Основа как у школьного портала, ощущение как у
              современного edtech-продукта.
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
            {heroStats.map((item) => (
              <div
                key={item.label}
                className="rounded-3xl border border-white/10 bg-white/10 p-4 backdrop-blur"
              >
                <p className="text-sm text-emerald-50/75">{item.label}</p>
                <p className="mt-3 font-display text-3xl font-bold">{item.value}</p>
                <p className="mt-1 text-sm text-emerald-50/75">{item.sublabel}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-4">
          <div className="rounded-[28px] bg-[#f8f7f2] p-5 text-slate-900">
            <div className="flex items-center justify-between text-sm text-slate-500">
              <span>Учебный прогресс</span>
              <span>3 четверть</span>
            </div>
            <div className="mt-5 flex h-40 items-end gap-3">
              {chartHeights.map((height, index) => (
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
              Лучший рост: английский язык. Требует внимания: алгебра.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-[28px] bg-white/95 p-5 text-slate-900">
              <p className="text-sm text-slate-500">Инсайт AI-наставника</p>
              <p className="mt-3 text-lg font-bold">
                Сильный рост по английскому и информатике. Повторить алгебру 3 раза на
                этой неделе.
              </p>
            </div>
            <div className="rounded-[28px] border border-white/15 bg-white/10 p-5">
              <p className="text-sm text-emerald-50/75">Топ учеников</p>
              <div className="mt-4 space-y-3 text-sm">
                {topStudents.map((name, index) => (
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
  );
}
