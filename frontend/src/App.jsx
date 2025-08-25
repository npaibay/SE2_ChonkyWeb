import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import DashboardRouter from "./pages/DashboardRouter"; // decides admin vs normal
import UpdatePassword from "./pages/UpdatePassword";
import CreateUser from "./pages/CreateUser";
import DeactivateAccount from "./pages/DeactivateAccount";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardRouter />} />
        <Route path="/update-password" element={<UpdatePassword />} />
        <Route path="/create-user" element={<CreateUser />} />
        <Route path="/deactivate-account" element={<DeactivateAccount />} />
      </Routes>
    </Router>
  );
}

export default App;
