import { useEffect, useMemo, useState } from "react";
import { apiGet } from "../utils/api";

const ACTION_COLORS = {
  LOGIN: "bg-emerald-900/50 text-emerald-200 ring-1 ring-emerald-700/40",
  LOGOUT: "bg-sky-900/50 text-sky-200 ring-1 ring-sky-700/40",
  FAILED_LOGIN: "bg-rose-900/50 text-rose-200 ring-1 ring-rose-700/40",
  PASSWORD_CHANGE: "bg-amber-900/50 text-amber-200 ring-1 ring-amber-700/40",
  CREATE_USER: "bg-indigo-900/50 text-indigo-200 ring-1 ring-indigo-700/40",
  DEACTIVATE_USER: "bg-fuchsia-900/50 text-fuchsia-200 ring-1 ring-fuchsia-700/40",
};

const ACTIONS = [
  "All actions",
  "LOGIN",
  "LOGOUT",
  "FAILED_LOGIN",
  "PASSWORD_CHANGE",
  "CREATE_USER",
  "DEACTIVATE_USER",
];

function Badge({ action }) {
  const cls = ACTION_COLORS[action] ?? "bg-gray-800/60 text-gray-200 ring-1 ring-gray-700/50";
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${cls}`}>
      {action}
    </span>
  );
}

function SkeletonRow() {
  return (
    <tr className="animate-pulse">
      <td className="px-4 py-3"><div className="h-3 w-24 rounded bg-gray-700" /></td>
      <td className="px-4 py-3"><div className="h-5 w-28 rounded bg-gray-700" /></td>
      <td className="px-4 py-3"><div className="h-3 w-40 rounded bg-gray-700" /></td>
      <td className="px-4 py-3"><div className="h-3 w-24 rounded bg-gray-700" /></td>
    </tr>
  );
}

export default function Logs() {
  const [raw, setRaw] = useState(null);
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(true);

  const [limit, setLimit] = useState(10);
  const [sortDir, setSortDir] = useState("new"); // "new" | "old"
  const [action, setAction] = useState("All actions");

  async function load() {
    setBusy(true);
    setError(null);
    try {
      const res = await apiGet("/api/users/logs/");
      if (!res.ok) {
        if (res.status === 401) throw new Error("Unauthorized — please sign in again.");
        if (res.status === 403) throw new Error("Forbidden — admin only.");
        const txt = await res.text();
        throw new Error(txt || `HTTP ${res.status}`);
      }
      const data = await res.json();
      setRaw(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e.message || "Could not load logs");
      setRaw([]);
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const rows = useMemo(() => {
    if (!raw) return [];
    let out = [...raw];
    if (action !== "All actions") out = out.filter((r) => r.action === action);
    out.sort((a, b) => {
      const ta = Date.parse(a.timestamp);
      const tb = Date.parse(b.timestamp);
      return sortDir === "new" ? tb - ta : ta - tb;
    });
    return out.slice(0, limit);
  }, [raw, action, sortDir, limit]);

  return (
    <div className="space-y-4">
      {/* Dark content wrapper */}
      <div className="rounded-2xl bg-[#1b1b1f] border border-white/10 p-5 shadow-xl">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🧾</span>
            <div>
              <h2 className="text-xl font-semibold text-white">System Logs</h2>
              <p className="text-sm text-white/60">
                Audit events for sign-ins, password changes, and admin actions.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={load}
              className="px-3 py-2 rounded-lg bg-white/10 text-white hover:bg-white/15 active:scale-95 transition"
              title="Reload latest logs"
            >
              Refresh
            </button>
          </div>
        </div>

        {/* Controls */}
        <div className="mt-4 flex flex-wrap gap-3 items-center">
          <label className="text-sm text-white/80">
            Show:&nbsp;
            <select
              className="rounded-md border border-white/10 bg-[#111317] text-white px-2 py-1 text-sm"
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
            >
              {[10, 25, 50].map((n) => (
                <option key={n} value={n}>
                  {n} logs
                </option>
              ))}
            </select>
          </label>

          <label className="text-sm text-white/80">
            Sort:&nbsp;
            <select
              className="rounded-md border border-white/10 bg-[#111317] text-white px-2 py-1 text-sm"
              value={sortDir}
              onChange={(e) => setSortDir(e.target.value)}
            >
              <option value="new">Newest first</option>
              <option value="old">Oldest first</option>
            </select>
          </label>

          <label className="text-sm text-white/80 ml-auto">
            Action:&nbsp;
            <select
              className="rounded-md border border-white/10 bg-[#111317] text-white px-2 py-1 text-sm"
              value={action}
              onChange={(e) => setAction(e.target.value)}
            >
              {ACTIONS.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </label>
        </div>

        {/* Table */}
        <div className="mt-4 overflow-x-auto rounded-xl border border-white/10">
          <table className="min-w-full text-sm">
            <thead className="bg-[#121318] text-white/80">
              <tr className="text-left">
                <th className="px-4 py-3 font-semibold">User</th>
                <th className="px-4 py-3 font-semibold">Action</th>
                <th className="px-4 py-3 font-semibold">Time</th>
                <th className="px-4 py-3 font-semibold">IP</th>
              </tr>
            </thead>
            <tbody className="bg-[#0d0f14] text-white/90 divide-y divide-white/5">
              {busy && (
                <>
                  <SkeletonRow />
                  <SkeletonRow />
                  <SkeletonRow />
                </>
              )}

              {!busy && error && (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-rose-300">
                    {error}
                  </td>
                </tr>
              )}

              {!busy && !error && rows.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-white/60">
                    No logs available
                  </td>
                </tr>
              )}

              {!busy &&
                !error &&
                rows.map((r, idx) => (
                  <tr key={`${r.timestamp}-${idx}`} className="hover:bg-white/5">
                    <td className="px-4 py-3 font-medium">{r.user || "Unknown"}</td>
                    <td className="px-4 py-3">
                      <Badge action={r.action} />
                    </td>
                    <td className="px-4 py-3">
                      {new Date(r.timestamp).toLocaleString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="px-4 py-3">{r.ip || "—"}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      <button
        onClick={() => window.history.back()}
        className="text-sm text-white/70 hover:text-white hover:underline"
      >
        ← Back
      </button>
    </div>
  );
}