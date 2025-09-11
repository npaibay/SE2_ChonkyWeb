import { Link } from "react-router-dom";
import HomeNavbar from "../components/HomeNavbar";

function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800 flex flex-col">
      {/* Navigation */}
      <HomeNavbar />

      {/* Hero Section */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 md:px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          {/* Left: copy and actions */}
          <div className="text-center md:text-left">
            <div className="mb-8">
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
                Chonky Boi Pet Store and Grooming Salon
              </h2>
              <p className="text-xl sm:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto md:mx-0">
                Your FURiendly neighborhood Pet Store and Grooming Salon!
              </p>
            </div>

            <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center md:justify-start">
              <Link
                to="/login"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 btn-rounded-3xl font-semibold text-lg transition-colors"
              >
                Get Started
              </Link>
              <Link
                to="/create-user"
                className="inline-block bg-gray-700 hover:bg-gray-600 text-white px-8 py-4 btn-rounded-3xl font-semibold text-lg transition-colors"
              >
                Create Account
              </Link>
            </div>
          </div>

          {/* Right: placeholder collage */}
          <div className="hidden md:block md:justify-self-end" aria-hidden="true">
            <div className="grid grid-cols-3 grid-rows-3 gap-4 w-[440px] max-w-full">
              <div className="col-span-2 row-span-2 h-44 rounded-xl bg-gray-700/60 animate-pulse" />
              <div className="h-24 rounded-xl bg-gray-700/60 animate-pulse" />
              <div className="h-24 rounded-xl bg-gray-700/60 animate-pulse" />
              <div className="col-span-2 h-24 rounded-xl bg-gray-700/60 animate-pulse" />
              <div className="h-24 rounded-xl bg-gray-700/60 animate-pulse" />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 px-4 sm:px-6 md:px-8 border-t border-gray-700">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-400">
            © 2024 Chonky Boi Pet Store. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
