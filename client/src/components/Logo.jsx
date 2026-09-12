import { Sparkles } from 'lucide-react'

export default function Logo({ light = false }) {
  return (
    <div className={`flex items-center gap-2 font-[Space_Grotesk] text-lg font-bold ${light ? 'text-white' : 'text-ink'}`}>
      <span className="grid size-9 place-items-center rounded-xl bg-lagoon text-white"><Sparkles size={18} /></span>
      Samadhan <span className={light ? 'text-teal-200' : 'text-lagoon'}>Setu</span>
    </div>
  )
}
