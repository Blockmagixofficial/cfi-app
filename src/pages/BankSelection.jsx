import React from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Avatar,
  Divider,
  TextField,
  IconButton,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate, useLocation } from "react-router-dom";

const bankData = {
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

const BankSelection = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currency, name , amount,} = location.state || {};
  const banks = bankData[currency] || [];

  const handleBankSelect = (bank) => {
    // Return to PaymentConfirmation with selected bank
    navigate("/payment-confirmation", {
      state: { selectedBank: bank, currency, name, amount, },
    });
  };

  return (
    <Box sx={{ padding: 2, backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      <Box display="flex" alignItems="center" mb={2}>
        <IconButton onClick={() => navigate(-1)}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h6" sx={{ ml: 2, fontWeight: "bold" }}>
          Select Your Bank
        </Typography>
      </Box>
      <TextField
        variant="outlined"
        placeholder="Search Bank"
        fullWidth
        sx={{ mb: 2 }}
        InputProps={{
          startAdornment: <SearchIcon sx={{ mr: 1, color: "#888" }} />,
        }}
      />
      <List>
        {banks.map((bank) => (
          <React.Fragment key={bank.id}>
            <ListItem button onClick={() => handleBankSelect(bank)}>
              <Avatar sx={{ bgcolor: "#1976d2", mr: 2 }}>
                {bank.name.charAt(0)}
              </Avatar>
              <ListItemText
                primary={bank.name}
                secondary={`Balance: ${bank.balance}`}
              />
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </List>
    </Box>
  );
};

export default BankSelection;
