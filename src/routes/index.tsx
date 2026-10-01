import { createFileRoute, Link } from "@tanstack/react-router";
import { PageIntro } from "@/components/AppShell";
import { useWellness } from "@/components/WellnessContext";
import wellnessImage from "@/assets/mindease-wellness.jpg";
import { ari, band } from "@/lib/wellness";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MindEase AI — Overview" },
      {
        name: "description",
        content: "Explore your wellness check-ins, educational tools, and personal progress.",
      },
      {
        property: "og:title",
        content: "MindEase AI — Overview",
      },
      {
        property: "og:description",
        content: "Explore your wellness check-ins, educational tools, and personal progress.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Overview,
});

function Overview() {
  const { entries, isDemo } = useWellness();
  const latest = entries.at(-1);
  const latestSaved = isDemo ? undefined : latest;
  const score = latest ? ari(latest) : 0;
  const ringRadius = 56;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const normalizedScore = Math.min(100, Math.max(0, score));
  const ringOffset = ringCircumference - (normalizedScore / 100) * ringCircumference;

  return (
    <div className="page-wrap overview-page py-10">
      <PageIntro
        eyebrow="Your MindEase overview"
        title="A little progress, at your pace"
        description="A private space to understand patterns, learn about anxiety, and find small steps that feel manageable."
      />
      {isDemo && (
        <p className="mb-6 rounded-2xl border border-border/80 bg-secondary/80 p-4 text-sm text-secondary-foreground shadow-[0_12px_30px_rgba(168,85,247,0.08)] backdrop-blur-sm">
          Sample analytics are shown until you add your own check-in.
        </p>
      )}

      <div className="overview-atmosphere" aria-hidden="true">
        <span className="overview-orb overview-orb--lavender" />
        <span className="overview-orb overview-orb--pink" />
        <span className="overview-orb overview-orb--violet" />
      </div>

      <section className="overview-hero mx-auto mt-6 w-full max-w-6xl overflow-hidden rounded-4xl border border-border/80 bg-card/70 shadow-[0_28px_80px_rgba(91,61,111,0.12)] backdrop-blur-md sm:rounded-[36px]">
        <div className="overview-hero__image-wrap">
          <div className="overview-hero__spotlight" aria-hidden="true" />
          <img
            src={wellnessImage}
            alt="A woman sitting by a window with a drink, reflecting on her day"
            className="block h-55 w-full object-cover sm:h-70 md:h-90 lg:h-105 xl:h-117.5"
          />
        </div>
      </section>

      <section aria-label="Wellness summary" className="overview-summary mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <div className="surface overview-stat rounded-[22px] p-6">
          <p className="label-caps text-muted-foreground">Check-ins saved</p>
          <p className="mt-4 font-display text-3xl font-extrabold text-primary">
            {isDemo ? 0 : entries.length}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">Your wellness journey begins today.</p>
        </div>

        <div className="surface overview-stat overview-stat--featured wellness-index-card rounded-[22px] p-6">
          <div className="overview-index-header">
            <p className="label-caps text-muted-foreground">Illustrative wellness index</p>
          </div>

          <div className="wellness-ring-wrap">
            <div className="wellness-ring" aria-label={`${normalizedScore} out of 100`}>
              <svg viewBox="0 0 140 140" className="wellness-ring__svg" role="img" aria-hidden="true">
                <defs>
                  <linearGradient id="overviewRingGradient" x1="0%" x2="100%" y1="0%" y2="100%">
                    <stop offset="0%" stopColor="#a855f7" />
                    <stop offset="60%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#f9a8d4" />
                  </linearGradient>
                </defs>
                <circle cx="70" cy="70" r={ringRadius} className="wellness-ring__track" />
                <circle
                  cx="70"
                  cy="70"
                  r={ringRadius}
                  className="wellness-ring__progress"
                  style={{ strokeDasharray: ringCircumference, strokeDashoffset: ringOffset }}
                />
              </svg>
              <div className="wellness-ring__value">
                <span className="wellness-index-value">{score}</span>
                <small>/ 100</small>
              </div>
            </div>
          </div>

          <p className="mt-1 text-sm text-muted-foreground">{band(score)} · educational, not diagnostic</p>
        </div>

        <div className="surface overview-stat rounded-[22px] p-6">
          <p className="label-caps text-muted-foreground">Most recent check-in</p>
          <p className="mt-4 font-display text-lg font-bold text-foreground">
            {latestSaved
              ? new Date(`${latestSaved.date}T00:00:00`).toLocaleDateString()
              : "Not started"}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            {latestSaved
              ? "Your reflection stays on this device."
              : "Small steps create meaningful change."}
          </p>
        </div>
      </section>

      <section aria-label="Explore MindEase" className="overview-actions mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {[
          {
            to: "/progress-tracker",
            title: "Daily check-in",
            detail: "Record how you are feeling.",
          },
          {
            to: "/ai-wellness-guide",
            title: "Wellness guide",
            detail: "Explore educational answers and ideas.",
          },
          {
            to: "/behavioral-analytics",
            title: "Behavioral analytics",
            detail: "Review self-reported patterns.",
          },
        ].map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="surface overview-action group rounded-[22px] p-6 text-foreground no-underline"
          >
            <h2 className="font-display text-lg font-bold">{item.title}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{item.detail}</p>
            <span className="mt-5 inline-block text-sm font-semibold text-primary">Explore</span>
          </Link>
        ))}
      </section>
    </div>
  );
}
