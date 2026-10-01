import { Link, useLocation } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Activity,
  ArrowUpRight,
  BookOpen,
  Brain,
  ChartNoAxesCombined,
  CircleHelp,
  Compass,
  Heart,
  Home,
  LibraryBig,
  Mail,
  Menu,
  Moon,
  NotebookPen,
  ShieldCheck,
  Sparkles,
  Sun,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";

gsap.registerPlugin(ScrollTrigger);
const links = [
  { to: "/", label: "Overview", icon: Home },
  { to: "/understanding-anxiety", label: "Understanding anxiety", icon: Brain },
  { to: "/anxiety-disorders", label: "Anxiety disorders", icon: BookOpen },
  { to: "/ai-wellness-guide", label: "AI wellness guide", icon: Sparkles },
  { to: "/recovery-journey", label: "90-day journey", icon: Compass },
  { to: "/behavioral-analytics", label: "Behavioral analytics", icon: ChartNoAxesCombined },
  { to: "/progress-tracker", label: "Progress tracker", icon: Activity },
  { to: "/case-studies", label: "Case studies", icon: LibraryBig },
  { to: "/research-center", label: "Research center", icon: NotebookPen },
  { to: "/resources", label: "Resources", icon: CircleHelp },
  { to: "/about", label: "About", icon: Heart },
  { to: "/contact", label: "Contact", icon: Mail },
] as const;
export function AppShell({ children }: { children: React.ReactNode }) {
  const [dark, setDark] = useState(false),
    [open, setOpen] = useState(false);
  const location = useLocation();
  const reduced = useReducedMotion();
  const mainRef = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const saved = localStorage.getItem("mindease-theme-v2");
    const value = saved === "dark";
    setDark(value);
    document.documentElement.classList.toggle("dark", value);
  }, []);
  useEffect(() => setOpen(false), [location.pathname]);
  useEffect(() => {
    if (!mainRef.current || reduced) return;
    let context: gsap.Context | undefined;
    let secondFrame = 0;
    const removeButtonHover: (() => void)[] = [];
    const firstFrame = requestAnimationFrame(() => {
      secondFrame = requestAnimationFrame(() => {
        const main = mainRef.current;
        if (!main) return;
        context = gsap.context(() => {
          const shell = main.closest<HTMLElement>(".platform-shell");
          if (shell) {
            gsap.to(shell, {
              "--ambient-left-x": "14%",
              "--ambient-left-y": "18%",
              "--ambient-right-x": "86%",
              "--ambient-right-y": "22%",
              "--ambient-center-x": "54%",
              "--ambient-center-y": "62%",
              duration: 32,
              ease: "sine.inOut",
              repeat: -1,
              yoyo: true,
            });
            gsap.to(shell, {
              "--journey-depth": 1,
              ease: "none",
              scrollTrigger: {
                trigger: shell,
                start: "top top",
                end: "bottom bottom",
                scrub: 1.3,
              },
            });
            const updateSpotlight = (event: PointerEvent) => {
              if (event.pointerType !== "mouse") return;
              shell.style.setProperty(
                "--spotlight-x",
                `${(event.clientX / window.innerWidth) * 100}%`,
              );
              shell.style.setProperty(
                "--spotlight-y",
                `${(event.clientY / window.innerHeight) * 100}%`,
              );
              shell.classList.add("has-spotlight");
            };
            shell.addEventListener("pointermove", updateSpotlight, { passive: true });
            removeButtonHover.push(() => {
              shell.removeEventListener("pointermove", updateSpotlight);
              shell.classList.remove("has-spotlight");
              shell.style.removeProperty("--spotlight-x");
              shell.style.removeProperty("--spotlight-y");
            });
          }

          const heroTitle = main.querySelector<HTMLElement>(".page-intro h1");
          if (main.dataset["page"] === "overview" && heroTitle) {
            gsap.fromTo(
              heroTitle,
              { autoAlpha: 0, y: 30, filter: "blur(10px)" },
              {
                autoAlpha: 1,
                y: 0,
                filter: "blur(0px)",
                duration: 1.2,
                ease: "power3.out",
              },
            );
          } else {
            const words = gsap.utils.toArray<HTMLElement>(".page-title-word");
            gsap.fromTo(
              words,
              {
                autoAlpha: 0,
                yPercent: 62,
                filter: "blur(7px)",
                clipPath: "inset(0 0 100% 0)",
              },
              {
                autoAlpha: 1,
                yPercent: 0,
                filter: "blur(0px)",
                clipPath: "inset(0 0 0% 0)",
                duration: 1.05,
                stagger: 0.045,
                ease: "power3.out",
              },
            );
          }

          gsap.utils.toArray<HTMLElement>(".section-heading h2").forEach((heading, index) => {
            gsap.fromTo(
              heading,
              { autoAlpha: 0, y: 50, filter: "blur(12px)" },
              {
                autoAlpha: 1,
                y: 0,
                filter: "blur(0px)",
                duration: 1.2,
                delay: Math.min((index % 4) * 0.1, 0.3),
                ease: "power3.out",
                scrollTrigger: { trigger: heading, start: "top 88%", once: true },
              },
            );
          });
          gsap.fromTo(
            ".page-intro > p:last-child",
            { autoAlpha: 0, y: 12, filter: "blur(3px)" },
            {
              autoAlpha: 1,
              y: 0,
              filter: "blur(0px)",
              duration: 0.9,
              delay: 0.25,
              ease: "power3.out",
            },
          );

          const pageSections = gsap.utils
            .toArray<HTMLElement>(".page-wrap > :not(.page-intro):not(.overview-atmosphere)", main)
            .filter((section) => !section.matches(".surface") && !section.querySelector(".surface"));
          if (pageSections.length) {
            gsap.set(pageSections, { autoAlpha: 0, y: 50, filter: "blur(12px)" });
            ScrollTrigger.batch(pageSections, {
              start: "top 88%",
              once: true,
              onEnter: (batch) =>
                gsap.to(batch, {
                  autoAlpha: 1,
                  y: 0,
                  filter: "blur(0px)",
                  duration: 1.2,
                  stagger: 0.1,
                  ease: "power3.out",
                  overwrite: "auto",
                }),
            });
          }

          const surfaces = gsap.utils.toArray<HTMLElement>(".surface");
          if (surfaces.length) {
            gsap.set(surfaces, { autoAlpha: 0, y: 50, filter: "blur(12px)" });
            ScrollTrigger.batch(surfaces, {
              start: "top 88%",
              once: true,
              onEnter: (batch) =>
                gsap.to(batch, {
                  autoAlpha: 1,
                  y: 0,
                  filter: "blur(0px)",
                  duration: 1.2,
                  stagger: 0.1,
                  ease: "power3.out",
                  overwrite: "auto",
                }),
            });
          }

          const journeyMilestones = gsap.utils.toArray<HTMLElement>(
            '.platform-main[data-page="recovery-journey"] .border-l-2',
            main,
          );
          journeyMilestones.forEach((milestone) => {
            const marker = milestone.querySelector<HTMLElement>("span");
            gsap.fromTo(
              milestone,
              { borderColor: "rgba(168,85,247,0.16)" },
              {
                borderColor: "rgba(168,85,247,0.82)",
                duration: 0.85,
                ease: "power2.out",
                scrollTrigger: { trigger: milestone, start: "top 84%", once: true },
              },
            );
            if (marker) {
              gsap.fromTo(
                marker,
                { scale: 0.96, boxShadow: "0 0 0 rgba(168,85,247,0)" },
                {
                  scale: 1,
                  boxShadow: "0 0 18px rgba(168,85,247,0.22)",
                  duration: 0.8,
                  ease: "power2.out",
                  scrollTrigger: { trigger: milestone, start: "top 84%", once: true },
                },
              );
            }
          });

          const revealImages = gsap.utils.toArray<HTMLImageElement>(
            ".surface img, .overview-hero__image-wrap img",
          );
          if (revealImages.length) {
            gsap.set(revealImages, {
              autoAlpha: 0,
              scale: 1.1,
              filter: "blur(10px)",
              clipPath: "inset(0 0 100% 0)",
              transformOrigin: "center",
            });
            ScrollTrigger.batch(revealImages, {
              start: "top 90%",
              once: true,
              onEnter: (batch) =>
                gsap.to(batch, {
                  autoAlpha: 1,
                  scale: 1,
                  filter: "blur(0px)",
                  clipPath: "inset(0 0 0% 0)",
                  duration: 1.2,
                  stagger: 0.1,
                  ease: "power3.out",
                  overwrite: "auto",
                }),
            });
          }

          const hero = main.querySelector<HTMLElement>(".overview-hero");
          const heroImage = hero?.querySelector<HTMLImageElement>("img");
          if (hero && heroImage) {
            gsap.to(heroImage, {
              yPercent: 10,
              ease: "none",
              scrollTrigger: {
                trigger: hero,
                start: "top bottom",
                end: "bottom top",
                scrub: 1.2,
              },
            });
          }

          gsap.utils
            .toArray<HTMLButtonElement>(
              ".platform-main button.bg-primary:not(:disabled), .platform-main a.bg-primary",
            )
            .forEach((button) => {
              let hoverTween: gsap.core.Tween | undefined;
              const animateButton = (scale: number, x = 0, y = 0) => {
                hoverTween?.kill();
                hoverTween = gsap.to(button, {
                  scale,
                  x,
                  y,
                  duration: 0.32,
                  ease: "power2.out",
                  overwrite: true,
                });
              };
              const onEnter = () => animateButton(1.03);
              const onPointerMove = (event: PointerEvent) => {
                const bounds = button.getBoundingClientRect();
                const offsetX = (event.clientX - bounds.left - bounds.width / 2) * 0.1;
                const offsetY = (event.clientY - bounds.top - bounds.height / 2) * 0.1;
                animateButton(1.03, offsetX, offsetY);
              };
              const onLeave = () => animateButton(1);
              button.addEventListener("pointerenter", onEnter);
              button.addEventListener("pointermove", onPointerMove);
              button.addEventListener("pointerleave", onLeave);
              button.addEventListener("focusin", onEnter);
              button.addEventListener("focusout", onLeave);
              removeButtonHover.push(() => {
                button.removeEventListener("pointerenter", onEnter);
                button.removeEventListener("pointermove", onPointerMove);
                button.removeEventListener("pointerleave", onLeave);
                button.removeEventListener("focusin", onEnter);
                button.removeEventListener("focusout", onLeave);
                hoverTween?.kill();
                button.style.removeProperty("transform");
              });
              });

          const wellnessScore = main.querySelector<HTMLElement>(".wellness-index-value");
          const scoreNode = wellnessScore?.firstChild;
          const scoreTarget = Number.parseFloat(scoreNode?.textContent?.trim() ?? "");
          const indexCard = wellnessScore?.closest<HTMLElement>(".wellness-index-card");
          const ring = main.querySelector<SVGCircleElement>(".wellness-ring__progress");
          if (ring && indexCard) {
            const ringTarget = Number.parseFloat(ring.style.strokeDashoffset);
            gsap.fromTo(
              ring,
              { strokeDashoffset: ring.getTotalLength() },
              {
                strokeDashoffset: ringTarget,
                duration: 1.5,
                ease: "power3.out",
                scrollTrigger: { trigger: indexCard, start: "top 86%", once: true },
              },
            );
          }
          if (scoreNode && Number.isFinite(scoreTarget)) {
            const counter = { value: 0 };
            scoreNode.textContent = "0";
            gsap.to(counter, {
              value: scoreTarget,
              duration: 1.15,
              delay: 0.15,
              ease: "power3.out",
              onUpdate: () => {
                scoreNode.textContent = `${Math.round(counter.value)}`;
              },
              scrollTrigger: {
                trigger: indexCard ?? wellnessScore,
                start: "top 86%",
                once: true,
              },
            });
          }

          gsap.utils
            .toArray<HTMLElement>(
              '.platform-main[data-page="behavioral-analytics"] .grid[class*="md:grid-cols-3"] > .surface .text-4xl',
            )
            .forEach((element) => {
              const valueNode = element.firstChild;
              const source = valueNode?.textContent?.trim() ?? "";
              const target = Number.parseFloat(source.replace(/[^\d.-]/g, ""));
              if (!Number.isFinite(target) || !valueNode) return;
              const prefix = source.startsWith("+") ? "+" : "";
              const counter = { value: 0 };
              gsap.to(counter, {
                value: target,
                duration: 1.2,
                delay: 0.25,
                ease: "power3.out",
                onUpdate: () => {
                  valueNode.textContent = `${prefix}${Math.round(counter.value)}`;
                },
                scrollTrigger: {
                  trigger: element.closest(".surface") ?? element,
                  start: "top 86%",
                  once: true,
                },
              });
            });
        }, main);

        ScrollTrigger.refresh();
      });
    });

    return () => {
      cancelAnimationFrame(firstFrame);
      cancelAnimationFrame(secondFrame);
      removeButtonHover.forEach((remove) => remove());
      context?.revert();
    };
  }, [location.pathname, reduced]);
  const theme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("mindease-theme-v2", next ? "dark" : "light");
  };
  const current = links.find((l) => l.to === location.pathname)?.label || "MindEase AI";
  return (
    <div
      className={`platform-shell min-h-screen bg-background text-foreground${dark ? " dark" : ""} lg:flex`}
    >
      {open && (
        <div
          className="platform-backdrop fixed inset-0 z-30 bg-foreground/30 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}
      <aside
        className={`platform-sidebar fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-border bg-card transition-transform lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="platform-brand-row flex h-20 items-center justify-between border-b border-border px-6">
          <Link to="/" className="platform-brand flex items-center gap-2.5">
            <span className="platform-brand-mark flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Heart size={19} strokeWidth={2.4} />
            </span>
            <span className="font-display text-lg font-extrabold text-foreground">
              MindEase <span className="text-primary">AI</span>
            </span>
          </Link>
          <Button
            size="icon"
            variant="ghost"
            className="lg:hidden"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
          >
            <X />
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto px-3 py-5">
          <div className="label-caps px-3 pb-3 text-muted-foreground">Explore platform</div>
          <nav aria-label="Main navigation" className="platform-nav space-y-1">
            {links.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className={`platform-nav-link flex items-center gap-3 rounded-md px-3 py-2.5 text-[13px] font-semibold transition-colors ${location.pathname === to ? "is-active bg-secondary text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
              >
                <Icon size={17} />
                {label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="border-t border-border p-4">
          <div className="platform-support rounded-lg bg-secondary p-3">
            <div className="flex items-center gap-2 text-xs font-bold text-primary">
              <ShieldCheck size={15} /> A supportive space
            </div>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">
              Educational tools, never a diagnosis. Your entries stay in this browser.
            </p>
          </div>
          <Button
            variant="ghost"
            onClick={theme}
            className="mt-3 w-full justify-start gap-3 text-muted-foreground"
            aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
          >
            {dark ? <Sun size={17} /> : <Moon size={17} />} {dark ? "Light mode" : "Dark mode"}
          </Button>
        </div>
      </aside>
      <div className="min-w-0 flex-1">
        <header className="platform-topbar sticky top-0 z-20 flex h-16 items-center justify-between border-b border-border bg-background/90 px-4 backdrop-blur-xl sm:px-8">
          <div className="flex items-center gap-3">
            <Button
              size="icon"
              variant="ghost"
              className="lg:hidden"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
            >
              <Menu />
            </Button>
            <span className="text-sm font-semibold text-foreground">{current}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-xs text-muted-foreground sm:inline">
              A calmer path, one day at a time.
            </span>
            <Link
              to="/progress-tracker"
              className="flex size-8 items-center justify-center rounded-full bg-accent text-accent-foreground"
              aria-label="Go to progress tracker"
            >
              <Activity size={16} />
            </Link>
          </div>
        </header>
        <main
          ref={mainRef}
          id="main-content"
          data-page={location.pathname.replace(/^\//, "") || "overview"}
          className="platform-main min-h-[70vh]"
        >
          {children}
        </main>
        <footer className="platform-footer border-t border-border bg-card px-5 py-9 sm:px-10">
          <div className="mx-auto max-w-6xl">
            <div className="flex flex-wrap items-start justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 font-display font-extrabold">
                  <Heart size={18} className="text-primary" /> MindEase AI
                </div>
                <p className="mt-2 max-w-md text-xs leading-5 text-muted-foreground">
                  Education and self-reflection only. Not a diagnosis, treatment, emergency service,
                  or substitute for a mental health professional.
                </p>
              </div>
              <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs font-semibold text-muted-foreground">
                <Link to="/resources">Resources</Link>
                <Link to="/privacy">Privacy policy</Link>
                <Link to="/terms">Terms</Link>
                <Link to="/contact">Professional support</Link>
              </div>
            </div>
            <div className="mt-7 flex flex-wrap justify-between gap-2 border-t border-border pt-5 text-xs text-muted-foreground">
              <span>
                If you are in immediate danger, contact local emergency services or a crisis line in
                your country.
              </span>
              <span>Built by G Vishnu Vardhan Raju</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
export function PageIntro({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="page-intro mb-8">
      <p className="label-caps mb-3 text-primary">{eyebrow}</p>
      <h1
        aria-label={title}
        className="max-w-4xl font-display text-3xl font-extrabold leading-tight sm:text-4xl"
      >
        {title.split(" ").map((word, index) => (
          <span className="page-title-word" aria-hidden="true" key={`${word}-${index}`}>
            {word}
            {index < title.split(" ").length - 1 ? "\u00a0" : ""}
          </span>
        ))}
      </h1>
      <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
        {description}
      </p>
    </div>
  );
}
export function SectionHeading({
  title,
  detail,
  href,
}: {
  title: string;
  detail?: string;
  href?: string;
}) {
  return (
    <div className="section-heading mb-5 flex items-end justify-between gap-3">
      <div>
        <h2 className="font-display text-xl font-extrabold sm:text-2xl">{title}</h2>
        {detail && <p className="mt-1 text-sm text-muted-foreground">{detail}</p>}
      </div>
      {href && (
        <Link
          to={href as "/"}
          className="flex shrink-0 items-center gap-1 text-xs font-bold text-primary hover:underline"
        >
          Explore <ArrowUpRight size={14} />
        </Link>
      )}
    </div>
  );
}
