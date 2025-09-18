import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import HomeNavbar from "../components/HomeNavbar";
import { useNavigate } from "react-router-dom";

const API_BASE = "http://127.0.0.1:8000/api/products/"; // trailing slash

function AdminProductManager({ asModal, onClose }) {
  const { access, logout } = useAuth();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const [form, setForm] = useState({
    name: "",
    unit: "",               // e.g., pcs, kg, ml
    price: "",              // string; we normalize to 2dp on submit
    stock: "",              // integer
    restock_level: "",      // integer
    category: "",
    expiry_date: "",        // YYYY-MM-DD or ""
    is_active: true,
  });

  // ---------- helpers ----------
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

  const loadProducts = async () => {
    setErr("");
    try {
      const res = await authFetch(API_BASE);
      if (!res) return;
      const data = await res.json().catch(() => []);
      if (!res.ok) throw new Error(data?.detail || "Failed to load products");
      setProducts(Array.isArray(data) ? data : data.results || []);
    } catch (e) {
      setErr(e.message || "Failed to load products");
      setProducts([]);
    }
  };

  useEffect(() => {
    loadProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const resetForm = () => {
    setForm({
      name: "",
      unit: "",
      price: "",
      stock: "",
      restock_level: "",
      category: "",
      expiry_date: "",
      is_active: true,
    });
    setEditingId(null);
  };

  const normalizePrice2dp = (value) => {
    const num = parseFloat(value);
    if (Number.isNaN(num)) return null;
    return num.toFixed(2); // string for DecimalField
  };

  const toIntOrNull = (v) => {
    if (v === "" || v === null || typeof v === "undefined") return null;
    const n = parseInt(v, 10);
    return Number.isNaN(n) ? null : n;
  };

  const formatPHP = (v) => {
    const n = Number(v);
    return Number.isFinite(n) ? n.toFixed(2) : "0.00";
  };

  const formatDateForInput = (s) => {
    // Accept "YYYY-MM-DD" or full ISO; return "YYYY-MM-DD"
    if (!s) return "";
    if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
    const d = new Date(s);
    if (isNaN(d.getTime())) return "";
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${d.getFullYear()}-${mm}-${dd}`;
  };

  // ---------- CRUD ----------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");

    if (!form.name) return setErr("Product name is required.");
    const normalizedPrice = normalizePrice2dp(form.price);
    if (normalizedPrice === null) return setErr("Invalid price. Use numbers like 750.25");

    const stock = toIntOrNull(form.stock);
    const restock_level = toIntOrNull(form.restock_level);
    if (stock === null || stock < 0) return setErr("Current stock must be a non-negative integer.");
    if (restock_level === null || restock_level < 0) return setErr("Restock level must be a non-negative integer.");

    const payload = {
      name: form.name.trim(),
      unit: form.unit.trim() || null,
      price: normalizedPrice,
      stock,
      restock_level,
      category: form.category.trim() || null,
      expiry_date: form.expiry_date || null, // empty string -> null
      is_active: !!form.is_active,
    };

    setBusy(true);
    try {
      if (editingId) {
        const res = await authFetch(`${API_BASE}${editingId}/`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res) return;
        const updated = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(updated?.detail || "Update failed");
        setProducts((prev) => prev.map((p) => (p.id === editingId ? updated : p)));
        resetForm();
      } else {
        const res = await authFetch(API_BASE, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res) return;
        const created = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(created?.detail || "Create failed");
        setProducts((prev) => [created, ...prev]);
        resetForm();
      }
    } catch (e) {
      setErr(e.message || "Save failed");
    } finally {
      setBusy(false);
    }
  };

  const handleEdit = (product) => {
    setForm({
      name: product.name || "",
      unit: product.unit || "",
      price: String(product.price ?? ""),
      stock: String(product.stock ?? ""),
      restock_level: String(product.restock_level ?? ""),
      category: product.category || "",
      expiry_date: formatDateForInput(product.expiry_date),
      is_active: Boolean(product.is_active),
    });
    setEditingId(product.id);
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
      setProducts((prev) => prev.filter((p) => p.id !== id));
      if (editingId === id) resetForm();
    } catch (e) {
      setErr(e.message || "Delete failed");
    } finally {
      setBusy(false);
    }
  };

  // ---------- UI ----------
  const content = (
    <div className="w-full max-w-6xl h-[90vh] overflow-y-auto bg-chonky-brown-50 rounded-xl shadow-md p-8">
      <h2 className="text-2xl font-bold mb-6 text-default-text text-center">
        Manage Products
      </h2>

      {err && <p className="mb-4 text-red-400 text-sm">{err}</p>}

      <form onSubmit={handleSubmit} className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Name */}
        <div className="md:col-span-2">
          <label className="block text-default-text mb-1" htmlFor="name">
            Product Name
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

        {/* Unit */}
        <div>
          <label className="block text-default-text mb-1" htmlFor="unit">
            Unit of Measurement
          </label>
          <input
            id="unit"
            name="unit"
            type="text"
            placeholder="e.g., pcs, kg, ml"
            value={form.unit}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded bg-bg-bottom text-default-text border-none focus:ring-2 focus:ring-yellow"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-default-text mb-1" htmlFor="category">
            Category
          </label>
          <input
            id="category"
            name="category"
            type="text"
            placeholder="e.g., Shampoo, Food, Accessory"
            value={form.category}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded bg-bg-bottom text-default-text border-none focus:ring-2 focus:ring-yellow"
          />
        </div>

        {/* Price */}
        <div>
          <label className="block text-default-text mb-1" htmlFor="price">
            Default Unit Price (PHP)
          </label>
          <input
            id="price"
            name="price"
            type="number"
            inputMode="decimal"
            min="0.01"
            step="0.01"
            value={form.price}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded bg-bg-bottom text-default-text border-none focus:ring-2 focus:ring-yellow"
            required
          />
        </div>

        {/* Stock */}
        <div>
          <label className="block text-default-text mb-1" htmlFor="stock">
            Current Stock
          </label>
          <input
            id="stock"
            name="stock"
            type="number"
            inputMode="numeric"
            min="0"
            step="1"
            value={form.stock}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded bg-bg-bottom text-default-text border-none focus:ring-2 focus:ring-yellow"
            required
          />
        </div>

        {/* Restock level */}
        <div>
          <label className="block text-default-text mb-1" htmlFor="restock_level">
            Restock Level
          </label>
          <input
            id="restock_level"
            name="restock_level"
            type="number"
            inputMode="numeric"
            min="0"
            step="1"
            value={form.restock_level}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded bg-bg-bottom text-default-text border-none focus:ring-2 focus:ring-yellow"
            required
          />
        </div>

        {/* Expiry date */}
        <div>
          <label className="block text-default-text mb-1" htmlFor="expiry_date">
            Expiry Date (optional)
          </label>
          <input
            id="expiry_date"
            name="expiry_date"
            type="date"
            value={form.expiry_date}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded bg-bg-bottom text-default-text border-none focus:ring-2 focus:ring-yellow"
          />
        </div>

        {/* Active */}
        <div className="flex items-center gap-3 mt-6">
          <input
            id="is_active"
            name="is_active"
            type="checkbox"
            checked={form.is_active}
            onChange={handleChange}
            className="h-5 w-5 accent-yellow"
          />
          <label htmlFor="is_active" className="text-default-text">
            Active
          </label>
        </div>

        {/* Actions */}
        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={busy}
            className="w-full bg-yellow hover:bg-yellow/90 disabled:opacity-60 text-default-text px-6 py-2 btn-rounded-3xl font-bold transition-colors"
          >
            {editingId ? "Update Product" : "Add Product"}
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
        </div>
      </form>

      {/* List */}
      <div>
        <h3 className="text-lg font-bold text-default-text mb-3">Current Products</h3>
        <ul className="space-y-3">
          {products.map((p) => (
            <li
              key={p.id}
              className="bg-bg-bottom rounded-lg px-4 py-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="min-w-[200px]">
                  <div className="font-semibold text-default-text">{p.name}</div>
                  <div className="text-sm text-whitish/80">
                    {p.category ? `${p.category} • ` : ""}{p.unit || "unit"}
                  </div>
                </div>

                <div className="text-yellow font-bold">
                  PHP {formatPHP(p.price)}
                </div>

                <div className="text-default-text">
                  Stock: <span className="font-semibold">{p.stock ?? 0}</span>
                  <span className="ml-2 text-sm text-whitish/70">(Restock at {p.restock_level ?? 0})</span>
                </div>

                <div className="text-sm text-whitish/80">
                  {p.expiry_date ? `Exp: ${formatDateForInput(p.expiry_date)}` : "No expiry"}
                </div>

                <div className={`text-sm font-semibold ${p.is_active ? "text-peach" : "text-red-400"}`}>
                  {p.is_active ? "Active" : "Inactive"}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(p)}
                    className="bg-peach hover:bg-peach/90 text-default-text px-3 py-1 btn-rounded font-medium transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="bg-poop hover:bg-poop-hover text-default-text px-3 py-1 btn-rounded font-medium transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
          {products.length === 0 && (
            <li className="text-whitish text-center py-4">No products yet.</li>
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

export default AdminProductManager;
