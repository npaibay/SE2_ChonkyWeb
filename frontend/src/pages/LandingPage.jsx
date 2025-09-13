import { Link } from "react-router-dom";
import HomeNavbar from "../components/HomeNavbar";

function LandingPage() {
  return (
    <div className="min-h-screen bg-chonky-brown-50 flex flex-col">
      {/* Navigation */}
      <HomeNavbar />

      {/* Hero Section */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 md:px-8 py-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Purchase Basket Button + Photo */}
          <div className="lg:col-span-3 space-y-4">
            <Link
              to="/shop"
              className="bg-yellow hover:bg-yellow/90 text-default-text px-6 py-3 btn-rounded-3xl font-bold transition-colors text-center flex-1"
            >
              Purchase Basket
            </Link>
            <div className="h-64 rounded-xl bg-gray-700/60 animate-pulse flex items-center justify-center">
              <span className="text-gray-400 text-sm">Kitten Photo</span>
            </div>
          </div>

          {/* Center Column: Split into two parts */}
          <div className="lg:col-span-6 space-y-8">
            {/* Top: Title and Description */}
            <div className="text-left">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-default-text mb-4">
                Chonky Boi Pet Store & Grooming Salon
              </h2>
              <p className="text-lg sm:text-xl text-default-text">
                Your FURiendly neighborhood Pet Store and Grooming Salon!
              </p>
            </div>

            {/* Bottom: Split into Services/Buttons (left) and Dog Photo (right) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left: Services, Prices, and Buttons */}
              <div className="space-y-6">
                {/* Services and Prices */}
                <div className="bg-gray-800/50 rounded-lg p-6">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <h3 className="text-lg font-bold text-default-text">SERVICES</h3>
                    <h3 className="text-lg font-bold text-default-text text-right">PRICES</h3>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-default-text">
                      <span>Bathing</span>
                      <span className="font-semibold">PHP 101</span>
                    </div>
                    <div className="flex justify-between text-default-text">
                      <span>Deep Conditioning</span>
                      <span className="font-semibold">PHP 143</span>
                    </div>
                    <div className="flex justify-between text-default-text">
                      <span>Nail Trimming</span>
                      <span className="font-semibold">PHP 444</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-row gap-3">
                  <Link
                    to="/services"
                    className="bg-yellow hover:bg-yellow/90 text-default-text px-6 py-3 btn-rounded-3xl font-bold transition-colors text-center flex-1"
                  >
                    Deals
                  </Link>
                  <Link
                    to="/login"
                    className="bg-yellow hover:bg-yellow/90 text-default-text px-6 py-3 btn-rounded-3xl font-bold transition-colors text-center flex-1"
                  >
                    Book Now
                  </Link>
                </div>
              </div>

              {/* Right: Dog Photo */}
              <div className="flex justify-center">
                <div className="h-64 w-64 rounded-xl bg-gray-700/60 animate-pulse flex items-center justify-center">
                  <span className="text-gray-400 text-sm">Dog Photo</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Grooming Supplies */}
          <div className="lg:col-span-3 h-80 lg:mt-16">
            <div className="bg-gray-800/50 rounded-lg p-6 h-full">
              <h3 className="text-xl font-bold text-default-text mb-4">GROOMING SUPPLIES</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="h-16 bg-gray-700/60 rounded-lg animate-pulse flex items-center justify-center">
                  <span className="text-default-text text-xs">Food Bowl</span>
                </div>
                <div className="h-16 bg-gray-700/60 rounded-lg animate-pulse flex items-center justify-center">
                  <span className="text-default-text text-xs">Chew Sticks</span>
                </div>
                <div className="h-16 bg-gray-700/60 rounded-lg animate-pulse flex items-center justify-center">
                  <span className="text-default-text text-xs">Nail Clipper</span>
                </div>
                <div className="h-16 bg-gray-700/60 rounded-lg animate-pulse flex items-center justify-center">
                  <span className="text-default-text text-xs">Brush</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 px-4 sm:px-6 md:px-8 border-t border-text-brown">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-poop">
            © 2025 Chonky Boi Pet Store. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
