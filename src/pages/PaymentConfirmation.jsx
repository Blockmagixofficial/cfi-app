import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Avatar,
  Button,
  IconButton,
  Divider,
  Dialog,
  DialogContent,
  DialogActions,
  Grid,
  CircularProgress,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axios";
import { useSelector } from "react-redux";

const PaymentConfirmation = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { name, currency, willReceiveAmount, amount, note, selectedBank } = state || {};
  const [banks, setBanks] = useState([]);
  const [currentBank, setCurrentBank] = useState(selectedBank || null);
  const [pinDialogOpen, setPinDialogOpen] = useState(false);
  const [enteredPin, setEnteredPin] = useState("");
  const [showBalance, setShowBalance] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userData } = useSelector((state) => state.receiver);

  // Platform fee calculation (10%)
  const platformFeePercentage = 0.1;
  const receiverNetAmount = (willReceiveAmount * (1 - platformFeePercentage)).toFixed(2);

  useEffect(() => {
    const fetchBankData = async () => {
      try {
        const response = await axiosInstance.get("/user/getUserBankList");
        const banksData = response.data;
        setBanks(banksData);
        const defaultBank = banksData.find((bank) => bank.default) || banksData[0];
        setCurrentBank(selectedBank || defaultBank);
        setLoading(false);
      } catch (error) {
        setError("Failed to fetch bank data.");
        setLoading(false);
      }
    };

    fetchBankData();
  }, [selectedBank]);

  const handleBankSelection = () => {
    navigate("/bank-selection", {
      state: {
        selectedBank: currentBank,
        willReceiveAmount,
        name,
        currency,
        amount,
      },
    });
  };

  const handlePay = () => {
    navigate("/payment", {
      state: {
        name,
        currency,
        selectedBank: currentBank,
        receiverNetAmount,
        amount,
      },
    });
  };

  const handleCheckBalance = () => {
    setPinDialogOpen(true);
  };

  const handlePinInput = (num) => {
    if (enteredPin.length < 4) {
      setEnteredPin(enteredPin + num);
    }
  };

  const handlePinDelete = () => {
    setEnteredPin(enteredPin.slice(0, -1));
  };

  const handlePinSubmit = () => {
    const correctPin = localStorage.getItem("userPin");
    if (enteredPin === correctPin) {
      setShowBalance(true);
      setPinDialogOpen(false);
      setEnteredPin("");
    } else {
      alert("Incorrect PIN. Please try again.");
      setEnteredPin("");
    }
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <Typography color="error" align="center">
        {error}
      </Typography>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: 1,
        pb: 0,
        pt: 0,
        minHeight: "100%",
        top: 0,
        width: "92vw",
      }}
    >
      {/* Header */}
      <Box
        display="flex"
        alignItems="center"
        width="100%"
        p={2}
        sx={{
          backgroundColor: "#F0F0F5",
          position: "sticky",
          top: 0,
          mt: -2,
          zIndex: 1000,
        }}
      >
        <IconButton sx={{ color: "#333" }} onClick={() => navigate(-1)}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h6" sx={{ fontWeight: "bold", ml: 2 }}>
          Payment Confirmation
        </Typography>
      </Box>

      {/* Payment Info */}
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        mb={4}
        mt={7}
      >
        <Avatar
          src={userData?.profileUrl}
          sx={{ bgcolor: "#1976d2", width: 60, height: 60 }}
        />

        <Typography variant="h6" sx={{ mt: 1 }}>
          Paying To {userData?.bankDetails?.name}
        </Typography>
        <Typography
          variant="h3"
          sx={{ fontWeight: "bold", color: "#1976d2", mt: 1 }}
        >
          {currency === "INR" ? "₹" : "$"} {receiverNetAmount}
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: "#888", mt: 0.5, fontSize: "0.875rem", textAlign: "center" }}
        >
          * Amount shown reflects a 10% platform fee deduction.
        </Typography>
        {note && (
          <Typography sx={{ color: "#888", mt: 1, textAlign: "center" }}>
            {note}
          </Typography>
        )}
      </Box>

      {/* Bank Selection */}
      <Box
        sx={{
          width: "100%",
          maxWidth: 400,
          mb: 3,
          p: 2,
          borderRadius: 2,
          backgroundColor: "#fff",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Typography variant="body1" sx={{ fontWeight: "bold", mb: 1 }}>
          Choose an account to pay with:
        </Typography>
        <Box
          onClick={handleBankSelection}
          sx={{
            cursor: "pointer",
            padding: 1.5,
            borderRadius: 2,
            display: "flex",
            alignItems: "center",
            transition: "all 0.3s",
            "&:hover": { backgroundColor: "#f9f9f9" },
          }}
        >
          <Avatar src={currentBank?.logo} sx={{ bgcolor: "#1976d2", mr: 2 }}>
            {currentBank?.bankName.charAt(0)}
          </Avatar>
          <Box>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              {currentBank?.bankName}
            </Typography>
          </Box>
        </Box>

        <Button
          onClick={handleCheckBalance}
          variant="text"
          color="primary"
          sx={{ mt: 1, fontWeight: 700 }}
        >
          {showBalance
            ? `Balance: ${currency === "INR" ? "₹" : "$"} ${
                currentBank?.balance
              }`
            : "Check Balance"}
        </Button>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ p: 2, backgroundColor: "#e0f7fa", borderRadius: 2 }}>
          <Typography
            variant="body2"
            color="textSecondary"
            sx={{ textAlign: "center" }}
          >
            {currentBank?.bankName} payments are PIN-free. Money will be debited
            instantly when you pay.
          </Typography>
        </Box>
      </Box>

      {/* Payment Button */}
      <Button
        variant="contained"
        fullWidth
        onClick={handlePay}
        sx={{
          backgroundColor: "#1976d2",
          color: "#fff",
          fontWeight: "bold",
          maxWidth: "400px",
          borderRadius: 4,
          textTransform: "none",
          padding: "12px",
          boxShadow: "0 6px 12px rgba(25, 118, 210, 0.3)",
          transition: "transform 0.2s",
          "&:hover": {
            backgroundColor: "#1565c0",
            transform: "translateY(-2px)",
          },
        }}
      >
        Pay {currency === "INR" ? "₹" : "$"} {amount} with{" "}
        {currentBank?.bankName}
      </Button>
    </Box>
  );
};

export default PaymentConfirmation;
