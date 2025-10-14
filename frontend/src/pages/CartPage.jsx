import { useEffect, useState } from "react";
import PageNavbar from "../components/PageNavbar";
import { apiFetch } from "../utils/api";

export default function CartPage() {
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadCart = async () => {
    try {
      setLoading(true);
      const res = await apiFetch("/api/cart/");
      const data = await res.json();
      setCart(data);
    } catch (e) {
      setError("Failed to load cart.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  const removeItem = async (itemId) => {
    await apiFetch("/api/cart/remove/", {
      method: "POST",
      body: JSON.stringify({ item_id: itemId }),
    });
    loadCart();
  };

  const clearCart = async () => {
    await apiFetch("/api/cart/clear/", { method: "POST" });
    loadCart();
  };

  const checkout = async () => {
    const res = await apiFetch("/api/cart/checkout/", { method: "POST" });
    const data = await res.json();
    if (res.ok) {
      alert("Checkout successful!");
      loadCart();
    } else {
      alert(data.detail || "Checkout failed.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <PageNavbar
        currentPage="Cart"
        breadcrumbs={["Chonky Boi", "Shop", "Cart"]}
        showButtons={true}
      />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-3xl font-bold mb-6">Your Cart</h2>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="bg-white rounded-xl shadow p-4">
            {cart.items?.length ? (
              cart.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between border-b py-3"
                >
                  <div>
                    <p className="font-medium">{item.product_name}</p>
                    <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-semibold">
                      ₱{Number(item.unit_price).toFixed(2)}
                    </span>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="px-3 py-1 rounded-lg bg-red-600 text-white"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p>No items in your cart.</p>
            )}
            <div className="flex items-center justify-between mt-4">
              <p className="text-lg">
                <span className="font-semibold">Total:</span> ₱
                {Number(cart.total || 0).toFixed(2)}
              </p>
              <div className="flex gap-3">
                <button onClick={clearCart} className="px-4 py-2 rounded-lg bg-gray-100">
                  Clear
                </button>
                <button
                  onClick={checkout}
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white"
                >
                  Checkout
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
