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
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate, useParams } from "react-router-dom";
import { styled } from "@mui/system";

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
  const navigate = useNavigate();
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [currency, setCurrency] = useState("INR"); // Default currency

  const handleNext = () => {
    if (amount) {
      console.log("Currency:", currency, "Amount:", amount, "Note:", note);
      // Pass name, amount, note, and currency to the PaymentConfirmation screen
      navigate(`/payment-confirmation`, { state: { name, currency, amount, note } });
    }
  };

  const currencySymbol = currency === "INR" ? "₹" : "$";

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: 2,
        backgroundColor: "#1976d2", // Blue background like Google Pay
        minHeight: "100vh",
        color: "#fff",
      }}
    >
      {/* Header */}
      <Box display="flex" alignItems="center" justifyContent="flex-start" width="100%" p={2}>
        <IconButton sx={{ color: "#fff" }} onClick={() => navigate("/recent-activity")}>
          <ArrowBackIcon />
        </IconButton>
      </Box>

      {/* Profile Pictures and Text */}
      <Box display="flex" flexDirection="column" alignItems="center" mb={4}>
        <Box display="flex" alignItems="center" mb={2}>
          <Avatar
            sx={{
              width: 60,
              height: 60,
              marginRight: 1,
              border: "2px solid #fff",
            }}
          >
            S
          </Avatar>
          <Typography sx={{ fontSize: 24, fontWeight: "bold", mx: 1 }}>→</Typography>
          <Avatar
            sx={{
              width: 60,
              height: 60,
              marginLeft: 1,
              border: "2px solid #fff",
            }}
          >
            {name.charAt(0).toUpperCase()}
          </Avatar>
        </Box>
        <Typography variant="h6">Paying {name}</Typography>
      </Box>

      <Box display="flex" alignItems="center" mb={2} gap={1}>
        <SmallSelect
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          variant="outlined"
          input={<InputBase />}
        >
          <MenuItem value="INR">INR</MenuItem>
          <MenuItem value="USDT">USDT</MenuItem>
          <MenuItem value="USDC">USDC</MenuItem>
        </SmallSelect>
        <Typography variant="h4" sx={{ fontWeight: "bold", color: "#ffffff" }}>
          {currency}
        </Typography>
      </Box>

      {/* Display Currency Symbol with Amount */}
      <Typography variant="h3" align="center" sx={{ fontWeight: "bold", ml: 1, color: "#ffffff" }}>
        {currencySymbol} {amount || "0"}
      </Typography>

      <TextField
        fullWidth
        placeholder="Enter Amount"
        variant="standard"
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        inputProps={{
          style: {
            fontSize: 36,
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
