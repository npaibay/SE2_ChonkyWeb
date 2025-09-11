import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Logs() {
  const [logs, setLogs] = useState([]);
  const [msg, setMsg] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortOrder, setSortOrder] = useState("desc"); // newest first by default
  const [actionFilter, setActionFilter] = useState("ALL");
  const navigate = useNavigate();
  const { access, logout } = useAuth();

  useEffect(() => {
    if (!access) {
      setMsg("Unauthorized – please log in again.");
      return;
    }

    fetch("http://127.0.0.1:8000/api/logs/", {
      headers: {
        Authorization: `Bearer ${access}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.status === 401) {
          logout("Access token expired. Please log in again.");
          throw new Error("Unauthorized");
        }
        if (!res.ok) throw new Error("Failed to load logs");
        return res.json();
      })
      .then(setLogs)
      .catch(() => setMsg("Could not load logs"));
  }, [access, logout]);

  // ✅ derive filtered + sorted logs
  const filteredLogs = useMemo(() => {
    let result = [...logs];

    // filter by action
    if (actionFilter !== "ALL") {
      result = result.filter((log) => log.action === actionFilter);
    }

    // sort by time
    result.sort((a, b) =>
      sortOrder === "desc"
        ? new Date(b.timestamp) - new Date(a.timestamp)
        : new Date(a.timestamp) - new Date(b.timestamp)
    );

    return result;
  }, [logs, sortOrder, actionFilter]);

  // ✅ Pagination
  const totalPages = Math.ceil(filteredLogs.length / pageSize);
  const start = (page - 1) * pageSize;
  const currentLogs = filteredLogs.slice(start, start + pageSize);

  // ✅ Collect unique actions for dropdown
  const actionOptions = ["ALL", ...new Set(logs.map((log) => log.action))];

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      {/* Page Header */}
      <h1 className="text-2xl font-bold mb-6 text-white flex items-center gap-2">
        📜 Security Logs
      </h1>

      {/* Error Message */}
      {msg && <p className="mb-4 text-red-400 font-medium text-sm">{msg}</p>}

      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between mb-4 gap-3">
        {/* Page size */}
        <div className="flex items-center gap-2">
          <label htmlFor="pageSize" className="text-gray-300 text-sm">
            Show:
          </label>
          <select
            id="pageSize"
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(1);
            }}
            className="bg-gray-700 text-white border border-gray-600 rounded px-2 py-1 text-sm"
          >
            <option value={10}>10 logs</option>
            <option value={30}>30 logs</option>
            <option value={50}>50 logs</option>
          </select>
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2">
          <label htmlFor="sort" className="text-gray-300 text-sm">
            Sort:
          </label>
          <select
            id="sort"
            value={sortOrder}
            onChange={(e) => {
              setSortOrder(e.target.value);
              setPage(1);
            }}
            className="bg-gray-700 text-white border border-gray-600 rounded px-2 py-1 text-sm"
          >
            <option value="desc">Newest first</option>
            <option value="asc">Oldest first</option>
          </select>
        </div>

        {/* Action Filter */}
        <div className="flex items-center gap-2">
          <label htmlFor="action" className="text-gray-300 text-sm">
            Action:
          </label>
          <select
            id="action"
            value={actionFilter}
            onChange={(e) => {
              setActionFilter(e.target.value);
              setPage(1);
            }}
            className="bg-gray-700 text-white border border-gray-600 rounded px-2 py-1 text-sm"
          >
            {actionOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt === "ALL" ? "All actions" : opt}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Logs Table */}
      <div className="overflow-x-auto rounded-lg shadow-md mb-6">
        <table className="min-w-full bg-gray-800 text-white text-sm border border-gray-700">
          <thead className="bg-gray-700 text-left text-sm uppercase tracking-wider">
            <tr>
              <th className="px-4 py-3 border-b border-gray-600">User</th>
              <th className="px-4 py-3 border-b border-gray-600">Action</th>
              <th className="px-4 py-3 border-b border-gray-600">Time</th>
              <th className="px-4 py-3 border-b border-gray-600">IP</th>
            </tr>
          </thead>
          <tbody>
            {currentLogs.length === 0 ? (
              <tr>
                <td
                  colSpan="4"
                  className="text-center px-4 py-6 text-gray-400"
                >
                  No logs available
                </td>
              </tr>
            ) : (
              currentLogs.map((log, idx) => (
                <tr
                  key={idx}
                  className={idx % 2 === 0 ? "bg-gray-900" : "bg-gray-800"}
                >
                  <td className="px-4 py-2 border-t border-gray-700">
                    {log.user}
                  </td>
                  <td className="px-4 py-2 border-t border-gray-700">
                    {log.action}
                  </td>
                  <td className="px-4 py-2 border-t border-gray-700">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="px-4 py-2 border-t border-gray-700">
                    {log.ip}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {filteredLogs.length > 0 && (
        <div className="flex justify-between items-center text-sm text-gray-300">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className={`px-3 py-1 btn-rounded-3xl ${
              page === 1
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            ⬅ Prev
          </button>

          <span>
            Page {page} of {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className={`px-3 py-1 btn-rounded-3xl ${
              page === totalPages
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            Next ➡
          </button>
        </div>
      )}

      {/* Back Button */}
      <div className="mt-6">
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-blue-400 hover:underline"
        >
          ⬅ Back
        </button>
      </div>
    </div>
  );
}

export default Logs;
