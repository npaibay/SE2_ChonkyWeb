import PageNavbar from "../components/PageNavbar";

function ShopPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <PageNavbar 
        currentPage="Shop"
        breadcrumbs={["Chonky Boi", "Shop", "Products"]}
        showButtons={true}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Products</h2>
        <p className="text-gray-600">Shop page content goes here...</p>
      </main>
    </div>
  );
}

export default ShopPage;
