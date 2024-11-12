import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  Button,
  MenuItem,
  Select,
  FormControl,
  Snackbar,
  Alert,
  Grid,
  IconButton,
  Avatar,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import BackspaceIcon from "@mui/icons-material/Backspace";
import axiosInstance from "../utils/axios";
import { useNavigate } from "react-router";

const CheckBalanceScreen = ({ onBack }) => {
  const [banks, setBanks] = useState([]);
  const [selectedBank, setSelectedBank] = useState(null);
  const [enteredPin, setEnteredPin] = useState("");
  const [showPinScreen, setShowPinScreen] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();



  const handleDashboard = () => {
    navigate("/dashboard");
  };

  useEffect(() => {
    const fetchBankData = async () => {
      try {
        const response = await axiosInstance.get("/user/getUserBankList");
        setBanks(response.data);

        // Set default bank (first in the list) if available
        if (response.data.length > 0) {
          setSelectedBank(response.data[0]);
        }
      } catch (error) {
        setErrorMessage("Failed to fetch bank data.");
      }
    };

    fetchBankData();
  }, []);

  const handlePinSubmit = () => {
    const savedPin = localStorage.getItem("userPin");

    if (enteredPin === savedPin) {
      setShowPinScreen(false);
      setSnackbarOpen(true);
    } else {
      setErrorMessage("Incorrect PIN. Please try again.");
      setEnteredPin("");
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleBankChange = (event) => {
    const bankId = event.target.value;
    const selected = banks.find((bank) => bank._id === bankId);
    setSelectedBank(selected);
  };

  return (
    <Box textAlign="center" p={3}>
      <Box display="flex" alignItems="center" mb={3}>
        <IconButton onClick={onBack}>
          <ArrowBackIcon color="black" />
        </IconButton>
        <Typography variant="h6" fontWeight="bold" sx={{ ml: 1 }}>
          Check Balance
        </Typography>
      </Box>

      {showPinScreen ? (
        <Box display="flex" flexDirection="column" alignItems="center">
          <FormControl fullWidth sx={{ mb: 3 }}>
            <Select
              value={selectedBank ? selectedBank._id : ""}
              onChange={handleBankChange}
              displayEmpty
              renderValue={() =>
                selectedBank ? (
                  <Box display="flex" alignItems="center">
                    <Avatar
                      src={selectedBank.logo}
                      alt={selectedBank.bankName}
                      sx={{ width: 24, height: 24, mr: 2 }}
                    />
                    <Typography>{selectedBank.bankName}</Typography>
                  </Box>
                ) : (
                  <Typography color="textSecondary">Select Bank</Typography>
                )
              }
              inputProps={{
                "aria-label": "Without label",
              }}
              sx={{
                "& .MuiOutlinedInput-notchedOutline": {
                  border: "none",
                },
                "& .MuiSelect-icon": {
                  color: "gray",
                },
                textAlign: "left",
              }}
            >
              {banks.map((bank) => (
                <MenuItem key={bank._id} value={bank._id}>
                  <Box display="flex" alignItems="center">
                    <Avatar
                      src={bank.logo}
                      alt={bank.bankName}
                      sx={{ width: 24, height: 24, mr: 2 }}
                    />
                    <Typography>{bank.bankName}</Typography>
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Typography
            variant="h6"
            sx={{ mb: 1, fontWeight: "bold", textAlign: "center" }}
          >
            Enter PIN to Check Balance
          </Typography>
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
          <Grid container spacing={2} sx={{ maxWidth: 280, mt: 5 }}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, "⌫", 0, "✓"].map((item, idx) => (
              <Grid item xs={4} key={idx}>
                {item === "⌫" ? (
                  <IconButton
                    onClick={() => setEnteredPin(enteredPin.slice(0, -1))}
                    sx={{
                      width: "100%",
                      height: 75,
                      backgroundColor: "#1976d2",
                      color: "#fff",
                      "&:hover": {
                        backgroundColor: "#1565c0",
                      },
                    }}
                  >
                    <BackspaceIcon />
                  </IconButton>
                ) : item === "✓" ? (
                  <IconButton
                    onClick={handlePinSubmit}
                    sx={{ mt: -1.2 }}
                    disabled={enteredPin.length !== 4}
                  >
                    <CheckCircleIcon
                      style={{ fontSize: 82, color: "#1565c0" }}
                    />
                  </IconButton>
                ) : (
                  <Button
                    onClick={() =>
                      enteredPin.length < 4 && setEnteredPin(enteredPin + item)
                    }
                    variant="outlined"
                    sx={{
                      width: "100%",
                      height: 75,
                      fontSize: "1.2rem",
                      borderRadius: "50%",
                      color: "#1976d2",
                      borderColor: "#1976d2",
                      "&:hover": {
                        backgroundColor: "rgba(25, 118, 210, 0.1)",
                      },
                    }}
                  >
                    {item}
                  </Button>
                )}
              </Grid>
            ))}
          </Grid>
        </Box>
      ) : (
        <Box>
          <br />
          <br />
          <br />

          <CheckCircleIcon sx={{ fontSize: 80, color: "green", mb: 2 }} />
          <Typography variant="h6" sx={{ mb: 1, color: "#4CAF50" }}>
            Bank balance fetched successfully
          </Typography>
          <Box
            sx={{
              width: "100%",
              maxWidth: 300,
              p: 3,

              mx: "auto",
              borderRadius: 4,
              backgroundColor: "#ffffff",
              textAlign: "center",
            }}
          >
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              mb={2}
            >
              <Avatar
                src={selectedBank?.logo}
                alt={selectedBank?.bankName}
                sx={{ width: 30, height: 30, mr: 1 }}
              />
              <Typography variant="body1" fontWeight="medium">
                {selectedBank?.bankName} - ****{selectedBank?.accountNumber}
              </Typography>
            </Box>
            <Typography variant="h4" color="primary" fontWeight="bold">
              ₹{selectedBank?.balance || "N/A"}
            </Typography>
          </Box>
          <Button
            variant="contained"
            onClick={handleDashboard}
            sx={{
              borderRadius: 8,
              width: 200,
              mt: 10,
            }}
          >
            Done
          </Button>
        </Box>
      )}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="success"
          sx={{ width: "100%" }}
        >
          Balance fetched successfully!
        </Alert>
      </Snackbar>

      {errorMessage && (
        <Snackbar
          open={!!errorMessage}
          autoHideDuration={4000}
          onClose={() => setErrorMessage("")}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert severity="error">{errorMessage}</Alert>
        </Snackbar>
      )}
    </Box>
  );
};

export default CheckBalanceScreen;
