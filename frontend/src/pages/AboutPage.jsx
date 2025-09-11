import PageNavbar from "../components/PageNavbar";

function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <PageNavbar 
        currentPage="About Us"
        breadcrumbs={["Chonky Boi", "About", "Our Story"]}
        showButtons={true}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">About Chonky Boi</h2>
        <p className="text-gray-600">About page content goes here...</p>
      </main>
    </div>
  );
}

export default AboutPage;
