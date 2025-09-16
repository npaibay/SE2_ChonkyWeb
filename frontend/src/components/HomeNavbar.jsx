import { Link } from "react-router-dom";
import logo from "../assets/pictures/chonky_boi-logo-01.png";

function HomeNavbar(props) {
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
            {!props.hideLoginButton && (
              <Link
                to="/login"
                className="bg-yellow hover:bg-yellow/90 text-default-text px-6 py-3 btn-rounded-3xl font-bold transition-colors"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default HomeNavbar;
