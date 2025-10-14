import { useEffect, useState } from "react";
import PageNavbar from "../components/PageNavbar";
import { apiFetch } from "../utils/api";

export default function AppointmentsPage() {
  const [services, setServices] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [form, setForm] = useState({ service: "", scheduled_at: "", notes: "" });

  const load = async () => {
    const [svcRes, apptRes] = await Promise.all([
      apiFetch("/api/services/"),
      apiFetch("/api/appointments/"),
    ]);
    setServices(await svcRes.json());
    setAppointments(await apptRes.json());
  };

  useEffect(() => {
    load();
  }, []);

  const submitBooking = async (e) => {
    e.preventDefault();
    const res = await apiFetch("/api/appointments/", {
      method: "POST",
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setForm({ service: "", scheduled_at: "", notes: "" });
      load();
    } else {
      const data = await res.json();
      alert(data.detail || "Failed to book.");
    }
  };

  const updateStatus = async (id, action) => {
    await apiFetch(`/api/appointments/${id}/${action}/`, { method: "POST" });
    load();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <PageNavbar
        currentPage="Appointments"
        breadcrumbs={["Chonky Boi", "Appointments"]}
        showButtons={true}
      />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <section className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Book an Appointment</h2>
          <form onSubmit={submitBooking} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <select
              value={form.service}
              onChange={(e) => setForm({ ...form, service: e.target.value })}
              required
              className="border rounded-xl p-2"
            >
              <option value="">Select Service</option>
              {services.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} - ₱{Number(s.price).toFixed(2)}
                </option>
              ))}
            </select>
            <input
              type="datetime-local"
              value={form.scheduled_at}
              onChange={(e) => setForm({ ...form, scheduled_at: e.target.value })}
              required
              className="border rounded-xl p-2"
            />
            <input
              type="text"
              placeholder="Notes (optional)"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="border rounded-xl p-2 sm:col-span-3"
            />
            <button className="bg-blue-600 text-white rounded-xl py-2 sm:col-span-3">
              Book
            </button>
          </form>
        </section>

        <section className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Manage Appointments</h2>
          {appointments.map((a) => (
            <div key={a.id} className="flex items-center justify-between border-b py-3">
              <div>
                <p className="font-medium">{a.service_name}</p>
                <p className="text-sm text-gray-600">
                  {new Date(a.scheduled_at).toLocaleString()}
                </p>
                <p className="text-sm">
                  Status: <span className="font-semibold">{a.status}</span>
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => updateStatus(a.id, "cancel")}
                  className="px-3 py-1 rounded-lg bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={() => updateStatus(a.id, "confirm")}
                  className="px-3 py-1 rounded-lg bg-amber-500 text-white"
                >
                  Confirm
                </button>
                <button
                  onClick={() => updateStatus(a.id, "complete")}
                  className="px-3 py-1 rounded-lg bg-green-600 text-white"
                >
                  Complete
                </button>
              </div>
            </div>
          ))}
          {!appointments.length && <p>No appointments yet.</p>}
        </section>
      </main>
    </div>
  );
}
