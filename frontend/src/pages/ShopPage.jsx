import { useEffect, useState } from "react";
import PageNavbar from "../components/PageNavbar";
import { apiFetch } from "../utils/api";

function ShopPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const res = await apiFetch("/api/products/");
      const data = await res.json();
      setProducts(data);
      setLoading(false);
    };
    load();
  }, []);

  const addToCart = async (productId) => {
    await apiFetch("/api/cart/add/", {
      method: "POST",
      body: JSON.stringify({ product_id: productId, quantity: 1 }),
    });
    alert("Added to cart!");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <PageNavbar
        currentPage="Shop"
        breadcrumbs={["Chonky Boi", "Shop", "Products"]}
        showButtons={true}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Products</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((p) => (
              <div key={p.id} className="bg-white rounded-2xl shadow p-4">
                <h3 className="font-semibold text-lg">{p.name}</h3>
                <p className="text-sm text-gray-600">{p.category || "General"}</p>
                <p className="mt-2 font-bold">₱{Number(p.price).toFixed(2)}</p>
                <button
                  onClick={() => addToCart(p.id)}
                  className="mt-3 w-full bg-blue-600 text-white rounded-xl py-2"
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default ShopPage;
