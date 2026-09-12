import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function AdminProblemsPage() {
  const navigate = useNavigate()

  const [problems, setProblems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadProblems = async () => {
      try {
        const token = localStorage.getItem('samadhan_token')

        const response = await fetch(
          'http://localhost:5000/api/problems/all',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.message || 'Failed to load problems.')
        }

        setProblems(data.problems || [])
      } catch (error) {
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    loadProblems()
  }, [])

  return (
    <div className="min-h-screen bg-[#f7faf9] p-6 sm:p-10">
      <div className="mx-auto max-w-6xl">

        <button
          onClick={() => navigate('/dashboard')}
          className="mb-6 text-sm font-bold text-lagoon hover:underline"
        >
          ← Back to Dashboard
        </button>

        <div>
          <p className="text-sm font-extrabold uppercase tracking-[.16em] text-lagoon">
            ADMINISTRATION
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Review Problems
          </h1>

          <p className="mt-2 text-slate-600">
            Review and manage problems submitted by citizens.
          </p>
        </div>

        {loading && (
          <div className="mt-10 rounded-2xl bg-white p-8 text-center shadow-sm">
            Loading problems...
          </div>
        )}

        {error && (
          <div className="mt-10 rounded-2xl bg-red-50 p-5 text-red-600">
            {error}
          </div>
        )}

        {!loading && !error && problems.length === 0 && (
          <div className="mt-10 rounded-2xl bg-white p-10 text-center shadow-sm">
            <h2 className="text-xl font-bold">
              No problems found
            </h2>

            <p className="mt-2 text-slate-500">
              There are no citizen problems to review.
            </p>
          </div>
        )}

        {!loading && !error && problems.length > 0 && (
          <div className="mt-10 space-y-4">
            {problems.map((problem) => (
              <button
                key={problem._id}
                onClick={() => navigate(`/problem/${problem._id}`)}
                className="w-full rounded-2xl border border-slate-100 bg-white p-6 text-left shadow-sm transition hover:border-teal-200 hover:bg-mist"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                  <div>
                    <h2 className="text-xl font-bold text-slate-900">
                      {problem.title}
                    </h2>

                    <p className="mt-2 text-slate-600">
                      {problem.description}
                    </p>
                  </div>

                  <span className="w-fit rounded-full bg-teal-50 px-3 py-1 text-sm font-bold capitalize text-teal-700">
                    {problem.status?.replace('_', ' ')}
                  </span>
                </div>

                <div className="mt-5 flex flex-wrap gap-3 text-sm">

                  {problem.category && (
                    <span className="rounded-lg bg-slate-100 px-3 py-2">
                      Category: {problem.category}
                    </span>
                  )}

                  <span className="rounded-lg bg-slate-100 px-3 py-2 capitalize">
                    Priority: {problem.priority}
                  </span>

                  {problem.location?.address && (
                    <span className="rounded-lg bg-slate-100 px-3 py-2">
                      Location: {problem.location.address}
                    </span>
                  )}

                </div>

                <p className="mt-4 text-xs text-slate-400">
                  Submitted:{' '}
                  {problem.createdAt
                    ? new Date(problem.createdAt).toLocaleString()
                    : 'Unknown'}
                </p>
              </button>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}