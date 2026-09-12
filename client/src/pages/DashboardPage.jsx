import {
  Bell,
  BookOpenCheck,
  Building2,
  ChevronRight,
  CircleHelp,
  FilePlus2,
  FolderKanban,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  Sparkles,
  UsersRound,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../components/Logo";
import { useAuth } from "../context/AuthContext";

const dashboardConfig = {
  citizen: {
    title: "Your civic impact starts here.",
    eyebrow: "Citizen workspace",
    action: "Submit a problem",
    metrics: [
      ["0", "Problems submitted"],
      ["0", "Being reviewed"],
      ["0", "Solutions delivered"],
    ],
    updates: [
      "Add your first problem with a location and supporting photos.",
      "Track every review and assignment in one place.",
    ],
  },
  student: {
    title: "Turn real needs into useful solutions.",
    eyebrow: "University workspace",
    action: "Explore assigned problems",
    metrics: [
      ["0", "Assigned problems"],
      ["0", "Active projects"],
      ["0", "Team members"],
    ],
    updates: [
      "Your university will see verified, domain-matched problems here.",
      "Create a multidisciplinary team once a problem is accepted.",
    ],
  },
  faculty: {
    title: "Guide projects that matter outside campus.",
    eyebrow: "Faculty workspace",
    action: "Review assignments",
    metrics: [
      ["0", "Teams mentored"],
      ["0", "Proposals to review"],
      ["0", "Active milestones"],
    ],
    updates: [
      "Review solution proposals and help teams set practical milestones.",
      "Your evaluation workspace will appear as teams invite you.",
    ],
  },
  industry: {
    title: "Bring expertise to high-impact projects.",
    eyebrow: "Industry workspace",
    action: "Explore projects",
    metrics: [
      ["0", "Collaboration requests"],
      ["0", "Projects supported"],
      ["0", "Mentorship hours"],
    ],
    updates: [
      "Discover university projects seeking expertise, resources, or funding.",
      "Partner requests will appear here after project matching.",
    ],
  },
  admin: {
    title: "A clear view of every problem and outcome.",
    eyebrow: "Administration workspace",
    action: "Review problems",
    metrics: [
      ["0", "Problems pending"],
      ["0", "Universities onboarded"],
      ["0", "Projects in progress"],
    ],
    updates: [
      "Review incoming problems and verify their completeness.",
      "AI analysis, routing, and assignment controls will live here.",
    ],
  },
};

const sidebar = [
  { icon: LayoutDashboard, label: "Overview" },
  { icon: FolderKanban, label: "My workspace" },
  { icon: BookOpenCheck, label: "Activity" },
  { icon: UsersRound, label: "Collaborators" },
];

export default function DashboardPage() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const [problemCount, setProblemCount] = useState(0);
  const [totalProblems, setTotalProblems] = useState(0);
  const [pendingProblems, setPendingProblems] = useState(0);
  const [projectsInProgress, setProjectsInProgress] = useState(0);

  useEffect(() => {
    if (!user) return;

    const loadDashboardData = async () => {
      try {
        const token = localStorage.getItem("samadhan_token");

        if (user.role === "citizen") {
          const response = await fetch(
            "http://localhost:5000/api/problems/mine",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );

          if (!response.ok) return;

          const data = await response.json();
          setProblemCount(data.problems?.length || 0);
        }

        if (user.role === "admin") {
          const response = await fetch(
            "http://localhost:5000/api/problems/admin/stats",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );

          if (!response.ok) return;

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.message || "Failed to load admin statistics.");
          }

          setTotalProblems(data.totalProblems || 0);
          setPendingProblems(data.pendingProblems || 0);
          setProjectsInProgress(data.projectsInProgress || 0);
        }
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      }
    };

    loadDashboardData();
  }, [user]);

  const config = dashboardConfig[user.role] || dashboardConfig.citizen;

  const initials = user.name
    .split(" ")
    .map((name) => name[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  if (user.role === "citizen") {
    config.metrics[0][0] = String(problemCount);
  }
  if (user.role === "admin") {
    config.metrics[0][0] = String(totalProblems);
    config.metrics[0][1] = "Total Problems";

    config.metrics[1][0] = String(pendingProblems);
    config.metrics[1][1] = "Problems pending";

    config.metrics[2][0] = String(projectsInProgress);
    config.metrics[2][1] = "Projects in progress";
  }
  const logout = () => {
    signOut();
    navigate("/");
  };
  return (
    <div className="min-h-screen bg-[#f7faf9]">
      <aside
        className={`fixed inset-y-0 left-0 z-30 flex w-72 flex-col border-r border-slate-100 bg-white p-5 transition-transform lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex items-center justify-between">
          <Logo />
          <button className="lg:hidden" onClick={() => setOpen(false)}>
            <X />
          </button>
        </div>
        <nav className="mt-10 space-y-1">
          {sidebar.map(({ icon: Icon, label }, index) => (
            <button
              key={label}
              onClick={() => {
                if (label === "My workspace") {
                  navigate("/workspace");
                }
              }}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold ${
                index === 0
                  ? "bg-mist text-lagoon"
                  : "text-slate-500 hover:bg-slate-50"
              }`}
            >
              <Icon size={18} />
              {label}
            </button>
          ))}
        </nav>
        <div className="mt-auto space-y-1 border-t border-slate-100 pt-5">
          <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-slate-500 hover:bg-slate-50">
            <Settings size={18} />
            Settings
          </button>
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-rose-500 hover:bg-rose-50"
          >
            <LogOut size={18} />
            Log out
          </button>
        </div>
      </aside>
      {open && (
        <button
          aria-label="Close sidebar"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-20 bg-slate-900/20 lg:hidden"
        />
      )}
      <main className="lg:pl-72">
        <header className="flex h-[76px] items-center justify-between border-b border-slate-100 bg-white px-5 sm:px-8">
          <button
            aria-label="Open sidebar"
            className="text-slate-600 lg:hidden"
            onClick={() => setOpen(true)}
          >
            <Menu />
          </button>
          <div className="hidden items-center gap-2 text-sm font-semibold text-slate-400 lg:flex">
            <Building2 size={17} />{" "}
            {user.organization || "Independent contributor"}
          </div>
          <div className="flex items-center gap-4">
            <button
              aria-label="Notifications"
              className="relative rounded-xl p-2.5 text-slate-500 hover:bg-mist"
            >
              <Bell size={19} />
              <span className="absolute right-2 top-2 size-2 rounded-full bg-sun" />
            </button>
            <div className="flex items-center gap-2">
              <span className="grid size-9 place-items-center rounded-full bg-lagoon text-xs font-bold text-white">
                {initials}
              </span>
              <div className="hidden sm:block">
                <p className="text-sm font-bold leading-4">{user.name}</p>
                <p className="text-xs capitalize text-slate-500">{user.role}</p>
              </div>
            </div>
          </div>
        </header>
        <div className="mx-auto max-w-6xl px-5 py-9 sm:px-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-extrabold uppercase tracking-[.16em] text-lagoon">
                {config.eyebrow}
              </p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                Hello, {user.name.split(" ")[0]}.
              </h1>
              <p className="mt-2 text-slate-600">{config.title}</p>
            </div>
            <button
              onClick={() => {
                if (user.role === "admin") {
                  navigate("/admin/problems");
                } else {
                  navigate("/submit-problem");
                }
              }}
              className="btn-primary"
            >
              <FilePlus2 size={18} /> {config.action}
            </button>
          </div>
          <section className="mt-9 grid gap-4 sm:grid-cols-3">
            {config.metrics.map(([value, label]) => (
              <button
                onClick={() => {
                  if (label === "Problems submitted") {
                    navigate("/workspace");
                  }
                }}
                className="w-full rounded-2xl border border-slate-100 bg-white p-5 text-left shadow-sm transition hover:border-teal-200 hover:bg-mist"
                key={label}
              >
                <p className="text-3xl font-bold text-ink">{value}</p>

                <p className="mt-1 text-sm font-semibold text-slate-500">
                  {label}
                </p>
              </button>
            ))}
          </section>
          <section className="mt-8 grid gap-6 lg:grid-cols-[1.35fr_.65fr]">
            <article className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold">Getting started</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Your Phase 1 workspace is ready.
                  </p>
                </div>
                <span className="grid size-10 place-items-center rounded-xl bg-mist text-lagoon">
                  <Sparkles size={20} />
                </span>
              </div>
              <div className="mt-6 space-y-3">
                {config.updates.map((update, index) => (
                  <button
                    key={update}
                    onClick={() => {
                      if (index === 0) {
                        navigate("/admin/problems");
                      }

                      if (index === 1) {
                        navigate("/admin/ai-analysis");
                      }
                    }}
                    className="flex w-full items-center gap-4 rounded-2xl border border-slate-100 bg-white p-5 text-left transition hover:bg-slate-50"
                  >
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-teal-700 text-sm font-semibold text-white">
                      {index + 1}
                    </span>

                    <span className="flex-1 text-base font-medium text-slate-800">
                      {update}
                    </span>

                    <span className="text-2xl text-slate-400">›</span>
                  </button>
                ))}
              </div>
            </article>
            <article className="rounded-2xl bg-ink p-6 text-white">
              <CircleHelp className="text-teal-300" size={24} />
              <h2 className="mt-5 text-xl font-bold">What comes next?</h2>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                Problem submission, verification, and routing workflows will
                connect your role to the full solution lifecycle.
              </p>
              <button className="mt-6 text-sm font-bold text-teal-300 hover:text-white">
                View platform roadmap →
              </button>
            </article>
          </section>
        </div>
      </main>
    </div>
  );
}
