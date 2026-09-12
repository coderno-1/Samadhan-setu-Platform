import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProblemDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProblem = async () => {
      try {
        const token = localStorage.getItem("samadhan_token");

        const response = await fetch(
          `http://localhost:5000/api/problems/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load problem.");
        }

        setProblem(data.problem);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadProblem();
  }, [id]);

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center text-slate-600">
        Loading problem...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#f7faf9] p-8">
        <button
          onClick={() =>
            navigate(user?.role === "admin" ? "/admin/problems" : "/workspace")
          }
          className="font-bold text-lagoon hover:underline"
        >
          {user?.role === "admin"
            ? "← Back to Review Problems"
            : "← Back to My Workspace"}
        </button>

        <p className="mt-8 text-red-500">{error}</p>
      </div>
    );
  }

  if (!problem) return null;

  return (
    <div className="min-h-screen bg-[#f7faf9]">
      <main className="mx-auto max-w-5xl px-5 py-10 sm:px-8">
        <button
          onClick={() =>
            navigate(user?.role === "admin" ? "/admin/problems" : "/workspace")
          }
          className="font-bold text-lagoon hover:underline"
        >
          {user?.role === "admin"
            ? "← Back to Review Problems"
            : "← Back to My Workspace"}
        </button>

        <div className="mt-8">
          <p className="text-sm font-extrabold uppercase tracking-[.16em] text-lagoon">
            PROBLEM DETAILS
          </p>

          <h1 className="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            {problem.title}
          </h1>

          <div className="mt-4 inline-block rounded-full bg-mist px-4 py-2 text-sm font-bold text-lagoon">
            {problem.status?.replace("_", " ") || "Submitted"}
          </div>
        </div>

        <section className="mt-8 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold">Description</h2>

          <p className="mt-4 leading-7 text-slate-600">{problem.description}</p>
        </section>

        <section className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold text-slate-400">Category</p>

            <p className="mt-2 text-lg font-bold text-ink">
              {problem.category || "Not specified"}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold text-slate-400">Priority</p>

            <p className="mt-2 text-lg font-bold text-ink capitalize">
              {problem.priority || "Medium"}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold text-slate-400">Location</p>

            <p className="mt-2 text-lg font-bold text-ink">
              {problem.location?.address || "Not specified"}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold text-slate-400">Submitted On</p>

            <p className="mt-2 text-lg font-bold text-ink">
              {problem.createdAt
                ? new Date(problem.createdAt).toLocaleString()
                : "Not available"}
            </p>
          </div>
        </section>

        {user?.role === "admin" && (
          <section className="mt-6 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold">Update Problem Status</h2>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <select
                value={problem.status}
                onChange={(e) =>
                  setProblem({
                    ...problem,
                    status: e.target.value,
                  })
                }
                className="rounded-xl border border-slate-200 bg-white px-4 py-3 font-semibold outline-none focus:border-teal-500"
              >
                <option value="submitted">Submitted</option>
                <option value="under_review">Under Review</option>
                <option value="assigned">Team Assigned</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="rejected">Rejected</option>
              </select>

              <button
                onClick={async () => {
                  try {
                    const token = localStorage.getItem("samadhan_token");

                    const response = await fetch(
                      `http://localhost:5000/api/problems/${problem._id}/status`,
                      {
                        method: "PATCH",
                        headers: {
                          "Content-Type": "application/json",
                          Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({
                          status: problem.status,
                        }),
                      },
                    );

                    const data = await response.json();

                    if (!response.ok) {
                      throw new Error(
                        data.message || "Failed to update status.",
                      );
                    }

                    setProblem(data.problem);
                    alert("Problem status updated successfully.");
                  } catch (error) {
                    alert(error.message);
                  }
                }}
                className="btn-primary"
              >
                Update Status
              </button>
            </div>
          </section>
        )}

        <section className="mt-6 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold">Problem Progress</h2>

          {problem.status === "rejected" ? (
            <div className="mt-8 rounded-2xl bg-red-50 p-6">
              <div className="flex items-center gap-3">
                <span className="flex size-9 items-center justify-center rounded-full bg-red-500 text-white">
                  ✕
                </span>

                <div>
                  <p className="font-bold text-red-700">Problem Rejected</p>

                  <p className="mt-1 text-sm text-red-600">
                    This problem was rejected during the review process.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-8 space-y-6">
              {[
                {
                  key: "submitted",
                  title: "Problem Submitted",
                  description: "Your problem has been successfully submitted.",
                },
                {
                  key: "under_review",
                  title: "Under Review",
                  description: "The submitted problem is being reviewed.",
                },
                {
                  key: "assigned",
                  title: "Team Assigned",
                  description:
                    "A suitable university or student team will be assigned.",
                },
                {
                  key: "in_progress",
                  title: "Solution In Progress",
                  description: "The assigned team is working on the problem.",
                },
                {
                  key: "resolved",
                  title: "Problem Resolved",
                  description: "The solution has been completed.",
                },
              ].map((step, index, steps) => {
                const statusOrder = {
                  submitted: 0,
                  under_review: 1,
                  assigned: 2,
                  in_progress: 3,
                  resolved: 4,
                };

                const currentIndex = statusOrder[problem.status] ?? 0;
                const isCompleted = index <= currentIndex;
                const isCurrent = index === currentIndex;

                return (
                  <div key={step.key} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div
                        className={`flex size-8 items-center justify-center rounded-full text-sm font-bold ${
                          isCompleted
                            ? "bg-teal-500 text-white"
                            : "bg-slate-100 text-slate-400"
                        }`}
                      >
                        {index + 1}
                      </div>

                      {index !== steps.length - 1 && (
                        <div
                          className={`mt-2 h-10 w-0.5 ${
                            index < currentIndex
                              ? "bg-teal-500"
                              : "bg-slate-200"
                          }`}
                        />
                      )}
                    </div>

                    <div className="pb-2">
                      <p
                        className={`font-bold ${
                          isCurrent ? "text-teal-700" : "text-slate-800"
                        }`}
                      >
                        {step.title}
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        {step.description}
                      </p>

                      {isCurrent && (
                        <span className="mt-2 inline-block rounded-full bg-teal-50 px-3 py-1 text-xs font-bold text-teal-700">
                          Current Status
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
