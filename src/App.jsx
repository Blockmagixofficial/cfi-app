import React, { useEffect } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import TransactionApp from "./pages/Transactions";
import RecentActivity from "./pages/RecentActivity";
import AmountEntry from "./pages/AmountEntry";
import BankSelectionDark from "./pages/BankSelection";
import PaymentConfirmation from "./pages/PaymentConfirmation";
import PaymentScreen from "./pages/PaymentScreen";
import ProfilePage from "./pages/ProfilePage";

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const restrictedRoutes = ["/dashboard", "/payments"];
    if (!token && restrictedRoutes.includes(location.pathname)) {
      navigate("/signin");
    }
    if (token && location.pathname === "/") {
      navigate("/dashboard");
    }
  }, [location, navigate]);

  return (
    <Routes>
      {/* Root route accessible to everyone */}
      <Route path="/" element={<Signup />} />
      {/* Dashboard and Payments are restricted routes */}
      <Route path="/dashboard" element={<Dashboard />} />
      {/* <Route path="/payments" element={<PaymentPage />} /> */}
      {/* Sign Up and Sign In routes */}
      <Route path="/signup" element={<Signup />} />
      <Route path="/signin" element={<Signup />} />
      <Route path="/transaction" element={<TransactionApp />} />
      <Route path="/profile" element={<ProfilePage />} />

      <Route path="/recent-activity" element={<RecentActivity />} />
      <Route path="/amount-entry/:name" element={<AmountEntry />} />
      <Route path="/bank-selection" element={<BankSelectionDark />} />
      <Route path="/payment-confirmation" element={<PaymentConfirmation />} />
      <Route path="/payment" element={<PaymentScreen />} />

    </Routes>
  );
}

export default App;
