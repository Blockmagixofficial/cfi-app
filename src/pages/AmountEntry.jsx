import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Avatar,
  TextField,
  Button,
  IconButton,
  InputAdornment,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";

const AmountEntry = () => {
  const { name } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const userInfo = useSelector((state) => state.user.userInfo);
  const { userData } = useSelector((state) => state.receiver);

  const [amount, setAmount] = useState(location.state?.amount || "");
  const [willReceiveAmount, setWillReceiveAmount] = useState(0);
  const [conversionRate, setConversionRate] = useState(1);
  const [note, setNote] = useState("");
  const [exchangeRate, setExchangeRate] = useState(null);
  const [exchangeError, setExchangeError] = useState(null);

  useEffect(() => {
    const fetchExchangeRate = async () => {
      setExchangeError(null);
      if (userInfo?.currency && userData?.currency) {
        try {
          const response = await axios.get(
            `https://v6.exchangerate-api.com/v6/c3f58e8d3cafa52c9e75e94a/latest/${userInfo.currency}`
          );
          
          if (response.data && response.data.conversion_rates) {
            const rate = response.data.conversion_rates[userData.currency];
            if (rate) {
              setExchangeRate(rate);
              setConversionRate(rate); // Set conversion rate for amount calculation
            } else {
              setExchangeError(`Exchange rate not available for ${userData.currency}`);
            }
          }
        } catch (error) {
          console.error("Error fetching exchange rate:", error);
          setExchangeError("Unable to fetch live exchange rate");
        }
      } else {
        setExchangeRate(1); // Set to 1 if both currencies are the same
      }
    };
    fetchExchangeRate();
  }, [userInfo?.currency, userData?.currency]);

  const handleNext = () => {
    if (amount) {
      navigate(`/payment-confirmation`, {
        state: { name, currency: userData.currency, willReceiveAmount, note, amount },
      });
    }
  };

  const handleAmount = (value) => {
    setAmount(value);
    setWillReceiveAmount((value * conversionRate).toFixed(2)); // Calculate the amount to be received and round to 2 decimal places
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: "#1976d2",
        minHeight: "98vh",
        color: "#fff",
      }}
    >
      <Box
        display="flex"
        alignItems="center"
        justifyContent="flex-start"
        width="98vw"
        maxWidth={350}
        p={2}
      >
        <IconButton
          sx={{ color: "#fff" }}
          onClick={() => navigate("/recent-activity", { state: { willReceiveAmount, userData } })}
        >
          <ArrowBackIcon />
        </IconButton>
      </Box>

      {/* User Details */}
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        sx={{
          padding: 2,
          mb: 4,
        }}
      >
        <Avatar
          src={userData?.profileUrl}
          sx={{ width: 90, height: 90, bgcolor: "#FFD700", mb: 1 }}
        >
          {!userData?.profileUrl && userData?.name?.charAt(0)}
        </Avatar>
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
          {userData?.bankDetails?.name}
        </Typography>
        <Typography variant="body2">{userData?.ucpiId}</Typography>
        <Typography variant="body2">
          {userData?.bankDetails?.bankName} - Linked on UPI
        </Typography>
      </Box>

      <Typography
        variant="body1"
        sx={{ fontSize: "14px", color: "#ffffff", mb: 2 }}
      >
        Receiver will receive:
      </Typography>

      <Typography
        variant="h3"
        align="center"
        sx={{ fontWeight: "bold", color: "#ffffff" }}
      >
        {userData?.currency} {willReceiveAmount || "0.00"}
      </Typography>

      <TextField
        fullWidth
        variant="standard"
        type="number"
        value={amount}
        onChange={(e) => handleAmount(e.target.value)}
        placeholder="Enter Amount"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <span style={{ color: "white" }}>{userInfo?.currency}</span>
            </InputAdornment>
          ),
          style: {
            fontSize: 20,
            textAlign: "center",
            color: "#fff",
          },
        }}
        sx={{
          backgroundColor: "transparent",
          color: "#fff",
          maxWidth: "300px",
          mb: 3,
          mt: 5,
        }}
      />

      {/* Exchange Rate Display */}
      {exchangeRate && (
        <Typography variant="body2" sx={{ color: "#FFD700", mt: 1 }}>
          Exchange Rate: 1 {userInfo?.currency} = {exchangeRate} {userData.currency}
        </Typography>
      )}
      {exchangeError && (
        <Typography variant="body2" sx={{ color: "red", mt: 1 }}>
          {exchangeError}
        </Typography>
      )}

      {/* Note Button */}
      <Button
        variant="contained"
        fullWidth
        onClick={() => setNote("For dinner")}
        sx={{
          backgroundColor: "#1565c0",
          color: "#fff",
          fontWeight: "bold",
          maxWidth: "300px",
          borderRadius: 4,
          mb: 4,
          textTransform: "none",
          padding: "10px",
        }}
      >
        {note || "What is this for?"}
      </Button>

      <IconButton
        onClick={handleNext}
        sx={{
          backgroundColor: "#fff",
          color: "#1976d2",
          width: 60,
          height: 60,
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
          position: "absolute",
          bottom: 40,
        }}
      >
        ➔
      </IconButton>
    </Box>
  );
};

export default AmountEntry;
