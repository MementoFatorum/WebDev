import {
  FooterCta,
  HighlightsSection,
  HeroSection,
  OverviewSection,
  SiteHeader,
  StatsSection,
} from "@/components/home";

export default function Home() {
  return (
    <main className="text-slate-900">
      <section className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        <SiteHeader />
        <HeroSection />
        <OverviewSection />
        <HighlightsSection />
        <StatsSection />
        <FooterCta />
      </section>
    </main>
  );
}
