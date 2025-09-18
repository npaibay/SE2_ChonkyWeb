import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import HomeNavbar from "../components/HomeNavbar";
import { useNavigate } from "react-router-dom";

const API_BASE = "http://127.0.0.1:8000/api/pet-profiles/"; // note trailing slash

function AdminPetProfileManager({ asModal, onClose }) {
  const { access, logout } = useAuth();
  const navigate = useNavigate();

  const [profiles, setProfiles] = useState([]);
  const [form, setForm] = useState({ name: "", owner: "", breed: "" });
  const [editingId, setEditingId] = useState(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const authFetch = async (url, options = {}) => {
    if (!access) {
      logout("Please sign in again.");
      navigate("/login");
      return null;
    }
    const res = await fetch(url, {
      ...options,
      headers: {
        ...(options.headers || {}),
        Accept: "application/json",
        Authorization: `Bearer ${access}`,
      },
    });
    if (res.status === 401) {
      logout("Session expired. Please log in again.");
      navigate("/login");
      return null;
    }
    return res;
  };

  const loadProfiles = async () => {
    setErr("");
    try {
      const res = await authFetch(API_BASE);
      if (!res) return;
      const data = await res.json().catch(() => []);
      if (!res.ok) throw new Error(data?.detail || "Failed to load profiles");
      setProfiles(Array.isArray(data) ? data : data.results || []);
    } catch (e) {
      setErr(e.message || "Failed to load profiles");
      setProfiles([]);
    }
  };

  useEffect(() => {
    loadProfiles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const resetForm = () => {
    setForm({ name: "", owner: "", breed: "" });
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.owner || !form.breed) return;

    setBusy(true);
    setErr("");

    try {
      if (editingId) {
        // UPDATE
        const res = await authFetch(`${API_BASE}${editingId}/`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        if (!res) return;
        const updated = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(updated?.detail || "Update failed");
        setProfiles((prev) => prev.map((p) => (p.id === editingId ? updated : p)));
        resetForm();
      } else {
        // CREATE
        const res = await authFetch(API_BASE, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        if (!res) return;
        const created = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(created?.detail || "Create failed");
        setProfiles((prev) => [...prev, created]);
        resetForm();
      }
    } catch (e) {
      setErr(e.message || "Save failed");
    } finally {
      setBusy(false);
    }
  };

  const handleEdit = (profile) => {
    setForm({ name: profile.name, owner: profile.owner, breed: profile.breed });
    setEditingId(profile.id);
  };

  const handleDelete = async (id) => {
    setBusy(true);
    setErr("");
    try {
      const res = await authFetch(`${API_BASE}${id}/`, { method: "DELETE" });
      if (!res) return;
      if (!res.ok) {
        const t = await res.text();
        throw new Error(t || "Delete failed");
      }
      setProfiles((prev) => prev.filter((p) => p.id !== id));
      if (editingId === id) resetForm();
    } catch (e) {
      setErr(e.message || "Delete failed");
    } finally {
      setBusy(false);
    }
  };

  const content = (
    <div className="w-full max-w-2xl bg-chonky-brown-50 rounded-xl shadow-md p-8">
      <h2 className="text-2xl font-bold mb-6 text-default-text text-center">
        Manage Pet Profiles
      </h2>

      {err && <p className="mb-4 text-red-400 text-sm">{err}</p>}

      <form onSubmit={handleSubmit} className="mb-8 space-y-4">
        <div>
          <label className="block text-default-text mb-1" htmlFor="name">
            Pet Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded bg-bg-bottom text-default-text border-none focus:ring-2 focus:ring-yellow"
            required
          />
        </div>
        <div>
          <label className="block text-default-text mb-1" htmlFor="owner">
            Owner Name
          </label>
          <input
            id="owner"
            name="owner"
            type="text"
            value={form.owner}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded bg-bg-bottom text-default-text border-none focus:ring-2 focus:ring-yellow"
            required
          />
        </div>
        <div>
          <label className="block text-default-text mb-1" htmlFor="breed">
            Breed
          </label>
          <input
            id="breed"
            name="breed"
            type="text"
            value={form.breed}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded bg-bg-bottom text-default-text border-none focus:ring-2 focus:ring-yellow"
            required
          />
        </div>

        <button
          type="submit"
          disabled={busy}
          className="w-full bg-yellow hover:bg-yellow/90 disabled:opacity-60 text-default-text px-6 py-2 btn-rounded-3xl font-bold transition-colors"
        >
          {editingId ? "Update Profile" : "Add Profile"}
        </button>

        {editingId && (
          <button
            type="button"
            onClick={resetForm}
            className="w-full mt-2 bg-poop hover:bg-poop-hover text-default-text px-6 py-2 btn-rounded-3xl font-bold transition-colors"
          >
            Cancel Edit
          </button>
        )}
      </form>

      <div>
        <h3 className="text-lg font-bold text-default-text mb-3">Pet Profiles</h3>
        <ul className="space-y-3">
          {profiles.map((profile) => (
            <li
              key={profile.id}
              className="flex items-center justify-between bg-bg-bottom rounded-lg px-4 py-3"
            >
              <div>
                <span className="font-semibold text-default-text">{profile.name}</span>
                <span className="ml-4 text-yellow font-bold">Owner: {profile.owner}</span>
                <span className="ml-4 text-peach font-bold">Breed: {profile.breed}</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(profile)}
                  className="bg-peach hover:bg-peach/90 text-default-text px-3 py-1 btn-rounded font-medium transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(profile.id)}
                  className="bg-poop hover:bg-poop-hover text-default-text px-3 py-1 btn-rounded font-medium transition"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
          {profiles.length === 0 && (
            <li className="text-whitish text-center py-4">No pet profiles yet.</li>
          )}
        </ul>
      </div>

      {asModal && (
        <div className="mt-8 flex justify-center">
          <button
            onClick={onClose}
            className="bg-yellow hover:bg-yellow/90 text-default-text px-6 py-2 btn-rounded-3xl font-bold transition-colors"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );

  if (asModal) return content;
  return (
    <div className="min-h-screen flex flex-col bg-chonky-brown-50">
      <HomeNavbar hideLoginButton />
      <main className="flex-1 flex flex-col items-center justify-start p-8">
        {content}
      </main>
    </div>
  );
}

export default AdminPetProfileManager;
