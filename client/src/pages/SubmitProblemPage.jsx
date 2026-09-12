import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function SubmitProblemPage() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    priority: 'medium',
    address: '',
  })

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')
    setLoading(true)

    try {
      const token = localStorage.getItem('samadhan_token')

      const response = await fetch('http://localhost:5000/api/problems', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          category: form.category,
          priority: form.priority,
          location: {
            address: form.address,
          },
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit problem.')
      }

      setMessage('Problem submitted successfully!')

      setForm({
        title: '',
        description: '',
        category: '',
        priority: 'medium',
        address: '',
      })
    } catch (error) {
      setMessage(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-3xl">
        <button
          onClick={() => navigate('/dashboard')}
          className="mb-6 text-sm font-medium text-teal-700"
        >
          ← Back to Dashboard
        </button>

        <div className="rounded-2xl bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-bold text-slate-900">
            Submit a Problem
          </h1>

          <p className="mt-2 text-slate-500">
            Tell us about a civic problem in your area.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">

            <div>
              <label className="mb-2 block font-medium">
                Problem Title
              </label>

              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                minLength={5}
                placeholder="e.g. Street light not working"
                className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-teal-600"
              />
            </div>

            <div>
              <label className="mb-2 block font-medium">
                Description
              </label>

              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                required
                minLength={10}
                rows={5}
                placeholder="Describe the problem..."
                className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-teal-600"
              />
            </div>

            <div>
              <label className="mb-2 block font-medium">
                Category
              </label>

              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 p-3"
              >
                <option value="">Select category</option>
                <option value="Road">Road</option>
                <option value="Electricity">Electricity</option>
                <option value="Water">Water</option>
                <option value="Sanitation">Sanitation</option>
                <option value="Education">Education</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block font-medium">
                Priority
              </label>

              <select
                name="priority"
                value={form.priority}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 p-3"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block font-medium">
                Location
              </label>

              <input
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Enter problem location"
                className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-teal-600"
              />
            </div>

            {message && (
              <div className="rounded-lg bg-slate-100 p-3 text-sm">
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-teal-700 px-5 py-3 font-semibold text-white hover:bg-teal-800 disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Submit Problem'}
            </button>

          </form>
        </div>
      </div>
    </div>
  )
}

export default SubmitProblemPage