import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import DashboardRouter from "./pages/DashboardRouter";
import UpdatePassword from "./pages/UpdatePassword";
import CreateUser from "./pages/CreateUser";
import DeactivateAccount from "./pages/DeactivateAccount";
import Logs from "./pages/Logs";
import NotFound from "./pages/NotFound"; // 👈 import 404 page
import ManageRoles from "./pages/ManageRoles";

function App() {
  return (
    <Router>
      <div className="min-h-screen w-full flex flex-col bg-gray-900 text-white px-4 sm:px-6 md:px-8 overflow-x-hidden">
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/dashboard" element={<DashboardRouter />} />
          <Route path="/update-password" element={<UpdatePassword />} />
          <Route path="/create-user" element={<CreateUser />} />
          <Route path="/deactivate-account" element={<DeactivateAccount />} />
          <Route path="/logs" element={<Logs />} />
          <Route path="/manage-roles" element={<ManageRoles />} />

          {/* 👇 catch-all route should always be last */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
