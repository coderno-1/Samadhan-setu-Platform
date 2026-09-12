import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminAIAnalysisPage() {
  const navigate = useNavigate();

  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reanalyzing, setReanalyzing] = useState(false);

  useEffect(() => {
    const loadProblems = async () => {
      try {
        const token = localStorage.getItem("samadhan_token");

        const response = await fetch("http://localhost:5000/api/problems/all", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load AI analysis.");
        }

        setProblems(data.problems || []);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadProblems();
  }, []);

  const analyzedProblems = problems.filter((problem) => problem.aiAnalysis);

  const duplicateProblems = problems.filter(
    (problem) => problem.aiAnalysis?.isDuplicate,
  );

  const averageConfidence = analyzedProblems.length
    ? Math.round(
        (analyzedProblems.reduce(
          (sum, problem) => sum + (problem.aiAnalysis?.confidence || 0),
          0,
        ) /
          analyzedProblems.length) *
          100,
      )
    : 0;

  const handleReanalyze = async () => {
    try {
      setReanalyzing(true);

      const token = localStorage.getItem("samadhan_token");

      const response = await fetch(
        "http://localhost:5000/api/problems/admin/reanalyze",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to re-analyze problems.");
      }

      alert(
        `Re-analysis complete. ${data.duplicateCount} duplicate problems detected.`,
      );

      window.location.reload();
    } catch (error) {
      alert(error.message);
    } finally {
      setReanalyzing(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <button
          onClick={() => navigate("/dashboard")}
          className="mb-6 text-sm font-medium text-slate-600 hover:text-teal-700"
        >
          ← Back to Dashboard
        </button>

        <div className="rounded-3xl bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-700">
            AI Workspace
          </p>

          <h1 className="mt-3 text-3xl font-bold text-slate-900">
            AI Analysis
          </h1>

          <button
            onClick={handleReanalyze}
            disabled={reanalyzing}
            className="mt-5 rounded-xl bg-teal-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {reanalyzing ? "Re-analyzing..." : "Re-analyze All Problems"}
          </button>

          <p className="mt-2 text-slate-600">
            AI-generated category, priority, confidence, and duplicate detection
            results.
          </p>

          {loading && (
            <p className="mt-8 text-slate-500">Loading AI analysis...</p>
          )}

          {error && (
            <p className="mt-8 rounded-xl bg-red-50 p-4 text-red-600">
              {error}
            </p>
          )}

          {!loading && !error && (
            <>
              {/* Summary Cards */}
              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
                  <p className="text-sm font-semibold text-slate-500">
                    Total Analyzed
                  </p>
                  <p className="mt-2 text-3xl font-bold text-slate-900">
                    {analyzedProblems.length}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
                  <p className="text-sm font-semibold text-slate-500">
                    Duplicates Detected
                  </p>
                  <p className="mt-2 text-3xl font-bold text-slate-900">
                    {duplicateProblems.length}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
                  <p className="text-sm font-semibold text-slate-500">
                    Average Confidence
                  </p>
                  <p className="mt-2 text-3xl font-bold text-slate-900">
                    {averageConfidence}%
                  </p>
                </div>
              </div>

              {/* Problems */}
              <div className="mt-8 space-y-4">
                {problems.map((problem) => {
                  const ai = problem.aiAnalysis;

                  return (
                    <button
                      key={problem._id}
                      onClick={() => navigate(`/problem/${problem._id}`)}
                      className="w-full rounded-2xl border border-slate-100 p-5 text-left transition hover:border-teal-200 hover:bg-slate-50"
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <h2 className="text-lg font-bold text-slate-900">
                            {problem.title}
                          </h2>

                          <p className="mt-1 text-sm text-slate-500">
                            {problem.description}
                          </p>
                        </div>

                        <span className="shrink-0 text-sm font-bold text-slate-400">
                          View →
                        </span>
                      </div>

                      {ai && (
                        <div className="mt-5 grid gap-3 sm:grid-cols-3">
                          <div className="rounded-xl bg-slate-50 p-3">
                            <p className="text-xs font-semibold text-slate-400">
                              CATEGORY
                            </p>
                            <p className="mt-1 font-bold text-slate-800">
                              {ai.category || "Not detected"}
                            </p>
                          </div>

                          <div className="rounded-xl bg-slate-50 p-3">
                            <p className="text-xs font-semibold text-slate-400">
                              PRIORITY
                            </p>
                            <p className="mt-1 font-bold capitalize text-slate-800">
                              {ai.priority || "Not detected"}
                            </p>
                          </div>

                          <div className="rounded-xl bg-slate-50 p-3">
                            <p className="text-xs font-semibold text-slate-400">
                              CONFIDENCE
                            </p>
                            <p className="mt-1 font-bold text-slate-800">
                              {Math.round((ai.confidence || 0) * 100)}%
                            </p>
                          </div>
                        </div>
                      )}

                      {ai?.isDuplicate && (
                        <div className="mt-4 rounded-xl bg-amber-50 p-3 text-sm font-semibold text-amber-700">
                          ⚠️ Duplicate problem detected
                        </div>
                      )}

                      {ai && !ai.isDuplicate && (
                        <div className="mt-4 rounded-xl bg-emerald-50 p-3 text-sm font-semibold text-emerald-700">
                          ✓ No duplicate problem detected
                        </div>
                      )}

                      {!ai && (
                        <div className="mt-4 rounded-xl bg-slate-50 p-3 text-sm font-semibold text-slate-500">
                          AI analysis not available
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
