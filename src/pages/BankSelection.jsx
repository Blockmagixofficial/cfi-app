import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Avatar,
  Button,
  Card,
  CardContent,
  Divider,
  IconButton,
  CircularProgress,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import axiosInstance from "../utils/axios";
import { useLocation, useNavigate } from "react-router";

const BankSelection = () => {
  const [banks, setBanks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBank, setSelectedBank] = useState(null);
  const navigate = useNavigate();
  const { state } = useLocation();
  const { name, currency, willReceiveAmount, note } = state || {};

  useEffect(() => {
    const fetchBankData = async () => {
      try {
        const response = await axiosInstance.get("/user/getUserBankList");
        setBanks(response.data);
        console.log("Banks", response.data)
        setLoading(false);
      } catch (error) {
        setError("Failed to fetch bank data.");
        setLoading(false);
      }
    };

    fetchBankData();
  }, []);

  const handleBankSelect = (bank) => {
    setSelectedBank(bank);
  };

  const handleBack = () => {
    setSelectedBank(null);
  };

  const handleActivateUPI = () => {
    navigate("/payment-confirmation", {
      state: { selectedBank, name, currency, willReceiveAmount, note },
    });
  };

  return (
    <Box sx={{ padding: 2, backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" mt={2}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error" align="center">
          {error}
        </Typography>
      ) : !selectedBank ? (
        // Bank Selection View
        <>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
            Select Your Bank
          </Typography>
          <Grid container spacing={2}>
            {banks.map((bank) => (
              <Grid item xs={6} sm={4} key={bank._id}>
                <Card
                  onClick={() => handleBankSelect(bank)}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    padding: 2,
                    cursor: "pointer",
                    backgroundColor: "#fff",
                    boxShadow: 1,
                    borderRadius: 2,
                    textAlign: "center",
                  }}
                >
                  <Avatar
                    src={bank.logo}
                    sx={{ width: 40, height: 40, mb: 1 }}
                  />
                  <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                    {bank.bankName}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </>
      ) : (
        // Bank Details View
        <>
          <Box display="flex" alignItems="center" mb={2}>
            <IconButton onClick={handleBack}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h6" sx={{ ml: 1, fontWeight: "bold" }}>
              {selectedBank.bankName}
            </Typography>
          </Box>
          <Card sx={{ p: 2, mb: 2 }}>
            <Box display="flex" alignItems="center" mb={2}>
              <Avatar
                src={selectedBank.logo}
                sx={{ width: 40, height: 40, mr: 2 }}
              />
              <Box>
                <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                  {selectedBank.bankName} ••••{" "}
                  {selectedBank.accountNumber &&
                    selectedBank.accountNumber.toString().slice(-4)}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {selectedBank.name} -{" "}
                  {selectedBank.accountType || "Savings Account"}
                </Typography>
              </Box>
            </Box>
            <Divider sx={{ my: 2 }} />
            <CardContent>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Balance:</strong> ₹{selectedBank.balance}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>UCPI ID:</strong> {selectedBank.ucpiId}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Account Verified:</strong>{" "}
                {selectedBank.verified ? "Yes" : "No"}
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                <strong>Linked:</strong> {selectedBank.linked ? "Yes" : "No"}
              </Typography>
              <Divider sx={{ my: 2 }} />

              <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{
                  mb: 1,
                  borderRadius: "24px", 
                  padding: "10px",
                  textTransform: "none", 
                }}
                onClick={handleActivateUPI}
              >
                Activate UPI International
              </Button>
              <Button
                variant="outlined"
                color="primary"
                fullWidth
                onClick={handleBack}
                sx={{
                  borderRadius: "24px",
                  padding: "10px",
                  textTransform: "none",
                  border: "1px solid #1976d2",
                  color: "#1976d2",
                  "&:hover": {
                    backgroundColor: "rgba(25, 118, 210, 0.04)",
                  },
                }}
              >
                Cancel
              </Button>
            </CardContent>
          </Card>
        </>
      )}
    </Box>
  );
};

export default BankSelection;
