import React, { useEffect } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import TransactionApp from "./pages/Transactions";
// import './App.css'

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    
    // Define restricted routes where user must be logged in
    const restrictedRoutes = ["/dashboard", "/payments"];

    // Redirect to /signin if no token and user tries to access restricted routes
    if (!token && restrictedRoutes.includes(location.pathname)) {
      navigate("/signin");
    }
  }, [location, navigate]);
  return (
    <>
     <Routes>
        {/* Root route accessible to everyone */}
        <Route path="/" element={<Signup />} />
        {/* Dashboard and Payments are restricted routes */}
        <Route path="/dashboard" element={<Dashboard />} />
        {/* <Route path="/payments" element={<PaymentPage />} /> */}
        {/* Sign Up and Sign In routes */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signup />} />
        <Route path="transaction" element={<TransactionApp/>}/>
      </Routes>
    </>
  )
}

export default App
