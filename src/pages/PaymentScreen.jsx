import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  Alert,
  CircularProgress,
  IconButton,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useLocation, useNavigate } from "react-router-dom"; // Import useNavigate
import SuccessSound from "../assets/success-sound.mp3"; // Make sure to have this sound file in your project
import html2canvas from "html2canvas";
import axiosInstance from "../utils/axios";
import { useDispatch, useSelector } from "react-redux";
import { clearReceiverData } from "../stores/receiverSlice";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import DoneIcon from "@mui/icons-material/Done";
// Sample data for bank and transaction


const formatDate = (date) => {
  const options = {
    month: "short",
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
  const { name, willReceiveAmount, note, selectedBank, amount, fee } =
    state || {};

  const [timestamp, setTimestamp] = useState(formatDate(new Date()));
  const [transactionID, setTransactionID] = useState("");
  const screenshotRef = useRef(null);
  const { userData } = useSelector((state) => state.receiver);
  const userInfo = useSelector((state) => state.user.userInfo);

  const dispatch = useDispatch();

  const isMobileDevice = () => {
    return /Mobi|Android/i.test(navigator.userAgent);
  };

  const captureScreenshot = async () => {
    if (screenshotRef.current) {
      const canvas = await html2canvas(screenshotRef.current);
      const image = canvas.toDataURL("image/png");

      // Prepare the message for WhatsApp
      const message = `Payment Successful!\nwillReceiveAmount: ₹${willReceiveAmount}.00\nPaid to: ${name}\nTransaction ID: ${transactionID}\n${timestamp}`;

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


  
  const handlePinSubmit = async () => {
    const correctPin = localStorage.getItem("userPin");
    console.log(" correctPin", correctPin);
    if (enteredPin !== correctPin) {  // Check if entered PIN does not match
      setError("Incorrect PIN. Please try again.");
      return;
    }
  
    setError(null);
    setIsLoading(true);
  
    const payload = {
      amount: parseInt(amount, 0),
      bankId: selectedBank?._id || "",
      receiverUcpiId: userData?.ucpiId || "",
      willReceiveAmount: willReceiveAmount || 0,
      userNote: note || "Payment",
      fees: fee || 0,
    };
  
    try {
      // Make the API call to transfer funds
      const response = await axiosInstance.post("/user/transferFunds", payload);
      console.log("response.data.data", response.data.data);
  
      if (response.data) {
        setTransactionID(response.data.data); // Store transaction ID
        console.log("response.data.data", response.data.data);
        setIsSuccess(true);
        dispatch(clearReceiverData());
      }
    } catch (error) {
      setError("Payment failed. Please try again.");
    } finally {
      setIsLoading(false);
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
      <Typography
        variant="h4"
        sx={{ fontWeight: "bold", color: "green", mb: 2 }}
      >
        ₹{Math.abs(transactionID?.credit)}.00
      </Typography>
      <Typography variant="body1" sx={{ fontWeight: "bold", mb: 1 }}>
        Paid to {transactionID?.recipientOrSenderName}
      </Typography>
      <Typography variant="body2" color="textSecondary">
        {transactionID?.recipientOrSenderUcpiId}@upi
      </Typography>
      <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
        {timestamp}
      </Typography>
      <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
        UPI transaction ID: {transactionID?.ref}
      </Typography>

      {/* Share on WhatsApp Button */}
      <Button
        variant="outlined"
        sx={{
          mt: 3,
          borderColor: "#25D366",
          color: "#25D366",
          "&:hover": {
            backgroundColor: "#25D366",
            color: "#fff",
          },
        }}
        startIcon={<WhatsAppIcon />}
        onClick={captureScreenshot}
      >
        Share on WhatsApp
      </Button>

      {/* Done Button */}
      <Button
        variant="contained"
        color="primary"
        sx={{ mt: 2, width:220 }}
        startIcon={<DoneIcon />}
        onClick={() => navigate("/dashboard")}
      >
        back to home
      </Button>
    </Box>
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
          Payment
        </Typography>
      </Box>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        padding={3}
        maxWidth="350px"
        margin="0 auto"
        bgcolor="#fff"
        borderRadius={3}
      >
        <Typography
          variant="h6"
          sx={{ fontWeight: "bold", mb: 1, textAlign: "center" }}
        >
          From - {selectedBank?.bankName || "Unknown Bank"} (UPI)
        </Typography>
        <Typography variant="body1" sx={{ mb: 1 }}>
          To: {name || "Unknown User"}
        </Typography>
        <Typography
          variant="h4"
          sx={{ fontWeight: "bold", color: "#1976d2", mb: 2 }}
        >
         {userInfo?.currency} {willReceiveAmount}
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
    </Box>
  );
};

export default PaymentScreen;
