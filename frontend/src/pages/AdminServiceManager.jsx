import { useState, useEffect } from "react";
import HomeNavbar from "../components/HomeNavbar";

// Update this line to match your backend!
const API_URL = "http://127.0.0.1:8000/api/services";

function AdminServiceManager() {
  const [services, setServices] = useState([]);
  const [form, setForm] = useState({ name: "", price: "" });
  const [editingId, setEditingId] = useState(null);

  // Fetch services from backend
  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then(setServices)
      .catch(() => setServices([]));
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Create or update service
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.price) return;

    if (editingId) {
      // Update
      const res = await fetch(`${API_URL}/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, price: Number(form.price) }),
      });
      const updated = await res.json();
      setServices((prev) =>
        prev.map((s) => (s._id === editingId ? updated : s))
      );
      setEditingId(null);
    } else {
      // Create
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, price: Number(form.price) }),
      });
      const created = await res.json();
      setServices((prev) => [...prev, created]);
    }
    setForm({ name: "", price: "" });
  };

  // Edit service
  const handleEdit = (service) => {
    setForm({ name: service.name, price: service.price });
    setEditingId(service.id);
  };

  // Delete service
  const handleDelete = async (id) => {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    setServices((prev) => prev.filter((s) => s._id !== id));
    if (editingId === id) {
      setEditingId(null);
      setForm({ name: "", price: "" });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-chonky-brown-50">
      <HomeNavbar hideLoginButton />
      <main className="flex-1 flex flex-col items-center justify-start p-8">
        <div className="w-full max-w-2xl bg-gray-800/50 rounded-xl shadow-md p-8">
          <h2 className="text-2xl font-bold mb-6 text-default-text text-center">
            Manage Salon Services
          </h2>
          {/* Service Form */}
          <form onSubmit={handleSubmit} className="mb-8 space-y-4">
            <div>
              <label className="block text-default-text mb-1" htmlFor="name">
                Service Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded bg-gray-700/60 text-default-text border-none focus:ring-2 focus:ring-yellow"
                required
              />
            </div>
            <div>
              <label className="block text-default-text mb-1" htmlFor="price">
                Price (PHP)
              </label>
              <input
                id="price"
                name="price"
                type="number"
                min="1"
                value={form.price}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded bg-gray-700/60 text-default-text border-none focus:ring-2 focus:ring-yellow"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-yellow hover:bg-yellow/90 text-default-text px-6 py-2 btn-rounded-3xl font-bold transition-colors"
            >
              {editingId ? "Update Service" : "Add Service"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setForm({ name: "", price: "" });
                }}
                className="w-full mt-2 bg-poop hover:bg-poop-hover text-default-text px-6 py-2 btn-rounded-3xl font-bold transition-colors"
              >
                Cancel Edit
              </button>
            )}
          </form>
          {/* Service List */}
          <div>
            <h3 className="text-lg font-bold text-default-text mb-3">
              Current Services
            </h3>
            <ul className="space-y-3">
              {services.map((service) => (
                <li
                  key={service._id}
                  className="flex items-center justify-between bg-gray-700/60 rounded-lg px-4 py-3"
                >
                  <div>
                    <span className="font-semibold text-default-text">
                      {service.name}
                    </span>
                    <span className="ml-4 text-yellow font-bold">
                      PHP {service.price}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(service)}
                      className="bg-peach hover:bg-peach/90 text-default-text px-3 py-1 btn-rounded font-medium transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(service._id)}
                      className="bg-poop hover:bg-poop-hover text-default-text px-3 py-1 btn-rounded font-medium transition"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
              {services.length === 0 && (
                <li className="text-whitish text-center py-4">
                  No services yet.
                </li>
              )}
            </ul>
          </div>
          {/* Back to Dashboard Button */}
          <div className="mt-8 flex justify-center">
            <a
              href="/dashboard"
              className="bg-yellow hover:bg-yellow/90 text-default-text px-6 py-2 btn-rounded-3xl font-bold transition-colors"
            >
              ← Back to Dashboard
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}

export default AdminServiceManager;