import { useEffect,useState } from 'react';
import { Link } from '@tanstack/react-router';
import { motion } from 'motion/react';
import { Activity, ArrowRight, Check, ChevronRight, Compass, Info, ShieldCheck, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { PageIntro,SectionHeading } from './AppShell';
import { AICompanion } from './AICompanion';
import { TrendChart,TriggerChart } from './Charts';
import { createChatMessage,requestGeminiReply } from '@/lib/chatService';
import { WELCOME_MESSAGE } from '@/lib/aiPrompt';
import { useWellness } from './WellnessContext';
import type { ChatMessage } from '@/types/chat';
import { ari,atpm,band,rps,triggerNames,triggerWeights,type CheckIn } from '@/lib/wellness';
const today=()=>new Date().toLocaleDateString('en-CA');
const phases=[{name:'Awareness & Stabilization',range:'Days 1–30',start:1,end:30,description:'Build a foundation of awareness and gentle daily routines.',weeks:['Understanding anxiety & noticing patterns','Sleep and rest habits','Breathing and grounding','Journaling and reflection'],items:['Read about the stress response','Create a sleep wind-down routine','Try a paced breathing exercise','Reflect on a daily feeling','Notice one stress-reducing moment']},{name:'Building Resilience',range:'Days 31–60',start:31,end:60,description:'Explore flexible thinking, supportive routines, and connection.',weeks:['Reframing unhelpful thoughts','Approaching challenges gradually','Movement and healthy routines','Social connection and confidence'],items:['Notice an unhelpful thought','Try a more balanced perspective','Take a manageable step toward a challenge','Choose a movement routine','Connect with someone you trust']},{name:'Long-Term Growth',range:'Days 61–90',start:61,end:90,description:'Carry your learning into everyday life, at your own pace.',weeks:['Recognizing early warning signs','Planning for setbacks','Setting sustainable goals','Reflecting on growth'],items:['Write a personal support plan','Identify a sign you need rest','Set a realistic wellbeing goal','Celebrate a small achievement','Review what helps you most']}];
const journeyKey='mindease-journey-v1';
export function Journey(){const [phase,setPhase]=useState(0),[completed,setCompleted]=useState<string[]>([]);useEffect(()=>{try{setCompleted(JSON.parse(localStorage.getItem(journeyKey)||'[]'))}catch{setCompleted([])}},[]);const toggle=(key:string)=>{const next=completed.includes(key)?completed.filter(x=>x!==key):[...completed,key];setCompleted(next);localStorage.setItem(journeyKey,JSON.stringify(next))};const p=phases[phase] ?? phases[0];if (!p) return null;return <div className="page-wrap py-10"><PageIntro eyebrow="A structured path, not a prescription" title="Your 90-day wellness journey" description="Three flexible phases to explore awareness, resilience, and long-term wellbeing. Move at your own pace; there is no required recovery timeline."/><div className="grid gap-4 md:grid-cols-3">{phases.map((part,i)=><Button key={part.name} variant="ghost" onClick={()=>setPhase(i)} className={`h-auto min-h-40 w-full flex-col items-start whitespace-normal rounded-lg border p-5 text-left shadow-none ${phase===i?'border-primary bg-secondary':'border-border bg-card'}`}><span className="label-caps text-primary">Phase 0{i+1} · {part.range}</span><span className="mt-3 font-display text-lg font-extrabold text-foreground">{part.name}</span><span className="mt-2 text-xs font-normal leading-5 text-muted-foreground">{part.description}</span></Button>)}</div><div className="mt-7 grid gap-5 lg:grid-cols-[1.3fr_.7fr]"><div className="surface rounded-lg p-6 sm:p-8"><div className="flex flex-wrap justify-between gap-3"><div><span className="label-caps text-primary">Phase {phase+1} · {p.range}</span><h2 className="mt-2 text-xl font-extrabold">{p.name}</h2></div><div className="text-right"><div className="text-2xl font-extrabold text-primary">{Math.round(completed.filter(x=>x.startsWith(`${phase}-`)).length/5*100)}%</div><div className="text-xs text-muted-foreground">activities explored</div></div></div><div className="mt-5 h-2 overflow-hidden rounded-full bg-muted"><motion.div initial={false} animate={{width:`${completed.filter(x=>x.startsWith(`${phase}-`)).length/5*100}%`}} className="h-full rounded-full bg-primary"/></div><div className="mt-7 space-y-2">{p.items.map((item,i)=><label key={item} className="flex cursor-pointer items-center gap-3 rounded-md border border-border p-4 hover:bg-muted"><input type="checkbox" checked={completed.includes(`${phase}-${i}`)} onChange={()=>toggle(`${phase}-${i}`)} className="size-4 accent-primary"/><span className="text-sm font-medium">{item}</span></label>)}</div><p className="mt-5 text-xs leading-5 text-muted-foreground">These are optional educational activities, not a treatment plan. Revisit them whenever it feels helpful.</p></div><div className="space-y-5"><div className="surface rounded-lg p-6"><SectionHeading title="Weekly milestones"/>{p.weeks.map((week,i)=><div key={week} className="flex gap-3 border-l-2 border-primary/30 pb-5 pl-4 last:pb-0"><span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-bold text-primary">{i+1}</span><div><div className="text-xs font-bold text-muted-foreground">Week {phase*4+i+1}</div><div className="mt-1 text-sm font-semibold">{week}</div></div></div>)}</div><div className="rounded-lg bg-secondary p-6"><Compass size={20} className="text-primary"/><h3 className="mt-3 font-bold">Recovery checkpoint</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">What have you noticed about your thoughts, energy, and support needs lately? A check-in can help you reflect.</p><Button asChild variant="outline" className="mt-4"><Link to="/progress-tracker">Open tracker <ArrowRight/></Link></Button></div></div></div></div>}
const labels=[['mood','Mood'],['stress','Stress'],['sleep','Sleep quality'],['energy','Energy'],['activity','Physical activity'],['social','Social interaction']] as const;
export function Tracker(){const {entries,isDemo,add}=useWellness();const [form,setForm]=useState({mood:6,stress:5,sleep:6,energy:6,activity:5,social:6,journal:'',triggers:Object.fromEntries(triggerNames.map(n=>[n,4])) as Record<string,number>});const [saved,setSaved]=useState(false);const update=(key:string,v:number)=>setForm(f=>({...f,[key]:v}));const save=()=>{add({...form,id:`entry-${Date.now()}`,date:today()});setSaved(true)};return <div className="page-wrap py-10"><PageIntro eyebrow="Your private reflection space" title="Daily progress tracker" description="Check in with yourself, notice patterns, and write what matters. Entries stay in this browser on this device."/><div className="grid gap-6 lg:grid-cols-[1fr_.85fr]"><section className="surface rounded-lg p-6 sm:p-8"><div className="mb-7 flex items-center justify-between"><h2 className="text-xl font-extrabold">How are you today?</h2><span className="text-xs text-muted-foreground">{new Date().toLocaleDateString(undefined,{month:'long',day:'numeric',year:'numeric'})}</span></div><div className="grid gap-x-8 gap-y-6 sm:grid-cols-2">{labels.map(([key,label])=><label key={key} className="block"><span className="mb-2 flex justify-between text-sm font-semibold"><span>{label}</span><span className="text-primary">{form[key] ?? 0}/10</span></span><input className="w-full accent-primary" type="range" min="0" max="10" value={form[key] ?? 0} onChange={e=>update(key,Number(e.target.value))} aria-label={label}/><span className="flex justify-between text-[11px] text-muted-foreground"><span>Low</span><span>High</span></span></label>)}</div><h3 className="mt-8 text-sm font-bold">Possible triggers today <span className="font-normal text-muted-foreground">(optional)</span></h3><div className="mt-4 grid gap-x-8 gap-y-4 sm:grid-cols-2">{triggerNames.map(name=><label key={name}><span className="mb-1 flex justify-between text-xs"><span>{name}</span><span>{form.triggers[name]}/10</span></span><input className="w-full accent-primary" type="range" min="0" max="10" value={form.triggers[name]} onChange={e=>setForm(f=>({...f,triggers:{...f.triggers,[name]:Number(e.target.value)}}))} aria-label={name}/></label>)}</div><label className="mt-7 block text-sm font-bold" htmlFor="journal">A note to yourself</label><Textarea id="journal" rows={4} className="mt-2" value={form.journal} onChange={e=>setForm(f=>({...f,journal:e.target.value}))} placeholder="What's on your mind today?"/><div className="mt-5 flex flex-wrap items-center gap-3"><Button onClick={save}><Check size={16}/> Save check-in</Button>{saved&&<span role="status" className="text-sm font-semibold text-positive">Saved privately in this browser</span>}</div></section><div className="space-y-5"><div className="surface rounded-lg p-6"><div className="flex items-center justify-between"><h2 className="font-extrabold">Your trends</h2><span className="text-xs text-muted-foreground">{isDemo?'Sample preview':'Your entries'}</span></div><TrendChart entries={entries.slice(-14)} keys={['mood','stress','sleep']} height={230}/><div className="mt-2 flex flex-wrap gap-4 text-xs text-muted-foreground"><span>● Mood</span><span>● Stress</span><span>● Sleep</span></div></div><div className="rounded-lg bg-secondary p-6"><Info className="text-primary" size={20}/><h3 className="mt-3 font-bold">A note on your numbers</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">Higher stress means more stress today; other scales measure a higher amount or quality. Self-reported trends are useful for reflection, but no score can diagnose a condition.</p></div><div className="surface rounded-lg p-6"><h3 className="font-bold">Recent check-ins</h3><div className="mt-3 max-h-60 overflow-y-auto">{entries.slice(-5).reverse().map(x=><div key={x.id} className="flex justify-between border-b border-border py-3 text-sm last:border-0"><span>{x.date}</span><span className="font-bold text-primary">ARI {ari(x)}</span></div>)}</div></div></div></div></div>}
export function Analytics(){const {entries,isDemo}=useWellness();const latest=entries.at(-1);const first=entries[0];const score=latest?ari(latest):0;const improvement=first?rps(score,ari(first)):0;const triggerScore=latest?atpm(latest):0;const ranked=triggerNames.map((name,i)=>({name:name.replace(' pressure','').replace(' deficit','').replace(' isolation','').replace(' stress',''),value:(latest?.triggers[name]||0)*10,weighted:Math.round((latest?.triggers[name]||0)*10*(triggerWeights[i] ?? 0))})).sort((a,b)=>b.weighted-a.weighted);const current=entries.at(-1);const week=entries.at(-8);const month=entries.at(-30);return <div className="page-wrap py-10"><PageIntro eyebrow="Behavioral analytics · educational model" title="Your wellbeing, in perspective" description="Explore self-reported trends and research-inspired calculations. These are illustrative wellness signals, not clinical assessments or forecasts."/>{isDemo&&<div className="mb-6 flex gap-2 rounded-lg border border-border bg-secondary p-4 text-sm text-secondary-foreground"><Info size={18} className="shrink-0"/> You’re viewing realistic sample data. Save a check-in to begin your own private history.</div>}<div className="grid gap-4 md:grid-cols-3">{[{label:'Anxiety Recovery Index',value:score,suffix:'/ 100',detail:band(score),icon:Activity},{label:'Recovery Progress Score',value:`${improvement>0?'+':''}${improvement}`,suffix:'%',detail:'Change from first entry',icon:TrendingUp},{label:'Trigger pressure index',value:triggerScore,suffix:'/ 100',detail:'Weighted self-reported factors',icon:Compass}].map(m=><div key={m.label} className="surface rounded-lg p-6"><div className="flex items-center justify-between"><span className="label-caps text-muted-foreground">{m.label}</span><m.icon size={18} className="text-primary"/></div><div className="mt-5 font-display text-4xl font-extrabold text-primary">{m.value}<span className="ml-1 text-sm font-medium text-muted-foreground">{m.suffix}</span></div><p className="mt-2 text-xs text-muted-foreground">{m.detail}</p></div>)}</div><div className="mt-6 grid gap-5 lg:grid-cols-[1.35fr_1fr]"><div className="surface rounded-lg p-6"><div className="flex justify-between"><h2 className="font-extrabold">ARI score history</h2><span className="text-xs text-muted-foreground">{entries.length} entries</span></div><TrendChart entries={entries} height={260}/><p className="mt-3 text-xs text-muted-foreground">A descriptive index based on five check-in values; not a measure of medical risk.</p></div><div className="surface rounded-lg p-6"><h2 className="font-extrabold">Dominant trigger factors</h2><p className="mt-1 text-xs text-muted-foreground">Ranked by your latest self-report and model weights</p><TriggerChart data={ranked}/></div></div><div className="mt-5 grid gap-5 lg:grid-cols-2"><div className="surface rounded-lg p-6"><h2 className="font-extrabold">Behavioral heatmap</h2><p className="mt-1 text-xs text-muted-foreground">Daily ARI · deeper color indicates higher score</p><div className="mt-5 grid grid-cols-7 gap-2">{entries.slice(-28).map((e,i)=><div key={e.id} title={`${e.date}: ARI ${ari(e)}`} aria-label={`${e.date}, index ${ari(e)}`} className={`aspect-square rounded-sm ${ari(e)>70?'bg-primary':ari(e)>50?'bg-teal/60':'bg-secondary'}`}><span className="sr-only">Day {i+1}</span></div>)}</div><div className="mt-5 flex gap-3 text-xs text-muted-foreground"><span>■ Lower</span><span>■ Moderate</span><span>■ Higher</span></div></div><div className="surface rounded-lg p-6"><h2 className="font-extrabold">Wellness report</h2><div className="mt-5 space-y-4">{[['Latest ARI',`${score}/100`],['Weekly change',week?`${score-ari(week)>=0?'+':''}${score-ari(week)} points`:'Not enough entries'],['Monthly change',month?`${score-ari(month)>=0?'+':''}${score-ari(month)} points`:'Not enough entries'],['Most prominent trigger',ranked[0]?.name||'Not recorded'],['Sleep quality',`${current?.sleep||0}/10`]].map(([l,v])=><div key={l} className="flex justify-between gap-3 border-b border-border pb-3 text-sm"><span className="text-muted-foreground">{l}</span><strong>{v}</strong></div>)}</div><p className="mt-4 text-xs leading-5 text-muted-foreground">A recovery forecast cannot be reliably inferred from these entries; consider this a snapshot, not a prediction.</p></div></div><div className="mt-8 rounded-lg bg-secondary p-6"><h2 className="font-display text-lg font-extrabold">How these scores are calculated</h2><div className="mt-4 grid gap-5 text-sm leading-7 text-muted-foreground md:grid-cols-3"><p><strong className="text-foreground">ARI</strong><br/>0.25(Sleep Quality) + 0.25(Mood Stability) + 0.20(Physical Activity) + 0.15(Social Engagement) + 0.15(100 − Stress Level). Inputs are scaled from 0–10 to 0–100.</p><p><strong className="text-foreground">RPS</strong><br/>((Current ARI − Day 1 ARI) / Day 1 ARI) × 100. When Day 1 is zero, the value is shown as zero rather than dividing by zero.</p><p><strong className="text-foreground">ATPM</strong><br/>0.30(Academic) + 0.25(Work) + 0.20(Sleep Deficit) + 0.15(Isolation) + 0.10(Financial). Inputs are scaled from 0–10 to 0–100.</p></div><p className="mt-5 border-t border-border pt-4 text-xs leading-5 text-muted-foreground">Model weights and bands (0–20 critical risk, 21–40 high risk, 41–60 moderate risk, 61–80 stable, 81–100 flourishing) are illustrative labels only, not validated medical risk categories. A low or high score cannot determine clinical need. Seek professional support for persistent, severe, or impairing symptoms.</p></div></div>}
function answer(text:string,score:number){const t=text.toLowerCase();if(/suicid|self.harm|hurt myself|emergency|crisis/.test(t))return 'I’m sorry you’re going through this. I cannot provide emergency counseling. If you may be in immediate danger, contact local emergency services or a crisis line now. If you are in the US, call or text 988. Elsewhere, find a local helpline at findahelpline.com. Consider reaching out to someone you trust right now.';if(/diagnos|do i have|what disorder|am i sick/.test(t))return 'I can’t diagnose or determine whether you have a disorder. Anxiety experiences can overlap with other concerns. A qualified mental health professional can listen, assess your situation, and discuss appropriate support, especially if symptoms persist or interfere with daily life.';if(/trigger|pressure|stress/.test(t))return 'Potential triggers can include uncertainty, deadlines, changes in sleep, work demands, or social situations. You might note what happened before a difficult moment, what you felt in your body, and what helped afterward. This is a way to explore patterns, not to establish a cause with certainty.';if(/breath|ground|panic|calm/.test(t))return 'You could try a gentle grounding practice: notice five things you can see, four you can feel, three you can hear, two you can smell, and one you can taste. Or breathe slowly at a comfortable pace without forcing it. If physical symptoms feel new, severe, or concerning, seek medical advice.';if(/score|ari|analytics|index/.test(t))return `Your current illustrative ARI is ${score}/100. It combines self-reported sleep, mood, movement, social contact, and stress. A score is not a diagnosis, a medical risk measure, or a prediction; the most useful insight may be how your patterns change over time and what was happening around them.`;if(/roadmap|plan|week|habit|routine|recovery/.test(t))return 'A gentle weekly plan might include one consistent sleep cue, a short daily check-in, movement that feels accessible, and time with a supportive person. Try one small step first, then adapt it to your circumstances. There is no universal recovery schedule; a professional can help personalize a plan.';return 'Anxiety can involve thoughts, feelings, body sensations, and behaviors. It is a common response to perceived threat, and experiences vary. You could start by noticing when the feeling appears and what support you need. If it is persistent, severe, or disrupts daily life, a qualified professional can help.'}
export function Guide() {
	const { entries } = useWellness();
	const latest = entries.at(-1) ?? entries[0];
	const score = latest ? ari(latest) : 0;
	const [messages, setMessages] = useState<ChatMessage[]>([
		{ id: "welcome", role: "assistant", text: WELCOME_MESSAGE },
	]);
	const [text, setText] = useState("");
	const [typing, setTyping] = useState(false);

	const send = async (value: string) => {
		const trimmed = value.trim();
		if (!trimmed || typing) return;
		const userMessage = createChatMessage("user", trimmed);
		setMessages((current) => [...current, userMessage]);
		setText("");

		if (/suicid|self[\s.-]?harm|hurt myself|kill myself|don't want to live|emergency|crisis|diagnos|do i have|what disorder|am i sick/i.test(trimmed)) {
			const safetyReply = /kill myself|don't want to live/i.test(trimmed)
				? "I’m sorry you’re dealing with this. I can’t provide emergency support. If you may be in immediate danger, contact your local emergency service or crisis line now. If possible, tell someone you trust and stay with them while you seek help."
				: answer(trimmed, score);
			setMessages((current) => [...current, createChatMessage("assistant", safetyReply)]);
			return;
		}

		setTyping(true);
		try {
			const reply = await requestGeminiReply(trimmed, messages.slice(1));
			setMessages((current) => [...current, createChatMessage("assistant", reply)]);
		} catch (error) {
			setMessages((current) => [
				...current,
				{
					...createChatMessage(
						"assistant",
						error instanceof Error
							? error.message
							: "The wellness guide is temporarily unavailable. Please try again.",
					),
				},
			]);
		} finally {
			setTyping(false);
		}
	};

	return (
		<div className="page-wrap py-10">
			<PageIntro
				eyebrow="Self-guided education"
				title="A space to ask and reflect"
				description="Explore anxiety concepts, coping ideas, and your illustrative scores with a compassionate educational guide."
			/>
			<div className="grid gap-5 lg:grid-cols-[1fr_285px]">
				<AICompanion
					messages={messages}
					text={text}
					typing={typing}
					onTextChange={setText}
					onSend={(value) => {
						void send(value);
					}}
				/>
				<aside className="space-y-4">
					<div className="rounded-lg bg-secondary p-5">
						<ShieldCheck className="text-primary" size={20} />
						<h3 className="mt-3 text-sm font-bold">A supportive boundary</h3>
						<p className="mt-2 text-xs leading-6 text-muted-foreground">
							Replies are generated by Google Gemini and may be inaccurate. Messages are sent to Google to
							generate replies. Avoid sharing identifying or sensitive details. This AI is not a clinician,
							cannot diagnose, and does not handle emergencies.
						</p>
					</div>
					<div className="surface rounded-lg p-5">
						<h3 className="text-sm font-bold">Need more support?</h3>
						<p className="mt-2 text-xs leading-6 text-muted-foreground">
							If your symptoms are severe, persistent, or affect your everyday life, reach out to a
							qualified professional.
						</p>
						<Link to="/resources" className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-primary">
							Explore resources <ArrowRight size={14} />
						</Link>
					</div>
				</aside>
			</div>
		</div>
	);
}
