import React, { useState } from "react";
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
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useLocation, useNavigate } from "react-router-dom";

// Sample bank accounts data based on currency
const bankAccounts = {
  INR: [
    { id: 1, name: "HDFC Bank", balance: "₹3000" },
    { id: 2, name: "Axis Bank", balance: "₹5000" },
    { id: 3, name: "ICICI Bank", balance: "₹1500" },
  ],
  USD: [
    { id: 1, name: "Bank of America", balance: "$500" },
    { id: 2, name: "Chase Bank", balance: "$300" },
    { id: 3, name: "Wells Fargo", balance: "$700" },
  ],
};

const PaymentConfirmation = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { name, currency = "INR", amount, note, selectedBank } = state || {};

  const [currentBank, setCurrentBank] = useState(
    selectedBank || (bankAccounts[currency] && bankAccounts[currency][0]) || null
  );
  const [pinDialogOpen, setPinDialogOpen] = useState(false);
  const [enteredPin, setEnteredPin] = useState("");
  const [showBalance, setShowBalance] = useState(false);

  const handleBankSelection = () => {
    navigate("/bank-selection", {
      state: { name, currency, selectedBankId: currentBank?.id , amount,},
    });
  };


  const handlePay = () => {
    navigate("/payment", {
      state: { name, currency, selectedBankId: currentBank?.id, amount },
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
    const correctPin = "1234"; // Example correct PIN
    if (enteredPin === correctPin) {
      setShowBalance(true);
      setPinDialogOpen(false);
      setEnteredPin("");
    } else {
      alert("Incorrect PIN. Please try again.");
      setEnteredPin("");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: 3,
        backgroundColor: "#f5f5f5",
        minHeight: "100vh",
        color: "#333",
      }}
    >
      {/* Header */}
      <Box display="flex" alignItems="center" justifyContent="flex-start" width="100%" p={2}>
        <IconButton sx={{ color: "#333" }} onClick={() => navigate(-1)}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h6" sx={{ fontWeight: "bold", ml: 2 }}>
          Payment Confirmation
        </Typography>
      </Box>

      {/* Payment Info */}
      <Box display="flex" flexDirection="column" alignItems="center" mb={4} mt={2}>
        <Avatar sx={{ bgcolor: "#1976d2", width: 60, height: 60 }}>
          {name?.charAt(0)?.toUpperCase()}
        </Avatar>
        <Typography variant="h6" sx={{ mt: 1 }}>Paying {name}</Typography>
        <Typography variant="h3" sx={{ fontWeight: "bold", color: "#1976d2", mt: 1 }}>
          {currency === "INR" ? "₹" : "$"} {amount}
        </Typography>
        {note && <Typography sx={{ color: "#888", mt: 1, textAlign: "center" }}>{note}</Typography>}
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
          <Avatar sx={{ bgcolor: "#1976d2", mr: 2 }}>{currentBank.name.charAt(0)}</Avatar>
          <Box>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>{currentBank.name}</Typography>
          </Box>
        </Box>

        <Button onClick={handleCheckBalance} variant="text" color="primary" sx={{ mt: 1, fontWeight: 500 }}>
          {showBalance ? `Balance: ${currentBank.balance}` : "Check Balance"}
        </Button>
        
        <Divider sx={{ my: 2 }} />
        
        <Box sx={{ p: 2, backgroundColor: "#e0f7fa", borderRadius: 2 }}>
          <Typography variant="body2" color="textSecondary" sx={{ textAlign: "center" }}>
            {currentBank.name} payments are PIN-free. Money will be debited instantly when you pay.
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
            transform: "translateY(-2px)"
          },
        }}
      >
        Pay {currency === "INR" ? "₹" : "$"} {amount} with {currentBank.name}
      </Button>

      {/* PIN Entry Dialog with Numeric Keypad */}
      <Dialog
        open={pinDialogOpen}
        onClose={() => setPinDialogOpen(false)}
        sx={{
          "& .MuiDialog-paper": {
            borderRadius: 3,
            padding: 3,
            maxWidth: "350px",
            backgroundColor: "#fff",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
          },
          backdropFilter: "blur(4px)",
        }}
      >
        <DialogContent>
          <Box display="flex" flexDirection="column" alignItems="center">
            <Typography variant="h6" sx={{ mb: 1, fontWeight: "bold", textAlign: "center" }}>
            Check Balance
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
              with {currentBank.name}
            </Typography>

            {/* Display PIN */}
            <Box sx={{ display: "flex", gap: 1, mb: 3 }}>
              {[...Array(4)].map((_, idx) => (
                <Box
                  key={idx}
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    backgroundColor: enteredPin[idx] ? "#1976d2" : "#e0e0e0",
                  }}
                />
              ))}
            </Box>

            {/* Numeric Keypad */}
            <Grid container spacing={2} sx={{ maxWidth: 240 }}>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, "⌫", 0].map((num, idx) => (
                <Grid item xs={4} key={idx}>
                  <Button
                    onClick={() => (num === "⌫" ? handlePinDelete() : handlePinInput(num))}
                    variant="outlined"
                    sx={{
                      width: "100%",
                      height: 56,
                      fontSize: "1.2rem",
                      borderRadius: "50%",
                      color: "#1976d2",
                      borderColor: "#1976d2",
                      "&:hover": {
                        backgroundColor: "rgba(25, 118, 210, 0.1)",
                      },
                    }}
                  >
                    {num}
                  </Button>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Action Buttons */}
          <DialogActions sx={{ justifyContent: "center", mt: 2 }}>
            <Button onClick={() => setPinDialogOpen(false)} sx={{ color: "#d32f2f", fontWeight: "bold" }}>
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handlePinSubmit}
              sx={{
                backgroundColor: "#1976d2",
                fontWeight: "bold",
                "&:hover": {
                  backgroundColor: "#1565c0",
                },
              }}
            >
              Submit
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default PaymentConfirmation;
