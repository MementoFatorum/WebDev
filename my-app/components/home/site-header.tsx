import { navItems } from "./content";

export function SiteHeader() {
  return (
    <header className="rounded-[30px] border border-white/60 bg-white/75 px-5 py-4 shadow-[0_18px_60px_rgba(16,24,40,0.08)] backdrop-blur md:px-7">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="font-display text-xl font-bold tracking-tight text-teal-950">
              Aqbobek Portal
            </p>
            <p className="text-sm text-slate-500">Единая экосистема Aqbobek Lyceum</p>
          </div>
          <div className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 lg:hidden">
            RU / KZ / EN
          </div>
        </div>

        <nav className="flex flex-wrap gap-3 text-sm text-slate-600">
          {navItems.map((item) => (
            <a
              key={item}
              href="#"
              className="rounded-full px-3 py-2 transition hover:bg-slate-100 hover:text-slate-900"
            >
              {item}
            </a>
          ))}
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
  );
}
