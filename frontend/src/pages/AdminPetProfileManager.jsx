import { useState, useEffect } from "react";
import HomeNavbar from "../components/HomeNavbar";

const API_URL = "http://127.0.0.1:8000/api/pet-profiles";

function AdminPetProfileManager({ asModal, onClose }) {
  const [profiles, setProfiles] = useState([]);
  const [form, setForm] = useState({ name: "", owner: "", breed: "" });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then(setProfiles)
      .catch(() => setProfiles([]));
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.owner || !form.breed) return;

    if (editingId) {
      const res = await fetch(`${API_URL}/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const updated = await res.json();
      setProfiles((prev) => prev.map((p) => (p.id === editingId ? updated : p)));
      setEditingId(null);
    } else {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const created = await res.json();
      setProfiles((prev) => [...prev, created]);
    }
    setForm({ name: "", owner: "", breed: "" });
  };

  const handleEdit = (profile) => {
    setForm({ name: profile.name, owner: profile.owner, breed: profile.breed });
    setEditingId(profile.id);
  };

  const handleDelete = async (id) => {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    setProfiles((prev) => prev.filter((p) => p.id !== id));
    if (editingId === id) {
      setEditingId(null);
      setForm({ name: "", owner: "", breed: "" });
    }
  };

  const content = (
    <div className="w-full max-w-2xl bg-chonky-brown-50 rounded-xl shadow-md p-8">
      <h2 className="text-2xl font-bold mb-6 text-default-text text-center">
        Manage Pet Profiles
      </h2>
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
          className="w-full bg-yellow hover:bg-yellow/90 text-default-text px-6 py-2 btn-rounded-3xl font-bold transition-colors"
        >
          {editingId ? "Update Profile" : "Add Profile"}
        </button>
        {editingId && (
          <button
            type="button"
            onClick={() => {
              setEditingId(null);
              setForm({ name: "", owner: "", breed: "" });
            }}
            className="w-full mt-2 bg-poop hover:bg-poop-hover text-default-text px-6 py-2 btn-rounded-3xl font-bold transition-colors"
          >
            Cancel Edit
          </button>
        )}
      </form>
      <div>
        <h3 className="text-lg font-bold text-default-text mb-3">
          Pet Profiles
        </h3>
        <ul className="space-y-3">
          {profiles.map((profile) => (
            <li
              key={profile.id}
              className="flex items-center justify-between bg-bg-bottom rounded-lg px-4 py-3"
            >
              <div>
                <span className="font-semibold text-default-text">
                  {profile.name}
                </span>
                <span className="ml-4 text-yellow font-bold">
                  Owner: {profile.owner}
                </span>
                <span className="ml-4 text-peach font-bold">
                  Breed: {profile.breed}
                </span>
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
            <li className="text-whitish text-center py-4">
              No pet profiles yet.
            </li>
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