import { useEffect, useState } from 'react'
import Spline from '@splinetool/react-spline'

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function Hero() {
  return (
    <div className="relative h-[68vh] w-full overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/4cHQr84zOGAHOehh/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-white/20 to-white/80 pointer-events-none" />
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <div className="inline-flex items-center text-xs font-medium px-3 py-1 rounded-full bg-white/70 backdrop-blur border border-white/40 text-gray-700">Made for Indian CA Firms</div>
        <h1 className="mt-4 text-4xl sm:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-amber-500">
          AuditFlow AI
        </h1>
        <p className="mt-4 text-gray-700 text-base sm:text-lg">
          Workflow intelligence for audits and compliance. Automate, predict, and organize every step with an AI co‑pilot that understands CA workflows in real time.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
          <a href="#get-started" className="px-5 py-3 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition">Get Started</a>
          <a href="#demo" className="px-5 py-3 rounded-lg bg-white/80 border border-gray-200 hover:bg-white transition">See Live Demo</a>
        </div>
      </div>
    </div>
  )
}

function DemoPanel() {
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState('Acme Traders Pvt Ltd')
  const [ctype, setCtype] = useState('GST')
  const [fy, setFy] = useState('FY 2024-25')
  const [workflows, setWorkflows] = useState([])

  const refresh = async () => {
    const res = await fetch(`${API}/api/clients`)
    const data = await res.json()
    setClients(data.items || [])
  }

  const createClient = async () => {
    setLoading(true)
    await fetch(`${API}/api/clients`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, client_type: ctype, business_size: 'small', fiscal_year: fy })
    })
    await refresh()
    setLoading(false)
  }

  const generateWorkflow = async (id) => {
    setLoading(true)
    await fetch(`${API}/api/workflows/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ client_id: id })
    })
    const res = await fetch(`${API}/api/workflows?client_id=${id}`)
    const data = await res.json()
    setWorkflows(data.items || [])
    setLoading(false)
  }

  useEffect(() => { refresh() }, [])

  return (
    <section id="demo" className="py-12">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-2xl font-bold text-gray-900">Live Demo</h2>
        <p className="text-gray-600">Create a client and auto‑generate a dynamic workflow map.</p>

        <div className="mt-6 grid md:grid-cols-3 gap-6">
          <div className="md:col-span-1 bg-white rounded-xl border p-4">
            <h3 className="font-semibold">New Client</h3>
            <div className="mt-3 space-y-3">
              <input value={name} onChange={e=>setName(e.target.value)} className="w-full border rounded px-3 py-2" placeholder="Client name" />
              <select value={ctype} onChange={e=>setCtype(e.target.value)} className="w-full border rounded px-3 py-2">
                <option>GST</option>
                <option>ITR</option>
                <option>CompanyAudit</option>
              </select>
              <input value={fy} onChange={e=>setFy(e.target.value)} className="w-full border rounded px-3 py-2" placeholder="Fiscal Year" />
              <button onClick={createClient} disabled={loading} className="w-full bg-indigo-600 text-white rounded px-4 py-2 hover:bg-indigo-700">
                {loading ? 'Creating...' : 'Create Client'}
              </button>
            </div>
          </div>

          <div className="md:col-span-1 bg-white rounded-xl border p-4">
            <h3 className="font-semibold">Clients</h3>
            <ul className="mt-3 space-y-2">
              {clients.map(c => (
                <li key={c.id} className="flex items-center justify-between gap-2">
                  <div>
                    <div className="font-medium">{c.name}</div>
                    <div className="text-xs text-gray-500">{c.client_type} • {c.fiscal_year}</div>
                  </div>
                  <button onClick={()=>generateWorkflow(c.id)} className="px-3 py-1 text-sm rounded bg-gray-900 text-white hover:bg-black">Generate</button>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-1 bg-white rounded-xl border p-4">
            <h3 className="font-semibold">Workflow Map</h3>
            <div className="mt-3 space-y-3">
              {workflows.map(wf => (
                <div key={wf.id} className="border rounded-lg">
                  <div className="px-3 py-2 border-b text-sm text-gray-700">{wf.client_type} • {wf.fiscal_year}</div>
                  <ul className="p-3 space-y-2">
                    {wf.steps.map(step => (
                      <li key={step.key} className="p-2 rounded border flex items-center justify-between">
                        <div>
                          <div className="font-medium text-sm">{step.title}</div>
                          <div className="text-xs text-gray-500 capitalize">{step.category}</div>
                        </div>
                        <span className="text-xs rounded-full px-2 py-0.5 bg-gray-100">{step.status}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-indigo-50">
      <Hero />
      <DemoPanel />
      <footer className="py-10 text-center text-xs text-gray-500">© {new Date().getFullYear()} AuditFlow AI. Built for Indian CA firms.</footer>
    </div>
  )
}
