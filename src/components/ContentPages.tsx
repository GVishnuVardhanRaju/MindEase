import { useLayoutEffect,useMemo,useRef,useState } from 'react';
import { createPortal } from 'react-dom';
import { Link } from '@tanstack/react-router';
import { motion } from 'motion/react';
import { useReducedMotion } from 'motion/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, BookOpen, Brain, Check, ChevronDown, CircleHelp, Heart, Info, LifeBuoy, Search, ShieldCheck, Sparkles, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PageIntro,SectionHeading } from './AppShell';
import { cases,categories,disorderData } from '@/lib/wellness';
gsap.registerPlugin(ScrollTrigger);
const enter={initial:{opacity:0,y:14},whileInView:{opacity:1,y:0},viewport:{once:true},transition:{duration:.45}};
export function Understanding(){const symptoms=[{title:'Physical',body:'Muscle tension, a racing heart, stomach discomfort, restlessness, or changes in sleep.'},{title:'Emotional',body:'Feeling on edge, fearful, overwhelmed, or unusually irritable.'},{title:'Behavioral',body:'Avoiding situations, seeking frequent reassurance, or withdrawing from activities.'},{title:'Cognitive',body:'Persistent “what if” thoughts, difficulty focusing, or anticipating the worst.'}];return <div className="page-wrap py-10"><PageIntro eyebrow="The knowledge hub" title="Understanding anxiety" description="Anxiety is a common human response to uncertainty. Learn what it can feel like, how it works, and when extra support matters."/><div className="grid gap-5 md:grid-cols-2"><motion.section {...enter} className="surface rounded-lg p-7"><Brain className="mb-4 text-primary"/><h2 className="text-xl font-extrabold">What is anxiety?</h2><p className="mt-3 text-sm leading-7 text-muted-foreground">Anxiety is the mind and body’s response to perceived threat. In some situations it can help us prepare. When it becomes persistent, overwhelming, or interferes with everyday life, support from a professional may help. A website cannot determine whether someone has a disorder.</p></motion.section><motion.section {...enter} className="surface rounded-lg p-7"><Heart className="mb-4 text-teal"/><h2 className="text-xl font-extrabold">The brain and stress response</h2><p className="mt-3 text-sm leading-7 text-muted-foreground">The nervous system can activate an alert response: breathing changes, muscles tighten, and attention turns to possible danger. Thoughts and behavior can influence this cycle. Grounding and rest may help you observe your response without judging it.</p></motion.section></div><div className="mt-12"><SectionHeading title="How anxiety may show up" detail="Symptoms differ from person to person."/><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{symptoms.map((s,i)=><motion.div {...enter} key={s.title} className="surface rounded-lg p-5"><div className="mb-4 flex size-10 items-center justify-center rounded-lg bg-secondary font-display font-extrabold text-primary">0{i+1}</div><h3 className="font-bold">{s.title} symptoms</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{s.body}</p></motion.div>)}</div></div><div className="mt-12 grid gap-6 lg:grid-cols-2"><section><SectionHeading title="Myths & facts"/><div className="space-y-3">{[['Myth: Anxiety is just overthinking.','Fact: Anxiety can involve physical sensations, emotions, thoughts, and behavior.'],['Myth: Avoiding everything is the safest option.','Fact: Avoidance can bring short relief but may maintain fear over time.'],['Myth: Asking for help is a failure.','Fact: Reaching out is a constructive step, especially when daily life is affected.']].map(([a,b])=><details key={a} className="surface group rounded-lg p-5"><summary className="flex cursor-pointer list-none items-center justify-between gap-2 font-semibold">{a}<ChevronDown size={17} className="shrink-0 transition-transform group-open:rotate-180"/></summary><p className="mt-3 text-sm leading-6 text-muted-foreground">{b}</p></details>)}</div></section><section className="rounded-lg bg-secondary p-7"><LifeBuoy size={24} className="text-primary"/><h2 className="mt-4 text-xl font-extrabold">When professional help is important</h2><p className="mt-3 text-sm leading-7 text-muted-foreground">Consider speaking with a psychologist, psychiatrist, therapist, or doctor if symptoms are persistent, severe, getting worse, or interfering with sleep, school, work, relationships, or daily activities. If you might harm yourself or are in immediate danger, contact local emergency services or a crisis service now.</p><Button asChild className="mt-5"><Link to="/resources">Find support resources <ArrowRight/></Link></Button></section></div></div>}
export function Disorders(){const [selected,setSelected]=useState(0);const d=disorderData[selected] ?? disorderData[0];if (!d) return null;return <div className="page-wrap py-10"><PageIntro eyebrow="Explore the spectrum" title="Anxiety-related experiences" description="Understand patterns that clinicians may discuss. These descriptions are educational and cannot tell you what condition you have."/><div className="grid gap-6 lg:grid-cols-[280px_1fr]"><nav aria-label="Anxiety topics" className="flex gap-2 overflow-x-auto pb-2 lg:flex-col">{disorderData.map((item,i)=><Button key={item.name} variant={selected===i?'secondary':'ghost'} onClick={()=>setSelected(i)} className="h-auto min-w-max justify-start whitespace-normal text-left lg:w-full">{item.name}</Button>)}</nav><motion.article key={d.name} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} className="surface rounded-lg p-6 sm:p-9"><div className="label-caps text-primary">Topic {String(selected+1).padStart(2,'0')} / 08</div><h2 className="mt-2 text-2xl font-extrabold">{d.name}</h2><p className="mt-2 text-muted-foreground">{d.summary}</p><div className="mt-7 grid gap-5 sm:grid-cols-2">{[['Common experiences',d.symptoms],['Potential triggers',d.triggers],['Psychological perspective',d.explanation],['Evidence-informed approaches',d.coping],['Recovery-oriented steps','Observe patterns, make manageable routine changes, and seek personalized support rather than aiming for a fixed timeline.'],['When to seek support','If distress persists, feels severe, or affects everyday functioning, contact a qualified mental health professional.']].map(([title,body])=><div key={title} className="border-t border-border pt-4"><h3 className="text-sm font-bold">{title}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{body}</p></div>)}</div></motion.article></div></div>}
export function Cases() {
  const dialogRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [query, setQuery] = useState(""),
    [category, setCategory] = useState("All topics"),
    [selected, setSelected] = useState<string | null>(null);
  const filtered = useMemo(
    () =>
      cases.filter(
        (c) =>
          (category === "All topics" || category === c.category) &&
          `${c.title} ${c.category} ${c.triggers}`.toLowerCase().includes(query.toLowerCase()),
      ),
    [query, category],
  );
  const item = cases.find((c) => c.id === selected);
  useLayoutEffect(() => {
    const dialog = dialogRef.current;
    if (!item || !dialog || reduced) return;
    const context = gsap.context(() => {
      const sections = gsap.utils.toArray<HTMLElement>(".case-report-section", dialog);
      const path = dialog.querySelector<SVGPathElement>(".case-report-path path");
      gsap.set(sections, { autoAlpha: 0, y: 36, filter: "blur(10px)" });
      if (path) {
        const pathLength = path.getTotalLength();
        gsap.fromTo(
          path,
          { strokeDasharray: pathLength, strokeDashoffset: pathLength },
          {
            strokeDashoffset: 0,
            ease: "none",
            scrollTrigger: {
              trigger: path.parentElement,
              scroller: dialog,
              start: "top 90%",
              end: "bottom 78%",
              scrub: 1,
            },
          },
        );
      }
      ScrollTrigger.batch(sections, {
        scroller: dialog,
        start: "top 88%",
        once: true,
        onEnter: (batch) => {
          batch.forEach((section) => section.classList.add("is-active"));
          gsap.to(batch, {
            autoAlpha: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 1.1,
            stagger: 0.08,
            ease: "power3.out",
            overwrite: "auto",
          });
        },
      });
    }, dialog);
    return () => context.revert();
  }, [item?.id, reduced]);
  return (
    <div className="page-wrap py-10">
      <PageIntro
        eyebrow="Original educational library"
        title="Stories to learn from"
        description="100 original educational scenarios written for learning. No real patient stories, copyrighted case material, or clinical outcomes are represented."
      />
      <div className="surface flex flex-wrap gap-3 rounded-lg p-4">
        <div className="relative min-w-45 flex-1">
          <Search size={16} className="absolute left-3 top-3 text-muted-foreground" />
          <Input
            className="pl-9"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search stories or triggers"
            aria-label="Search case studies"
          />
        </div>
        <label className="sr-only" htmlFor="category-filter">
          Filter by category
        </label>
        <select
          id="category-filter"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="h-9 rounded-md border border-input bg-background px-3 text-sm text-foreground"
        >
          <option>All topics</option>
          {categories.map((c) => (
            <option key={c.name}>{c.name}</option>
          ))}
        </select>
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        {[{ name: "All topics", count: 100 }, ...categories].map((c) => (
          <Button
            key={c.name}
            size="sm"
            variant={category === c.name ? "default" : "outline"}
            onClick={() => setCategory(c.name)}
          >
            {c.name} <span className="opacity-60">{c.count}</span>
          </Button>
        ))}
      </div>
      <div className="mt-5 text-xs text-muted-foreground">
        Showing {filtered.length} of 100 stories
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map((c, i) => (
          <motion.article {...enter} key={c.id} className="surface flex flex-col rounded-lg p-5">
            <span className="label-caps text-primary">
              {c.category} · {String(i + 1).padStart(2, "0")}
            </span>
            <h2 className="mt-3 font-display text-lg font-extrabold">{c.title}</h2>
            <p className="mt-2 flex-1 text-sm leading-6 text-muted-foreground">{c.background}</p>
            <Button
              variant="link"
              className="mt-3 justify-start px-0"
              onClick={() => setSelected(c.id)}
            >
              Read story <ArrowRight size={15} />
            </Button>
          </motion.article>
        ))}
      </div>
      {filtered.length === 0 && (
        <p className="py-12 text-center text-muted-foreground">
          No stories match this search. Try another term.
        </p>
      )}
      {item && typeof document !== "undefined" && createPortal(
        <div
          className="fixed inset-0 z-50 flex items-start justify-center bg-foreground/40 p-4 pt-20"
          onClick={() => setSelected(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label={item.title}
            ref={dialogRef}
            className="case-report-dialog max-h-[calc(100dvh-7rem)] w-full max-w-3xl overflow-y-auto rounded-lg bg-card p-6 shadow-xl sm:p-9"
            onClick={(e) => e.stopPropagation()}
          >
            <header className="case-report-header relative z-10 flex justify-between gap-4 border-b border-border bg-card/95 px-6 py-5 backdrop-blur-xl sm:px-9">
              <div>
                <span className="label-caps text-primary">
                  Educational composite · {item.category}
                </span>
                <h2 className="mt-2 text-2xl font-extrabold">{item.title}</h2>
                <p className="mt-2 text-xs text-muted-foreground">
                  {item.reportWordCount.toLocaleString()} words · invented details · not a clinical
                  record
                </p>
              </div>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setSelected(null)}
                aria-label="Close case study"
              >
                <X />
              </Button>
            </header>
            <div className="case-report-sections relative mt-7 space-y-8 pl-5">
              <svg className="case-report-path" viewBox="0 0 8 100" preserveAspectRatio="none" aria-hidden="true">
                <path d="M4 0 V100" />
              </svg>
              {item.report.map((section, index) => (
                <section className="case-report-section" key={section.heading}>
                  <span className="case-report-index">0{index + 1} / 09</span>
                  <h3 className="mt-2 text-lg font-semibold">{section.heading}</h3>
                  <div className="mt-3 space-y-4">
                    {section.paragraphs.map((paragraph, paragraphIndex) => (
                      <p className="text-sm leading-7 text-muted-foreground" key={paragraphIndex}>
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </div>
        </div>,
        document.body,
      )}
    </div>
  );
}
const resources = [
  {
    title: "Understanding anxiety",
    body: "Overview of symptoms and when to seek assessment.",
    source: "National Institute of Mental Health",
    url: "https://www.nimh.nih.gov/health/topics/anxiety-disorders",
  },
  {
    title: "Mental health information",
    body: "Accessible information and finding help.",
    source: "World Health Organization",
    url: "https://www.who.int/health-topics/mental-health",
  },
  {
    title: "Anxiety and panic support",
    body: "Information on anxiety and panic, self-help and support.",
    source: "NHS",
    url: "https://www.nhs.uk/mental-health/conditions/generalised-anxiety-disorder/overview/",
  },
  {
    title: "Finding a professional",
    body: "Guidance for connecting with qualified mental health care.",
    source: "American Psychological Association",
    url: "https://locator.apa.org/",
  },
];
export function Research() {
  return (
    <div className="page-wrap py-10">
      <PageIntro
        eyebrow="Research center"
        title="Explore the evidence"
        description="A curated starting point for mental health literacy and behavioral science. MindEase’s scores are original educational models, not validated clinical instruments."
      />
      <div className="grid gap-4 md:grid-cols-3">
        {[
          {
            title: "Anxiety & everyday life",
            text: "Anxiety disorders are among the most common mental health conditions worldwide. Prevalence estimates vary by population and study method.",
            icon: Brain,
          },
          {
            title: "Why habits matter",
            text: "Sleep, movement, social connection, and stress can interact with wellbeing. Tracking them may reveal useful personal patterns.",
            icon: Heart,
          },
          {
            title: "How to read your data",
            text: "A single score cannot explain how you feel. Look for trends, context, and the limits of self-reported information.",
            icon: ShieldCheck,
          },
        ].map(({ title, text, icon: Icon }) => (
          <div key={title} className="surface rounded-lg p-6">
            <Icon className="text-primary" />
            <h2 className="mt-4 font-bold">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p>
          </div>
        ))}
      </div>
      <div className="mt-12">
        <SectionHeading
          title="Research & professional reading"
          detail="Public sources for deeper learning"
        />
        <div className="grid gap-4 md:grid-cols-2">
          {resources.map((r) => (
            <a
              key={r.title}
              className="surface group rounded-lg p-6 transition-transform hover:-translate-y-1"
              href={r.url}
              target="_blank"
              rel="noreferrer"
            >
              <span className="label-caps text-primary">{r.source}</span>
              <h3 className="mt-2 font-bold group-hover:text-primary">{r.title} ↗</h3>
              <p className="mt-2 text-sm text-muted-foreground">{r.body}</p>
            </a>
          ))}
        </div>
      </div>
      <div className="mt-10 rounded-lg bg-secondary p-7">
        <h2 className="font-display text-xl font-extrabold">An original behavioral framework</h2>
        <p className="mt-3 text-sm leading-7 text-muted-foreground">
          ARI combines five self-reported measures. RPS compares today’s ARI to the first check-in.
          ATPM weights five possible triggers. These formulas are research-inspired examples created
          for this project; their weights and score bands have not been clinically validated. They
          must not be used for diagnosis, prediction of clinical risk, or treatment decisions.
        </p>
        <Link
          to="/behavioral-analytics"
          className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-primary"
        >
          Explore the formulas <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}
export function Resources(){return <div className="page-wrap py-10"><PageIntro eyebrow="Help & further reading" title="Support is available" description="You do not have to navigate persistent or overwhelming anxiety alone. Qualified support is an important part of mental wellbeing."/><div className="grid gap-5 md:grid-cols-2"><div className="rounded-lg bg-secondary p-7"><LifeBuoy size={25} className="text-primary"/><h2 className="mt-4 text-xl font-extrabold">In immediate danger?</h2><p className="mt-2 text-sm leading-7 text-muted-foreground">Contact your local emergency number or a crisis service in your country now. This website cannot respond to emergencies. If you are in the United States, call or text 988; elsewhere, look up your local crisis line.</p><a href="https://findahelpline.com/" target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-primary">Find a local helpline <ArrowRight size={16}/></a></div><div className="surface rounded-lg p-7"><ShieldCheck size={25} className="text-teal"/><h2 className="mt-4 text-xl font-extrabold">When to speak to a professional</h2><p className="mt-2 text-sm leading-7 text-muted-foreground">Seek advice from a psychologist, psychiatrist, therapist, or doctor if symptoms are persistent, severe, or make it difficult to work, study, sleep, or maintain relationships. They can provide individualized assessment and care.</p></div></div><div className="mt-10"><SectionHeading title="Reliable resources"/><div className="grid gap-4 md:grid-cols-2">{resources.map(r=><a key={r.title} href={r.url} target="_blank" rel="noreferrer" className="surface rounded-lg p-5"><div className="label-caps text-primary">{r.source}</div><h3 className="mt-2 font-bold">{r.title} ↗</h3><p className="mt-1 text-sm text-muted-foreground">{r.body}</p></a>)}</div></div></div>}
export function About(){return <div className="page-wrap py-10"><PageIntro eyebrow="Our purpose" title="A thoughtful space for mental wellness" description="MindEase AI brings mental health education and self-reflection together in one accessible, research-oriented experience."/><div className="grid gap-6 md:grid-cols-2"><div className="surface rounded-lg p-8"><Heart className="text-primary"/><h2 className="mt-5 text-xl font-extrabold">Our mission</h2><p className="mt-3 text-sm leading-7 text-muted-foreground">Make anxiety concepts easier to understand, help people observe everyday patterns, and encourage supportive, informed conversations about mental health. Our educational examples and original formulas are designed for learning, not clinical assessment.</p></div><div className="surface rounded-lg p-8"><ShieldCheck className="text-teal"/><h2 className="mt-5 text-xl font-extrabold">Our boundaries</h2><p className="mt-3 text-sm leading-7 text-muted-foreground">MindEase AI does not diagnose, prescribe, provide treatment, claim treatment effectiveness, replace professionals, or offer crisis counseling. Your check-ins stay in your current browser and are not reviewed by a clinician.</p></div></div><p className="mt-10 text-sm text-muted-foreground">Built by <strong className="text-foreground">G Vishnu Vardhan Raju</strong>.</p></div>}
export function Contact(){return <div className="page-wrap py-10"><PageIntro eyebrow="Get in touch" title="Connect with the right support" description="MindEase AI is an educational portfolio project and does not offer a monitored contact inbox or direct clinical support."/><div className="grid gap-5 md:grid-cols-2"><div className="surface rounded-lg p-7"><CircleHelp className="text-primary"/><h2 className="mt-4 text-xl font-bold">Looking for mental health care?</h2><p className="mt-3 text-sm leading-7 text-muted-foreground">Contact a local licensed mental health professional or your primary care provider for personalized guidance. For immediate danger, use local emergency services.</p><Button asChild className="mt-5"><Link to="/resources">View support resources <ArrowRight/></Link></Button></div><div className="surface rounded-lg p-7"><BookOpen className="text-teal"/><h2 className="mt-4 text-xl font-bold">Explore the project</h2><p className="mt-3 text-sm leading-7 text-muted-foreground">This platform was built by G Vishnu Vardhan Raju to demonstrate an educational mental wellness interface and illustrative behavioral analytics.</p><Button asChild variant="outline" className="mt-5"><Link to="/about">About MindEase AI <ArrowRight/></Link></Button></div></div></div>}
export function Legal({kind}:{kind:'privacy'|'terms'}){return <div className="page-wrap max-w-3xl py-10"><PageIntro eyebrow="Platform information" title={kind==='privacy'?'Privacy policy':'Terms of use'} description={kind==='privacy'?'Your reflections belong to you.':'Please use MindEase AI as an educational and self-reflection tool only.'}/>{kind==='privacy'?<div className="space-y-6 text-sm leading-7 text-muted-foreground"><p>Check-ins, journal reflections, and journey milestones are stored locally in your browser. No account or server database is connected to this experience. Clearing browser storage removes these entries.</p><p>The guide uses prewritten local responses. It does not transmit messages to an AI service. We do not ask for identifying information or send your reflections to a clinician.</p><p>Avoid entering sensitive information you do not want stored on this device, particularly on shared devices.</p></div>:<div className="space-y-6 text-sm leading-7 text-muted-foreground"><p>Content is for general education and reflection. It is not medical advice, diagnosis, treatment, or a crisis response service. Scores and educational stories are illustrative only and have not been validated for clinical use.</p><p>Speak with a qualified professional for persistent, severe, or impairing symptoms. In an emergency, contact local emergency services.</p><p>Original case studies may be used for educational demonstration with attribution to MindEase AI. External resources remain the property of their respective publishers.</p></div>}</div>}
