# Mindful Analytics

MindEase AI



Anxiety Awareness, Recovery Guidance & Behavioral Analytics Platform



Build a world-class research-oriented mental wellness platform called MindEase AI.



Mission



MindEase AI is an educational and supportive platform designed to increase anxiety awareness, mental health literacy, behavioral self-monitoring, recovery guidance, and psychological resilience.



The platform should help users:



- Understand anxiety disorders

- Identify common triggers

- Track emotional wellbeing

- Learn evidence-based coping strategies

- Follow a structured 90-day recovery journey

- Monitor recovery progress through behavioral analytics



IMPORTANT:



- The platform MUST NOT diagnose anxiety disorders.

- The platform MUST NOT replace psychologists, psychiatrists, therapists, or medical professionals.

- The platform MUST NOT claim treatment effectiveness.

- The platform MUST encourage professional support when symptoms are severe, persistent, or impair daily functioning.



---



Tech Stack



- React 19

- TypeScript

- Vite

- Tailwind CSS

- Framer Motion

- Recharts

- TanStack Router (client-side)

- Local Storage



The wellness guide uses a server-side Gemini API endpoint. Its API key must never be exposed in client code.



Use realistic mock data.

## Gemini API setup

Create a Gemini Developer API key in [Google AI Studio](https://aistudio.google.com/apikey). A Google AI Pro subscription does not automatically configure a Developer API key, and API usage may have separate quotas or billing.

For local development, add the key to the repository-root `.env.local` file. The Vite development middleware reads it without exposing it to browser code:

```dotenv
GEMINI_API_KEY=your-key
GEMINI_MODEL=gemini-3.8-flash
```

The default model is `gemini-3.8-flash`; `GEMINI_MODEL` can override it. For Vercel, set `GEMINI_API_KEY` and optionally `GEMINI_MODEL` in the project environment variables. The static SPA is emitted to `dist`; `/api/guide` runs as a Vercel Function so the key remains server-side. Never use a `VITE_` prefix for this key.

## Vite SPA

```sh
npm install
npm run dev
npm run build
```

Vercel builds with `npm run build`, serves `dist`, and rewrites client-side routes to `index.html`.

Guide messages and recent conversation turns are sent to Google Gemini to generate replies. MindEase does not save conversations. The guide is educational, not clinical care; avoid sharing identifying or sensitive details.



---



Design System



Create a premium healthcare-grade experience.



Style Inspiration:



- Calm

- Professional

- Trustworthy

- Modern Healthcare UI

- Research Dashboard

- Apple Health

- Calm App

- Headspace

- Enterprise Analytics



Colors:



- Soft Blue

- Teal

- White

- Indigo

- Lavender



Avoid:



- Aggressive red themes

- Fear-inducing design

- Clinical coldness



Requirements:



- Glassmorphism

- Smooth animations

- Soft shadows

- Accessible design

- Mobile-first

- Dark mode and Light mode



---



Navigation



Home



Understanding Anxiety



Anxiety Disorders



AI Wellness Guide



90-Day Recovery Journey



Behavioral Analytics



Case Studies



Progress Tracker



Research Center



Resources



About



Contact



---



Home Page



Hero Section



Headline:



"Understanding Anxiety. Building Resilience."



Subheadline:



"Evidence-based education, behavioral analytics, and recovery guidance designed to support mental wellness."



Hero Statistics



100+

Educational Case Studies



90 Days

Recovery Roadmap



10+

Anxiety Categories



24/7

AI Wellness Guidance



Add:



- Animated counters

- Floating cards

- Glassmorphism panels

- Mental wellness illustrations

- Smooth entrance animations



---



Understanding Anxiety



Educational hub.



Sections:



What Is Anxiety?



How Anxiety Works



Brain and Stress Response



Common Symptoms



Physical Symptoms



Emotional Symptoms



Behavioral Symptoms



Cognitive Symptoms



Myths vs Facts



When Professional Help Is Important



Interactive cards and infographics.



---



Anxiety Disorders Page



Create dedicated sections for:



Generalized Anxiety Disorder



Social Anxiety Disorder



Panic Disorder



Health Anxiety



Performance Anxiety



Academic Anxiety



Workplace Anxiety



Relationship Anxiety



Each section contains:



Overview



Symptoms



Common Triggers



Psychological Explanation



Evidence-Based Coping Methods



Recovery Strategies



When To Seek Professional Support



---



AI Wellness Guide



Create a sophisticated AI support interface.



The AI Guide should:



- Explain anxiety concepts

- Provide psychoeducation

- Explain coping techniques

- Help identify potential triggers

- Suggest healthy habits

- Interpret behavioral scores

- Generate personalized recovery roadmaps



The AI must:



- Never diagnose

- Never claim certainty

- Never replace professionals

- Never provide emergency counseling



Tone:



- Compassionate

- Supportive

- Professional

- Psychologically informed



---



90-Day Recovery Journey



Create a structured recovery system.



Phase 1



Days 1–30



Awareness & Stabilization



Topics:



- Understanding anxiety

- Sleep improvement

- Breathing exercises

- Journaling

- Daily reflection

- Stress reduction



---



Phase 2



Days 31–60



Building Resilience



Topics:



- Cognitive restructuring

- Exposure principles

- Healthy routines

- Exercise habits

- Social engagement

- Self-confidence



---



Phase 3



Days 61–90



Long-Term Growth



Topics:



- Relapse prevention

- Resilience development

- Long-term wellbeing

- Goal setting

- Personal growth



Display:



- Timeline

- Milestones

- Progress indicators

- Weekly achievements

- Recovery checkpoints



---



Mathematical Research Framework



This project must include an original research-inspired behavioral analytics model.



---



Anxiety Recovery Index (ARI)



Purpose:



Measure overall recovery progress.



Inputs:



Sleep Quality



Mood Stability



Stress Level



Physical Activity



Social Engagement



Formula:



ARI = 0.25(Sleep Quality)



+ 0.25(Mood Stability)

+ 0.20(Physical Activity)

+ 0.15(Social Engagement)

+ 0.15(100 - Stress Level)



Output:



0–20 Critical Risk



21–40 High Risk



41–60 Moderate Risk



61–80 Stable



81–100 Flourishing



Create:



- ARI Dashboard

- Trend Charts

- Score History

- Risk Visualization



---



Recovery Progress Score (RPS)



Purpose:



Measure improvement from Day 1.



Formula:



RPS = ((Current ARI - Day1 ARI) / Day1 ARI) × 100



Display:



- Improvement Percentage

- Weekly Growth

- Monthly Growth

- Recovery Journey



---



Anxiety Trigger Prediction Model (ATPM)



Purpose:



Identify dominant anxiety triggers.



Factors:



Academic Pressure



Work Pressure



Sleep Deficit



Social Isolation



Financial Stress



Formula:



ATPM =

0.30(Academic)



+ 0.25(Work)

+ 0.20(Sleep Deficit)

+ 0.15(Isolation)

+ 0.10(Financial)



Output:



Trigger Rankings



Risk Heatmap



Trigger Dashboard



Priority Intervention Suggestions



---



Behavioral Analytics Page



Create a dedicated research dashboard.



Include:



ARI Score



RPS Score



ATPM Score



Mood Trends



Sleep Trends



Stress Trends



Activity Trends



Recovery Forecast



Behavioral Heatmap



Risk Indicators



Interactive Charts



---



Progress Tracker



Track:



Mood



Stress



Sleep



Energy



Physical Activity



Social Interaction



Journal Reflections



Display:



Daily Trends



Weekly Trends



Monthly Trends



Recovery Analytics



Behavioral Reports



---



Case Studies Library



Create 100 educational case studies.



Categories:



20 Student Anxiety



20 Workplace Anxiety



15 Social Anxiety



15 Health Anxiety



10 Relationship Anxiety



10 Financial Anxiety



10 Performance Anxiety



Each Case Study Contains:



Background



Symptoms



Trigger Analysis



Psychological Explanation



Behavioral Patterns



Coping Strategies



Recovery Process



ARI Improvement Example



Lessons Learned



Include:



Search



Filters



Category Navigation



Case Study Viewer



---



Research Center



Create a professional research portal.



Include:



Anxiety Statistics



Behavioral Science Insights



Mental Health Literacy



Research Articles



Infographics



Recovery Science



Psychological Models



Behavioral Analytics Research



Professional Resources



---



Dashboard Widgets



Anxiety Recovery Index



Mood Heatmap



Stress Tracker



Sleep Tracker



Trigger Analysis



Behavioral Scorecard



Recovery Timeline



Risk Monitor



Weekly Wellness Report



---



Animations



Use Framer Motion extensively.



Include:



Fade In



Slide Up



Parallax



Progress Animations



Page Transitions



Hover Effects



Counter Animations



Chart Animations



---



Accessibility



WCAG-Friendly



Keyboard Navigation



Screen Reader Support



High Contrast Support



Large Typography



Accessible Forms



---



Footer



Mental Health Disclaimer



Resources



Privacy Policy



Terms



Emergency Help Notice



Professional Support Information



Built by G Vishnu Vardhan Raju



---



Final Goal



The final platform should feel like a premium mental wellness research and behavioral analytics system used by researchers, psychologists, students, educators, and mental health advocates.



It should combine:



- Psychology

- Behavioral Science

- AI Guidance

- Data Analytics

- Mathematical Modeling

- Educational Mental Health Support



into one world-class professional platform suitable for MCA projects, research publications, and portfolio presentation. //Remember case studies must be copyright free and use light theme also add good images that should be non disturbing and proper arrangements of all the project don't make any mistake

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/a0c859de-e69a-43d5-8809-5cd418353aa9).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm install
npm run dev
```
