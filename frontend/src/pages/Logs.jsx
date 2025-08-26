import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Logs() {
  const [logs, setLogs] = useState([]);
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/logs/", { credentials: "include" })
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then(setLogs)
      .catch(() => setMsg("Could not load logs"));
  }, []);

  return (
    <div className="w-full max-w-5xl mx-auto p-6">
      {/* Page Header */}
      <h1 className="text-2xl font-bold mb-6 text-white flex items-center gap-2">
        📜 Logs
      </h1>

      {/* Error Message */}
      {msg && (
        <p className="mb-4 text-red-400 font-medium text-sm">{msg}</p>
      )}

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
            {logs.length === 0 ? (
              <tr>
                <td
                  colSpan="4"
                  className="text-center px-4 py-6 text-gray-400"
                >
                  No logs available
                </td>
              </tr>
            ) : (
              logs.map((log, idx) => (
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
                    {log.timestamp}
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

      {/* Back Button */}
      <div>
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
