import { useEffect, useState } from "react";
import { apiFetch } from "../utils/api";

export default function AdminFeedbackPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const res = await apiFetch("/api/feedback/");
    const data = await res.json();
    setItems(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const togglePublic = async (fb) => {
    const res = await apiFetch(`/api/feedback/${fb.id}/`, {
      method: "PATCH",
      body: JSON.stringify({ is_public: !fb.is_public }),
    });
    if (res.ok) load();
  };

  const remove = async (fb) => {
    if (!confirm("Delete this feedback?")) return;
    const res = await apiFetch(`/api/feedback/${fb.id}/`, { method: "DELETE" });
    if (res.ok) load();
  };

  return (
    <div>
      {loading ? (
        <p>Loading…</p>
      ) : items.length === 0 ? (
        <p>No feedback yet.</p>
      ) : (
        <div className="space-y-3">
          {items.map((f) => (
            <div key={f.id} className="border rounded-lg p-3">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium">
                    Rating: {f.rating} / 5 {f.is_public ? "· Public" : "· Private"}
                  </p>
                  <p className="text-gray-700">{f.comment || <i>(no comment)</i>}</p>
                  {f.appointment_info && (
                    <p className="text-sm text-gray-500 mt-1">
                      Appointment: {f.appointment_info.service_name} ·{" "}
                      {new Date(f.appointment_info.scheduled_at).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => togglePublic(f)} className="px-3 py-1 rounded bg-blue-600 text-white">
                    {f.is_public ? "Make Private" : "Make Public"}
                  </button>
                  <button onClick={() => remove(f)} className="px-3 py-1 rounded bg-red-600 text-white">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
