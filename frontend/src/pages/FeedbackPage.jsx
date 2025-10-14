import { useEffect, useState } from "react";
import PageNavbar from "../components/PageNavbar";
import { apiFetch } from "../utils/api";

export default function FeedbackPage() {
  const [appointments, setAppointments] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [form, setForm] = useState({
    appointment: "",
    rating: 5,
    comment: "",
    is_public: true,
  });

  const load = async () => {
    const myAppts = await (await apiFetch("/api/appointments/")).json();
    const fb = await (await apiFetch("/api/feedback/")).json();
    setAppointments(myAppts.filter((a) => a.status === "COMPLETED"));
    setFeedback(fb);
  };

  useEffect(() => {
    load();
  }, []);

  const submitFeedback = async (e) => {
    e.preventDefault();
    const res = await apiFetch("/api/feedback/", {
      method: "POST",
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setForm({ appointment: "", rating: 5, comment: "", is_public: true });
      load();
    } else {
      const data = await res.json();
      alert(data.detail || "Failed to submit feedback.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <PageNavbar
        currentPage="Feedback"
        breadcrumbs={["Chonky Boi", "Bookings", "Feedback"]}
        showButtons={true}
      />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <section className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Submit Feedback</h2>
          <form onSubmit={submitFeedback} className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <select
              value={form.appointment}
              onChange={(e) => setForm({ ...form, appointment: e.target.value })}
              required
              className="border rounded-xl p-2 sm:col-span-2"
            >
              <option value="">Select Completed Appointment</option>
              {appointments.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.service_name} - {new Date(a.scheduled_at).toLocaleDateString()}
                </option>
              ))}
            </select>
            <input
              type="number"
              min="1"
              max="5"
              value={form.rating}
              onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
              className="border rounded-xl p-2"
            />
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.is_public}
                onChange={(e) => setForm({ ...form, is_public: e.target.checked })}
              />
              <span>Public</span>
            </label>
            <textarea
              placeholder="Comments..."
              value={form.comment}
              onChange={(e) => setForm({ ...form, comment: e.target.value })}
              className="border rounded-xl p-2 sm:col-span-4"
            />
            <button className="bg-blue-600 text-white rounded-xl py-2 sm:col-span-4">
              Submit Feedback
            </button>
          </form>
        </section>

        <section className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Reviews</h2>
          {feedback.length ? (
            feedback.map((f) => (
              <div key={f.id} className="border-b py-3">
                <p className="font-medium">Rating: {f.rating} / 5</p>
                <p className="text-sm text-gray-600">{f.comment}</p>
              </div>
            ))
          ) : (
            <p>No feedback yet.</p>
          )}
        </section>
      </main>
    </div>
  );
}
