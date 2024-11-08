import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  Alert,
  CircularProgress,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useLocation, useNavigate } from "react-router-dom"; // Import useNavigate
import SuccessSound from "../assets/success-sound.mp3"; // Make sure to have this sound file in your project
import html2canvas from "html2canvas";

// Sample data for bank and transaction
const transactionID = "3226734639";
const formatDate = (date) => {
  const options = {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  };
  return new Intl.DateTimeFormat("en-US", options).format(date);
};

const PaymentScreen = () => {
  const [enteredPin, setEnteredPin] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate(); // Initialize navigate
  const { state } = useLocation();
  const { name, currency = "INR", amount, note, selectedBank } = state || {};
  const [timestamp, setTimestamp] = useState(formatDate(new Date()));
  // Handle PIN Input and Delete


  const screenshotRef = useRef(null);

  const isMobileDevice = () => {
    return /Mobi|Android/i.test(navigator.userAgent);
  };

  const captureScreenshot = async () => {
    if (screenshotRef.current) {
      const canvas = await html2canvas(screenshotRef.current);
      const image = canvas.toDataURL("image/png");

      // Prepare the message for WhatsApp
      const message = `Payment Successful!\nAmount: ₹${amount}.00\nPaid to: ${name}\nTransaction ID: ${transactionID}\n${timestamp}`;

      // Choose the appropriate WhatsApp URL based on the device
      const whatsappURL = isMobileDevice()
        ? `https://wa.me/?text=${encodeURIComponent(message)}`
        : `https://web.whatsapp.com/send?text=${encodeURIComponent(message)}`;

      // Open WhatsApp with the link
      window.open(whatsappURL, "_blank");
    }
  };

  useEffect(() => {
    if (isSuccess) {
      const successAudio = new Audio(SuccessSound);
      successAudio.play();
    }
  }, [isSuccess]);


  const handlePinInput = (num) => {
    if (enteredPin.length < 4) {
      setEnteredPin(enteredPin + num);
    }
  };

  const handlePinDelete = () => {
    setEnteredPin(enteredPin.slice(0, -1));
  };

  const handlePinSubmit = () => {
    if (enteredPin.length !== 4) {
      setError("Please enter a 4-digit PIN");
    } else {
      setError(null); // Clear any existing error
      setIsLoading(true); // Show loading indicator
      setTimeout(() => {
        setIsLoading(false);
        setIsSuccess(true); // Show success screen after loading
      }, 2000); // Simulate a 2-second payment processing time
    }
  };

  // Loading Screen
  if (isLoading) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        height="100vh"
      >
        <CircularProgress size={60} color="primary" />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Processing your payment...
        </Typography>
      </Box>
    );
  }

  // Success Screen

  if (isSuccess) {
    return (
      <Box
        ref={screenshotRef}
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        height="80vh"
        padding={3}
        maxWidth="400px"
        margin="0 auto"
        bgcolor="#fff"
      >
        <img
          src="https://www.abhiyantha.com/trainings/registration/assets/images/Success.gif"
          style={{ height: "200px" }}
          alt="Success"
        />
        <Typography variant="h4" sx={{ fontWeight: "bold", color: "green", mb: 2 }}>
          ₹{amount}.00
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: "bold", mb: 1 }}>
          Paid to {name}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {selectedBank?.toLowerCase()}@upi
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
          {timestamp}
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
          UPI transaction ID: {transactionID}
        </Typography>

        <Button variant="outlined" sx={{ mt: 3 }} onClick={captureScreenshot}>
          Share on WhatsApp
        </Button>
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 1 }}
          onClick={() => navigate("/dashboard")}
        >
          Done
        </Button>
      </Box>
    );
  }



  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      padding={3}
      maxWidth="400px"
      margin="0 auto"
      bgcolor="#fff"
      borderRadius={3}
    >
      {/* Bank and Transaction Details */}
      <Typography
        variant="h6"
        sx={{ fontWeight: "bold", mb: 1, textAlign: "center" }}
      >
        From - {selectedBank} (UPI)
      </Typography>
      <Typography variant="body1" sx={{ mb: 1 }}>
        To: {name || "Unknown User"}
      </Typography>
      <Typography
        variant="h4"
        sx={{ fontWeight: "bold", color: "#1976d2", mb: 2 }}
      >
        ₹{amount}
      </Typography>

      {/* Enter PIN Section */}
      <Typography variant="body2" sx={{ mb: 1, fontWeight: "bold" }}>
        ENTER PIN
      </Typography>
      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        {[...Array(4)].map((_, idx) => (
          <Box
            key={idx}
            sx={{
              width: 40,
              height: 50,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: "1.5rem",
              fontWeight: "bold",
              color: "#1976d2",
              borderBottom: "2px solid #1976d2",
            }}
          >
            {enteredPin[idx] || ""}
          </Box>
        ))}
      </Box>

      {/* Error Message */}
      {error && (
        <Alert severity="error" sx={{ mt: 2, width: "100%" }}>
          <Typography variant="body2" sx={{ textAlign: "center" }}>
            {error}
          </Typography>
        </Alert>
      )}

      {/* Alert Message */}
      <Alert severity="warning" sx={{ mt: 2, width: "100%" }}>
        <Typography variant="body2" sx={{ textAlign: "center" }}>
          <strong>Alert:</strong> You are transferring money from your bank.
        </Typography>
      </Alert>

      {/* Numeric Keypad */}
      <Grid container spacing={2} sx={{ maxWidth: 240, mt: 3 }}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, "⌫", 0].map((num, idx) => (
          <Grid item xs={4} key={idx}>
            <Button
              onClick={() =>
                num === "⌫"
                  ? handlePinDelete()
                  : enteredPin.length < 4
                  ? handlePinInput(num)
                  : handlePinSubmit()
              }
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

      {/* Pay Button */}
      <Box sx={{ mt: 3, width: "100%" }}>
        <Button
          onClick={handlePinSubmit}
          variant="contained"
          color="primary"
          fullWidth
          disabled={isLoading}
          sx={{ height: 56, fontSize: "1.2rem", fontWeight: "bold" }}
        >
          Pay
        </Button>
      </Box>
    </Box>
  );
};

export default PaymentScreen;
