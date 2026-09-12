import { ArrowRight, BrainCircuit, Building2, CheckCircle2, GraduationCap, HeartHandshake, MapPin, ShieldCheck, UsersRound } from 'lucide-react'
import { Link } from 'react-router-dom'
import PublicNav from '../components/PublicNav'

const stats = [
  ['1,248', 'Problems received'], ['1,201', 'AI-classified'], ['186', 'Under development'], ['324', 'Solutions delivered'],
]

const steps = [
  { icon: MapPin, title: 'Share what matters', text: 'Citizens submit a real local challenge with photos, location, and context.' },
  { icon: BrainCircuit, title: 'AI finds the right path', text: 'The platform categorises, prioritises, checks duplicates, and recommends experts.' },
  { icon: GraduationCap, title: 'Teams build solutions', text: 'Students and faculty turn verified needs into measurable projects.' },
  { icon: HeartHandshake, title: 'Partners help scale', text: 'Industry and government bring resources, testing, and implementation support.' },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#fbfdfc]">
      <PublicNav />
      <main>
        <section className="relative overflow-hidden">
          <div className="absolute -right-36 -top-28 size-[32rem] rounded-full bg-teal-100/70 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 size-80 rounded-full bg-amber-100/60 blur-3xl" />
          <div className="relative mx-auto grid max-w-7xl gap-12 px-5 py-20 md:grid-cols-[1.08fr_.92fr] md:py-28">
            <div className="max-w-2xl">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-teal-100 bg-white px-4 py-2 text-sm font-bold text-lagoon shadow-sm"><ShieldCheck size={16} /> SIH26043 · Citizen-led innovation</div>
              <h1 className="text-5xl font-bold leading-[1.04] tracking-tight text-ink md:text-7xl">From local problems to <span className="text-lagoon">shared solutions.</span></h1>
              <p className="mt-7 max-w-xl text-lg leading-8 text-slate-600">Samadhan Setu connects citizens, universities, industry, and government so every verified problem has a path to action.</p>
              <div className="mt-9 flex flex-wrap gap-3"><Link to="/register" className="btn-primary">Report a problem <ArrowRight size={18} /></Link><a href="#how-it-works" className="btn-secondary">See how it works</a></div>
              <div className="mt-10 flex items-center gap-3 text-sm text-slate-500"><div className="flex -space-x-2">{['A', 'K', 'R', 'S'].map((letter, i) => <span key={letter} className={`grid size-8 place-items-center rounded-full border-2 border-white text-xs font-bold text-white ${['bg-rose-400', 'bg-violet-400', 'bg-sky-500', 'bg-amber-500'][i]}`}>{letter}</span>)}</div><span>Built with citizens, students & changemakers</span></div>
            </div>
            <div className="relative self-center rounded-3xl border border-white bg-white/80 p-5 shadow-soft backdrop-blur">
              <div className="rounded-2xl bg-ink p-6 text-white">
                <div className="mb-6 flex items-center justify-between"><span className="text-sm font-bold text-teal-200">LIVE PROBLEM ROUTING</span><span className="size-2 animate-pulse rounded-full bg-emerald-400" /></div>
                <h2 className="text-2xl font-bold">Waterlogging during monsoon</h2><p className="mt-2 text-sm leading-6 text-slate-300">Ward 12, Buxar · Reported with location and 3 photos</p>
                <div className="mt-6 grid grid-cols-2 gap-3"><Metric label="AI category" value="Infrastructure" /><Metric label="Priority" value="High" /><Metric label="Duplicate risk" value="18%" /><Metric label="Suggested domain" value="Civil engineering" /></div>
              </div>
              <div className="mt-4 flex items-center gap-3 rounded-2xl border border-teal-100 bg-mist p-4"><span className="grid size-10 place-items-center rounded-xl bg-white text-lagoon shadow-sm"><GraduationCap size={20} /></span><div><p className="text-sm font-bold">Routed to university team</p><p className="text-xs text-slate-500">Faculty review awaiting confirmation</p></div><CheckCircle2 className="ml-auto text-lagoon" size={20} /></div>
            </div>
          </div>
        </section>
        <section id="impact" className="border-y border-teal-50 bg-white"><div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-y divide-teal-50 md:grid-cols-4 md:divide-y-0">{stats.map(([number, label]) => <div key={label} className="px-5 py-8 text-center"><p className="text-3xl font-bold text-lagoon">{number}</p><p className="mt-1 text-sm font-semibold text-slate-500">{label}</p></div>)}</div></section>
        <section id="how-it-works" className="mx-auto max-w-7xl px-5 py-24"><div className="max-w-2xl"><p className="text-sm font-extrabold uppercase tracking-[.18em] text-lagoon">One problem. Many contributors.</p><h2 className="mt-3 text-4xl font-bold tracking-tight">A complete path from concern to impact.</h2><p className="mt-4 leading-7 text-slate-600">This is not a complaint box. It is a structured collaboration space for discovering, building, validating, and tracking meaningful civic solutions.</p></div><div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">{steps.map((step, index) => <article key={step.title} className="relative rounded-2xl border border-slate-100 bg-white p-6 shadow-sm"><span className="absolute right-5 top-5 text-4xl font-bold text-teal-50">0{index + 1}</span><span className="grid size-12 place-items-center rounded-xl bg-mist text-lagoon"><step.icon size={24} /></span><h3 className="mt-6 text-xl font-bold">{step.title}</h3><p className="mt-3 text-sm leading-6 text-slate-600">{step.text}</p></article>)}</div></section>
        <section className="mx-auto max-w-7xl px-5 pb-24"><div className="overflow-hidden rounded-3xl bg-lagoon px-7 py-12 text-white md:flex md:items-center md:justify-between md:px-12"><div><div className="mb-3 flex items-center gap-2 text-teal-100"><UsersRound size={18} /><span className="text-sm font-bold">For every role in the solution</span></div><h2 className="text-3xl font-bold">Bring your expertise to a real problem.</h2><p className="mt-3 max-w-xl text-teal-50">Citizen, student, mentor, institution, industry partner, or administrator—your dashboard is ready for the work you do.</p></div><Link to="/register" className="mt-7 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 font-bold text-lagoon md:mt-0">Create your account <ArrowRight size={18} /></Link></div></section>
      </main>
      <footer className="border-t border-slate-100 bg-white"><div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-7 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between"><div className="flex items-center gap-2"><Building2 size={16} /> Built for SIH26043</div><p>Citizens → Universities → Industry → Government</p></div></footer>
    </div>
  )
}

function Metric({ label, value }) { return <div className="rounded-xl bg-white/10 p-3"><p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">{label}</p><p className="mt-1 text-sm font-bold">{value}</p></div> }
