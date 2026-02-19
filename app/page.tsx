"use client";

import { useContext, useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/context/AuthContext";
import { TaskContext } from "@/context/TaskContext";

// ─── Icons ────────────────────────────────────────────────────────────────────
const CheckIcon = () => (
  <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

const SpinnerIcon = () => (
  <svg className="h-3 w-3 text-white animate-spin" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
  </svg>
);

// ─── Skeleton Card ────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 h-5 w-5 rounded-full bg-slate-200 shrink-0" />
        <div className="flex-1 space-y-2.5">
          <div className="h-4 w-2/3 rounded-lg bg-slate-200" />
          <div className="h-3 w-5/12 rounded-lg bg-slate-100" />
        </div>
        <div className="flex gap-2">
          <div className="h-8 w-8 rounded-xl bg-slate-100" />
          <div className="h-8 w-8 rounded-xl bg-slate-100" />
        </div>
      </div>
    </div>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({
  label,
  value,
  icon,
  gradient,
  textColor,
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  gradient: string;
  textColor: string;
}) {
  return (
    <div className="flex-1 min-w-[130px] rounded-2xl bg-white border border-slate-100 shadow-sm p-4 flex flex-col gap-3">
      <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} shadow-sm`}>
        <span className="text-white">{icon}</span>
      </div>
      <div>
        <p className={`text-2xl font-black leading-none ${textColor}`}>{value}</p>
        <p className="mt-1 text-xs text-slate-500 font-medium">{label}</p>
      </div>
    </div>
  );
}

// ─── Task Card ────────────────────────────────────────────────────────────────
function TaskCard({
  task,
  onToggle,
  onEdit,
  onDelete,
}: {
  task: any;
  onToggle: (id: number) => Promise<void>;
  onEdit: (task: any) => void;
  onDelete: (id: number) => Promise<void>;
}) {
  const [toggling, setToggling] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [optimisticDone, setOptimisticDone] = useState<boolean | null>(null);
  const isDone = optimisticDone !== null ? optimisticDone : task.iscompleted;

  const handleToggle = async () => {
    if (toggling) return;
    setToggling(true);
    setOptimisticDone(!isDone);
    try {
      await onToggle(task.id);
    } catch {
      setOptimisticDone(task.iscompleted);
    }
    setOptimisticDone(null);
    setToggling(false);
  };

  const handleDelete = async () => {
    setDeleting(true);
    await onDelete(task.id);
    setDeleting(false);
  };

  return (
    <div
      className={`group rounded-2xl border p-4 sm:p-5 shadow-sm transition-all duration-300 hover:shadow-md ${
        isDone
          ? "bg-slate-50/80 border-slate-100"
          : "bg-white border-slate-200 hover:border-violet-200"
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Toggle circle */}
        <button
          onClick={handleToggle}
          disabled={toggling}
          className={`mt-0.5 h-5 w-5 shrink-0 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
            toggling
              ? "border-violet-400 bg-violet-400"
              : isDone
              ? "border-emerald-500 bg-emerald-500"
              : "border-slate-300 hover:border-violet-500 hover:bg-violet-50"
          }`}
        >
          {toggling ? <SpinnerIcon /> : isDone ? <CheckIcon /> : null}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className={`text-sm font-semibold transition-all duration-200 ${
              isDone ? "line-through text-slate-400" : "text-slate-900"
            }`}>
              {task.title}
            </p>
            {isDone && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-bold text-emerald-600">
                ✓ Done
              </span>
            )}
          </div>

          {task.description && (
            <p className={`mt-0.5 text-xs line-clamp-2 ${isDone ? "text-slate-400" : "text-slate-500"}`}>
              {task.description}
            </p>
          )}

          <p className="mt-2 text-[10px] text-slate-400 font-medium">
            {new Date(task.createdAt).toLocaleDateString("en-US", {
              month: "short", day: "numeric", year: "numeric",
            })}
          </p>
        </div>

        {/* Actions: always visible on mobile, hover on sm+ */}
        <div className="flex gap-1.5 shrink-0 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-150">
          <button
            onClick={() => onEdit(task)}
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-violet-100 bg-violet-50 text-violet-500 hover:bg-violet-100 hover:text-violet-700 transition-colors cursor-pointer"
            title="Edit"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-rose-100 bg-rose-50 text-rose-400 hover:bg-rose-100 hover:text-rose-600 transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
            title="Delete"
          >
            {deleting ? (
              <svg className="h-3.5 w-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
            ) : (
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Modal ────────────────────────────────────────────────────────────────────
function TaskModal({
  open,
  onClose,
  onSubmit,
  editTask,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (title: string, description: string) => Promise<void>;
  editTask?: any;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setTitle(editTask?.title ?? "");
      setDescription(editTask?.description ?? "");
      setTimeout(() => titleRef.current?.focus(), 60);
    }
  }, [open, editTask]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setSubmitting(true);
    await onSubmit(title.trim(), description.trim());
    setSubmitting(false);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
        {/* Handle bar for mobile */}
        <div className="mb-5 flex flex-col items-center sm:hidden">
          <div className="h-1 w-10 rounded-full bg-slate-200 mb-4" />
        </div>

        <div className="mb-5 flex items-center gap-3">
          <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${editTask ? "from-violet-500 to-purple-600" : "from-indigo-500 to-violet-600"} shadow-sm`}>
            {editTask ? (
              <svg className="h-4.5 w-4.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            ) : (
              <svg className="h-4.5 w-4.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            )}
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">{editTask ? "Edit Task" : "New Task"}</h2>
            <p className="text-xs text-slate-500">{editTask ? "Update details below." : "Add a new task to your list."}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-700">
              Title <span className="text-rose-400">*</span>
            </label>
            <input
              ref={titleRef}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to be done?"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-violet-500 focus:bg-white focus:ring-2 focus:ring-violet-500/10"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-700">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Any extra details... (optional)"
              rows={3}
              className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-violet-500 focus:bg-white focus:ring-2 focus:ring-violet-500/10"
            />
          </div>

          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || !title.trim()}
              className="flex-1 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? "Saving..." : editTask ? "Save Changes" : "Add Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function Home() {
  const auth = useContext(AuthContext);
  const taskCtx = useContext(TaskContext);
  const router = useRouter();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<any>(null);
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "az">("newest");
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    if (!auth?.loadingCheck && !auth?.token) router.push("/auth/login");
  }, [auth?.token, auth?.loadingCheck]);

  useEffect(() => {
    if (auth?.token) taskCtx?.fetchTasks();
  }, [auth?.token]);

  if (!taskCtx) return null;

  const { tasks, loading, error, addTask, editTask, removeTask, toggleTaskStatus } = taskCtx;

  const handleModalSubmit = async (title: string, description: string) => {
    if (editingTask) await editTask(editingTask.id, title, description);
    else await addTask(title, description);
  };

  const openAdd = () => { setEditingTask(null); setModalOpen(true); };
  const openEdit = (task: any) => { setEditingTask(task); setModalOpen(true); };

  // ── Stats ──
  const totalCount = tasks.length;
  const completedCount = tasks.filter((t) => t.iscompleted).length;
  const activeCount = totalCount - completedCount;
  const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const today = new Date().toDateString();
  const todayCount = tasks.filter((t) => new Date(t.createdAt).toDateString() === today).length;
  const todayDone = tasks.filter((t) => t.iscompleted && new Date(t.createdAt).toDateString() === today).length;

  const completedDates = [...new Set(tasks.filter((t) => t.iscompleted).map((t) => new Date(t.createdAt).toDateString()))];
  const activeDays = completedDates.length;

  // completion rate this week (tasks created in last 7 days)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const weekTasks = tasks.filter((t) => new Date(t.createdAt) >= sevenDaysAgo);
  const weekDone = weekTasks.filter((t) => t.iscompleted).length;
  const weekRate = weekTasks.length > 0 ? Math.round((weekDone / weekTasks.length) * 100) : 0;

  // ── Filtered + sorted ──
  const filteredTasks = tasks
    .filter((t) => {
      if (filter === "active") return !t.iscompleted;
      if (filter === "completed") return t.iscompleted;
      return true;
    })
    .filter((t) => (search ? t.title.toLowerCase().includes(search.toLowerCase()) : true))
    .sort((a, b) => {
      if (sortBy === "oldest") return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      if (sortBy === "az") return a.title.localeCompare(b.title);
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50/20">

      {/* ── Header ── */}
      <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 sm:px-8 py-3.5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 shadow-sm shadow-violet-200">
              <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <span className="text-sm font-bold text-slate-900 tracking-tight">TaskFlow</span>
          </div>

          <div className="flex items-center gap-3">
            {totalCount > 0 && (
              <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-violet-50 border border-violet-100 px-3 py-1 text-xs font-semibold text-violet-600">
                <span className="h-1.5 w-1.5 rounded-full bg-violet-500 animate-pulse" />
                {activeCount} active
              </span>
            )}
            <button
              disabled={loggingOut}
              onClick={async () => {
                setLoggingOut(true);
                await auth?.logout();
                router.push("/auth/login");
              }}
              className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-rose-50 hover:border-rose-200 hover:text-rose-600 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loggingOut ? (
                <>
                  <svg className="h-3.5 w-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Logging out...
                </>
              ) : (
                <>
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 sm:px-8 py-6 sm:py-10">

        {/* ── Page title ── */}
        <div className="mb-7 flex items-end justify-between">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">My Tasks</h1>
            <p className="mt-1 text-sm text-slate-500">
              {totalCount === 0
                ? "Nothing here yet — add your first task!"
                : `${activeCount} remaining · ${completedCount} completed`}
            </p>
          </div>
          <button
            onClick={openAdd}
            className="hidden sm:flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-violet-200 transition hover:opacity-90"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add Task
          </button>
        </div>

        {/* ── Stats row ── */}
        {totalCount > 0 && (
          <div className="mb-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <StatCard
              label="Total Tasks"
              value={totalCount}
              gradient="from-indigo-500 to-violet-500"
              textColor="text-indigo-600"
              icon={<svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2" /></svg>}
            />
            <StatCard
              label="Completed"
              value={completedCount}
              gradient="from-emerald-500 to-teal-500"
              textColor="text-emerald-600"
              icon={<svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
            />
            <StatCard
              label="This Week"
              value={`${weekRate}%`}
              gradient="from-amber-500 to-orange-500"
              textColor="text-amber-600"
              icon={<svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>}
            />
            <StatCard
              label="Active Days"
              value={activeDays}
              gradient="from-rose-500 to-pink-500"
              textColor="text-rose-600"
              icon={<svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" /></svg>}
            />
          </div>
        )}

        {/* ── Progress bar ── */}
        {totalCount > 0 && (
          <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm font-bold text-slate-900">Overall Progress</p>
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <p className="text-xs text-slate-500">{completedCount} of {totalCount} tasks done</p>
                  {activeDays > 0 && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200 px-2 py-0.5 text-[10px] font-bold text-amber-600">
                      🔥 {activeDays} day{activeDays !== 1 ? "s" : ""} streak
                    </span>
                  )}
                  {todayCount > 0 && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-violet-50 border border-violet-200 px-2 py-0.5 text-[10px] font-bold text-violet-600">
                      📅 {todayDone}/{todayCount} today
                    </span>
                  )}
                </div>
              </div>
              <span className={`text-3xl font-black tabular-nums ${
                progress === 100 ? "text-emerald-500" : progress >= 70 ? "text-violet-600" : "text-slate-900"
              }`}>
                {progress}%
              </span>
            </div>

            {/* Segmented progress */}
            <div className="h-3 w-full rounded-full bg-slate-100 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ease-out ${
                  progress === 100
                    ? "bg-gradient-to-r from-emerald-400 to-teal-500"
                    : progress >= 70
                    ? "bg-gradient-to-r from-violet-500 to-indigo-500"
                    : progress >= 40
                    ? "bg-gradient-to-r from-indigo-400 to-violet-500"
                    : "bg-gradient-to-r from-slate-400 to-indigo-400"
                }`}
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Mini milestone labels */}
            <div className="mt-1.5 flex justify-between text-[10px] text-slate-400 font-medium px-0.5">
              <span>Start</span>
              <span>50%</span>
              <span>Done!</span>
            </div>

            {progress === 100 && (
              <div className="mt-3 rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-2.5 text-center">
                <p className="text-sm font-bold text-emerald-600">🎉 All done! Amazing work today!</p>
              </div>
            )}
          </div>
        )}

        {/* ── Controls ── */}
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
          {/* Search */}
          <div className="relative flex-1">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tasks..."
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-9 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Sort */}
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
              <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full appearance-none rounded-xl border border-slate-200 bg-white pl-3.5 pr-9 py-2.5 text-sm text-slate-700 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10 cursor-pointer"
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="az">A → Z</option>
            </select>
          </div>

          {/* Add — desktop only (FAB handles mobile) */}
          <button
            onClick={openAdd}
            className="sm:hidden flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add Task
          </button>
        </div>

        {/* ── Filter tabs ── */}
        <div className="mb-5 flex gap-1 rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
          {(["all", "active", "completed"] as const).map((f) => {
            const count = f === "all" ? totalCount : f === "active" ? activeCount : completedCount;
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold capitalize transition-all duration-200 ${
                  filter === f
                    ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-sm"
                    : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                }`}
              >
                {f}
                <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold tabular-nums ${
                  filter === f ? "bg-white/25 text-white" : "bg-slate-100 text-slate-500"
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* ── Error ── */}
        {error && (
          <div className="mb-4 flex items-center gap-2.5 rounded-xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-600">
            <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}

        {/* ── Task list ── */}
        <div className="space-y-2.5">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
          ) : filteredTasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white py-16 text-center">
              <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200">
                {search ? (
                  <svg className="h-6 w-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                ) : (
                  <svg className="h-6 w-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                )}
              </div>
              <p className="text-sm font-bold text-slate-700">
                {search ? "No tasks match your search" : filter !== "all" ? `No ${filter} tasks` : "No tasks yet"}
              </p>
              <p className="mt-1 text-xs text-slate-400">
                {!search && filter === "all" && "Add your first task to get started."}
              </p>
              {!search && filter === "all" && (
                <button
                  onClick={openAdd}
                  className="mt-4 flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-90 transition"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                  Add first task
                </button>
              )}
            </div>
          ) : (
            filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onToggle={toggleTaskStatus}
                onEdit={openEdit}
                onDelete={removeTask}
              />
            ))
          )}
        </div>

        {/* Footer count */}
        {filteredTasks.length > 0 && (
          <p className="mt-5 text-center text-xs text-slate-400">
            Showing {filteredTasks.length} of {totalCount} task{totalCount !== 1 ? "s" : ""}
          </p>
        )}
      </main>

      {/* ── FAB (mobile) ── */}
      <button
        onClick={openAdd}
        className="fixed bottom-6 right-6 sm:hidden flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 shadow-lg shadow-violet-400/40 text-white transition active:scale-95 z-30"
      >
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
      </button>

      {/* ── Modal ── */}
      <TaskModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleModalSubmit}
        editTask={editingTask}
      />
    </div>
  );
}