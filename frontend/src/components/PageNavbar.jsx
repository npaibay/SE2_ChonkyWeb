import { Link } from "react-router-dom";
import logo from "../assets/pictures/chonky_boi-logo-01.png";

function PageNavbar({ 
  currentPage = "Shop", 
  breadcrumbs = ["Chonky Boi", "Shop", "Salon"],
  showButtons = true 
}) {
  return (
    <nav className="bg-chonky-brown-50 border-b-2 border-amber-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-3">
              <img
                src={logo}
                alt="Chonky Boi Pet Store"
                className="h-16 w-auto object-contain"
                draggable="false"
              />
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-amber-800">CHONKY BOI</span>
                <span className="text-sm text-amber-600">PET STORE & GROOMING SALON</span>
              </div>
            </Link>
          </div>

          {/* Page Title and Breadcrumbs */}
          <div className="flex flex-col items-center space-y-1">
            <h1 className="text-2xl font-bold text-amber-800">{currentPage}</h1>
            <div className="flex items-center space-x-2 text-amber-600">
              {breadcrumbs.map((crumb, index) => (
                <div key={index} className="flex items-center">
                  <span className="text-sm">{crumb}</span>
                  {index < breadcrumbs.length - 1 && (
                    <span className="mx-2 text-amber-500">•</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          {showButtons && (
            <div className="flex items-center space-x-3">
              <Link
                to="/shop"
                className="bg-whitish hover:bg-whitish-hover text-poop px-4 py-2 btn-rounded-3xl font-bold transition-colors border-1 border-poop"
              >
                Shop
              </Link>
              <Link
                to="/services"
                className="bg-whitish hover:bg-whitish-hover text-poop px-4 py-2 btn-rounded-3xl font-bold transition-colors border-1 border-poop"
              >
                Services
              </Link>
              <Link
                to="/about"
                className="bg-whitish hover:bg-whitish-hover text-poop px-4 py-2 btn-rounded-3xl font-bold transition-colors border-1 border-poop"
              >
                About us
              </Link>
              <Link
                to="/login"
                className="bg-poop hover:bg-poop-hover text-whitish px-4 py-2 btn-rounded-3xl font-bold transition-colors border-1 border-poop"
              >
                Login
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default PageNavbar;
