import React, { useState } from "react";
import {
  Box,
  Typography,
  Avatar,
  TextField,
  Button,
  IconButton,
  Select,
  MenuItem,
  InputBase,
  InputAdornment,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { styled } from "@mui/system";
import { useSelector } from "react-redux";
import axios from "axios";
import axiosInstance from "../utils/axios";
// Styled small select component
const SmallSelect = styled(Select)({
  marginLeft: 8,
  backgroundColor: "#fff",
  borderRadius: 4,
  fontSize: 16,
  padding: "2px 8px",
  color: "#1976d2",
  "& .MuiSvgIcon-root": {
    color: "#1976d2",
  },
});

const AmountEntry = () => {
  const { name } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const userInfo = useSelector((state) => state.user.userInfo);
  const { userData } = useSelector((state) => state.receiver);
  // const userData = location.state?.userData || {};

  const [amount, setAmount] = useState(location.state?.amount || "");
  const [fee, setFee] = useState(0);
  const [willReceiveAmount, setWillReceiveAmount] = useState(0);
  const [worldCurrencies, setCurrencies] = useState(null);
  const [conversionRate, setConversionRate] = useState(1);
  const [note, setNote] = useState("");
  const [currencySymbol, setCurrencySymbol] = useState("$");
  const [currency, setCurrency] = useState(userData.currency);

  const feeCalculation = 0.1;
  useState(async () => {
    console.log({ worldCurrencies });
    const wc = await axiosInstance.get(`/api/currencies`);
    if (wc && wc.data) {
      setCurrencies(wc.data.data);
      setCurrencySymbol(wc.data.data[userData.currency].symbol);
      console.log(wc.data.data[userData.currency].symbol, userData.currency);
    }
    if (userInfo.currency != userData.currency) {
      console.log("inside this boxx");
      let dd = await axios.get(
        `https://v6.exchangerate-api.com/v6/8fa5a6ae2ce88bbf3187076e/pair/${userInfo.currency}/${userData.currency}`
      );
      if (dd && dd.data && dd.data.conversion_rate) {
        setConversionRate(dd.data.conversion_rate);
      }
      // console.log("currency api data", dd.data);
    }

    console.log("userData at 41", userInfo);
  }, []);

  const handleNext = () => {
    if (amount) {
      console.log("Currency:", currency, "Amount:", amount, "Note:", note);
      // Pass name, amount, note, and currency to the PaymentConfirmation screen
      navigate(`/payment-confirmation`, {
        state: { name, currency, willReceiveAmount, note, amount, fee },
      });
    }
  };

  const handleAmount = (value) => {
    let feeOnAmount = value * feeCalculation;
    let valueAfterFee = value - feeOnAmount;
    console.log(value, feeOnAmount, valueAfterFee);
    setAmount(value);
    setWillReceiveAmount(valueAfterFee * conversionRate);
    setFee(feeOnAmount);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: 2,
        backgroundColor: "#1976d2",
        minHeight: "94vh",
        color: "#fff",
      }}
    >
      {/* Header */}
      <Box
        display="flex"
        alignItems="center"
        justifyContent="flex-start"
        width="100%"
        p={2}
      >
        <IconButton
          sx={{ color: "#fff" }}
          onClick={
            () =>
              navigate("/recent-activity", {
                state: { willReceiveAmount, userData },
              }) // Pass the amount back to retain it
          }
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
          src={userData.profileUrl}
          sx={{ width: 80, height: 80, bgcolor: "#FFD700", mb: 1 }}
        >
          {!userData?.profileUrl && userData?.name?.charAt(0)}
        </Avatar>
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          {userData?.bankDetails?.name}
        </Typography>
        <Typography variant="body2">{userData?.ucpiId}</Typography>
        <Typography variant="body2">
          {userData.bankDetails?.bankName} - Linked on UPI
        </Typography>
      </Box>

      <span style={{ fontSize: "14px" }}>ashwini will receive</span>
      <span style={{ fontSize: "14px" }}>Platform Fee {fee.toFixed(3)} </span>

      <Typography
        variant="h3"
        align="center"
        sx={{ fontWeight: "bold", ml: 1, color: "#ffffff" }}
      >
        {currencySymbol} {willReceiveAmount.toFixed(2) || "0"}
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

      {/* Note Button */}
      <Button
        variant="contained"
        fullWidth
        onClick={() => setNote("For dinner")} // Example action to add note
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

      {/* Floating Next Button */}
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
