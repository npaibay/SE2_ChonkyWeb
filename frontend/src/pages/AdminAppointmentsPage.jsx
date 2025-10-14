import { useEffect, useState } from "react";
import { apiFetch } from "../utils/api";

export default function AdminAppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const res = await apiFetch("/api/appointments/");
    const data = await res.json();
    setAppointments(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const act = async (id, action) => {
    await apiFetch(`/api/appointments/${id}/${action}/`, { method: "POST" });
    load();
  };

  return (
    <div>
      {loading ? (
        <p>Loading…</p>
      ) : appointments.length === 0 ? (
        <p>No appointments yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left border-b">
                <th className="py-2 pr-4">User</th>
                <th className="py-2 pr-4">Service</th>
                <th className="py-2 pr-4">When</th>
                <th className="py-2 pr-4">Status</th>
                <th className="py-2 pr-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((a) => (
                <tr key={a.id} className="border-b">
                  <td className="py-2 pr-4">{a.user || a.user_id || "User"}</td>
                  <td className="py-2 pr-4">{a.service_name}</td>
                  <td className="py-2 pr-4">{new Date(a.scheduled_at).toLocaleString()}</td>
                  <td className="py-2 pr-4 font-medium">{a.status}</td>
                  <td className="py-2 pr-4">
                    <div className="flex gap-2">
                      <button onClick={() => act(a.id, "confirm")} className="px-3 py-1 rounded bg-amber-500 text-white">Confirm</button>
                      <button onClick={() => act(a.id, "complete")} className="px-3 py-1 rounded bg-green-600 text-white">Complete</button>
                      <button onClick={() => act(a.id, "cancel")} className="px-3 py-1 rounded bg-gray-200">Cancel</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
