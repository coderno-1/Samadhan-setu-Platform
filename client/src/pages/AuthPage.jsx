import { ArrowLeft, Eye, EyeOff, LoaderCircle } from 'lucide-react'
import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import Logo from '../components/Logo'
import { useAuth } from '../context/AuthContext'

const roles = [
  ['citizen', 'Citizen'], ['student', 'Student / University'], ['faculty', 'Faculty mentor'], ['industry', 'Industry / Startup'], ['admin', 'Admin / Government'],
]

export default function AuthPage({ mode }) {
  const isLogin = mode === 'login'
  const navigate = useNavigate()
  const { user, signIn, register } = useAuth()
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'citizen', organization: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  if (user) return <Navigate to="/dashboard" replace />

  const update = (event) => setForm({ ...form, [event.target.name]: event.target.value })
  const submit = async (event) => {
    event.preventDefault(); setError(''); setSubmitting(true)
    try { isLogin ? await signIn({ email: form.email, password: form.password }) : await register(form); navigate('/dashboard') } catch (err) { setError(err.message) } finally { setSubmitting(false) }
  }
  return <div className="grid min-h-screen lg:grid-cols-[.9fr_1.1fr]">
    <aside className="hidden bg-ink p-10 text-white lg:flex lg:flex-col"><Link to="/"><Logo light /></Link><div className="my-auto max-w-md"><p className="text-sm font-bold uppercase tracking-[.18em] text-teal-300">SIH26043</p><h1 className="mt-4 text-5xl font-bold leading-tight">Every local insight deserves a route to action.</h1><p className="mt-6 leading-7 text-slate-300">Join a network designed to move from reported challenges to credible, collaborative solutions.</p></div><p className="text-sm text-slate-400">Samadhan Setu · civic innovation, connected</p></aside>
    <main className="flex items-center justify-center px-5 py-10"><div className="w-full max-w-md"><Link to="/" className="mb-10 inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-lagoon"><ArrowLeft size={16} /> Back to home</Link><div className="lg:hidden"><Logo /></div><h2 className="mt-8 text-3xl font-bold">{isLogin ? 'Welcome back' : 'Join Samadhan Setu'}</h2><p className="mt-2 text-slate-500">{isLogin ? 'Log in to continue your impact journey.' : 'Choose your role and begin collaborating on real problems.'}</p><form className="mt-8 space-y-4" onSubmit={submit}>{!isLogin && <><Field label="Full name" name="name" value={form.name} onChange={update} placeholder="Your name" required /><Field label="Organisation / institution" name="organization" value={form.organization} onChange={update} placeholder="Optional" /><label className="block"><span className="mb-2 block text-sm font-bold text-slate-700">I am joining as</span><select name="role" value={form.role} onChange={update} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-lagoon focus:ring-4 focus:ring-teal-50">{roles.map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select></label></>}<Field label="Email address" name="email" value={form.email} onChange={update} type="email" placeholder="you@example.com" required /><label className="block"><span className="mb-2 block text-sm font-bold text-slate-700">Password</span><div className="relative"><input className="w-full rounded-xl border border-slate-200 px-4 py-3 pr-12 text-sm outline-none transition focus:border-lagoon focus:ring-4 focus:ring-teal-50" name="password" type={showPassword ? 'text' : 'password'} value={form.password} onChange={update} placeholder="Minimum 8 characters" minLength="8" required /><button type="button" aria-label="Show password" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></div></label>{error && <p role="alert" className="rounded-xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600">{error}</p>}<button disabled={submitting} className="btn-primary w-full disabled:cursor-wait disabled:opacity-70">{submitting && <LoaderCircle className="animate-spin" size={18} />}{isLogin ? 'Log in securely' : 'Create my account'}</button></form><p className="mt-6 text-center text-sm text-slate-500">{isLogin ? 'New to Samadhan Setu?' : 'Already have an account?'} <Link className="font-bold text-lagoon hover:underline" to={isLogin ? '/register' : '/login'}>{isLogin ? 'Create an account' : 'Log in'}</Link></p></div></main>
  </div>
}

function Field({ label, ...props }) { return <label className="block"><span className="mb-2 block text-sm font-bold text-slate-700">{label}</span><input className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-lagoon focus:ring-4 focus:ring-teal-50" {...props} /></label> }
