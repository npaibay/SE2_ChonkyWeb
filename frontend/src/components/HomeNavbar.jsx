import { Link } from "react-router-dom";
import logo from "../assets/pictures/chonky_boi-logo-01.png";

function HomeNavbar() {
  return (
    <nav className="bg-chonky-brown-50 font-martel">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-3">
              <img
                src={logo}
                alt="Chonky Boi Pet Store"
                className="h-20 w-auto object-contain"
                draggable="false"
              />
            </Link>
            <span className="text-whitish font-bold text-[24px]">Home</span>
          </div>


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
        </div>
      </div>
    </nav>
  );
}

export default HomeNavbar;
