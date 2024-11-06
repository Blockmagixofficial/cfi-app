import React, { useState, useRef } from "react";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import LockIcon from "@mui/icons-material/Lock";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { useNavigate } from "react-router";

const TransactionApp = () => {
  const [screen, setScreen] = useState("account");
  const [balance, setBalance] = useState(100);
  const [transactionAmount, setTransactionAmount] = useState(0);
  const [accountNumber, setAccountNumber] = useState("");
  const [accountHolder, setAccountHolder] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [bankName, setBankName] = useState("");
  const [mpin, setMpin] = useState(["", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [snackbarOpen, setSnackbarOpen] = useState(false); // Snackbar state
  const inputRefs = useRef([]);

  const transactionId = "T2305201058366754628773";

  // List of dummy names
  const dummyNames = [
    "Mehul Kumar Jatiya",
    "Rajesh Gupta",
    "Anita Sharma",
    "Sunita Mehta",
    "Ravi Verma",
    "Priya Singh",
    "Anil Kumar",
    "Sangeeta Reddy",
    "Vikas Deshmukh",
    "Kiran Bedi",
  ];

  // List of banks
  const banks = [
    {
      bankName: "State Bank of India",
      accountNo: "1234*****890",
      ifsc: "SBI0000123",
    },
    { bankName: "HDFC Bank", accountNo: "5678*****123", ifsc: "HDFC0000123" },
    { bankName: "ICICI Bank", accountNo: "478*****120", ifsc: "ICIC0000123" },
    {
      bankName: "Bank of Baroda",
      accountNo: "1357*****246",
      ifsc: "BARB0000123",
    },
    {
      bankName: "Punjab National Bank",
      accountNo: "2468*****135",
      ifsc: "PUNB0000123",
    },
    {
      bankName: "Bank of America",
      accountNo: "9876*****543",
      ifsc: "BOFA0000123",
    },
    { bankName: "Wells Fargo", accountNo: "8765*****432", ifsc: "WFBI0000123" },
    { bankName: "Chase Bank", accountNo: "7654*****321", ifsc: "CHAS0000123" },
    { bankName: "Citibank", accountNo: "6543*****210", ifsc: "CITI0000123" },
    { bankName: "Goldman Sachs", accountNo: "5432*****109", ifsc: "GS0000123" },
  ];

  // Function to get a random name from the list
  const getRandomName = () => {
    const randomIndex = Math.floor(Math.random() * dummyNames.length);
    return dummyNames[randomIndex];
  };

  // Function to get a random bank from the list
  const getRandomBank = () => {
    const randomIndex = Math.floor(Math.random() * banks.length);
    return banks[randomIndex];
  };

  const handleAccountNumberInput = (e) => {
    const value = e.target.value;
    setAccountNumber(value);

    if (value.length === 10) {
      setLoading(true);
      setLoadingMessage("Verifying Account Number...");

      setTimeout(() => {
        const randomBank = getRandomBank(); // Get a random bank
        setLoading(false);
        setAccountHolder(getRandomName()); // Set a random account holder's name
        setBankName(randomBank.bankName);
        setIfscCode(randomBank.ifsc); // Set a random IFSC code
        setScreen("verified");
      }, 2000);
    } else {
      setAccountHolder("");
      setIfscCode("");
      setBankName("");
    }
  };

  const handleAmountProceed = () => {
    if (transactionAmount <= 0 || transactionAmount > balance) {
      setSnackbarOpen(true); // Show snackbar if the amount is invalid
    } else {
      setScreen("mpin");
    }
  };
  const handleAmountChange = (e) => {
    const value = e.target.value;

    // Remove leading zeros by converting the string to a number and back to a string
    const sanitizedValue = value ? String(Number(value)) : "";

    setTransactionAmount(sanitizedValue);
  };

  const handleMPINInput = (value, index) => {
    const newMpin = [...mpin];
    newMpin[index] = value;
    setMpin(newMpin);

    if (value && index < 3) {
      inputRefs.current[index + 1].focus();
    }

    if (index === 3 && newMpin.every((digit) => digit !== "")) {
      setLoading(true);
      setScreen("loading");
      setLoadingMessage("Verifying PIN...");

      setTimeout(() => {
        setLoadingMessage("Processing Transaction...");
      }, 1500);

      setTimeout(() => {
        setLoading(false);
        setBalance(balance - transactionAmount);
        setScreen("success");
        setMpin(["", "", "", ""]);
      }, 3000);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleCopyTransactionId = () => {
    navigator.clipboard.writeText(transactionId).then(() => {
      alert("Transaction ID copied to clipboard");
    });
  };

  const handleSendAgain = () => {
    setTransactionAmount(0);
    setAccountNumber("");
    setAccountHolder("");
    setIfscCode("");
    setBankName("");
    setScreen("account");
  };

  const navigate = useNavigate();
  return (
    <Container
      maxWidth="xs"
      sx={{
        textAlign: "center",
        height: "90vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "20px",
        backgroundColor: "#f8f9fa",
        boxShadow: 3,
        borderRadius: 2,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mb: 3,
        }}
      >
        <AccountBalanceWalletIcon color="primary" fontSize="large" />
        <Typography variant="h4" sx={{ ml: 1, color: "primary.main" }}>
          ₹{balance?.toFixed(2)}
        </Typography>
      </Box>

      {screen === "account" && (
        <Box>
          <Typography variant="h6" gutterBottom>
            Enter UCPI ID
          </Typography>
          <TextField
            fullWidth
            type="text"
            label="UCPI ID"
            variant="outlined"
            value={accountNumber}
            onChange={handleAccountNumberInput}
            sx={{
              mb: 3,
              borderRadius: "10px",
              "& .MuiOutlinedInput-root": { borderRadius: "10px" },
            }}
            inputProps={{
              maxLength: 10,
              pattern: "[0-9]*",
            }}
          />
          {loading && (
            <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
              <CircularProgress color="primary" size={24} />
              <Typography variant="body2" sx={{ ml: 1 }}>
                {loadingMessage}
              </Typography>
            </Box>
          )}
        </Box>
      )}

      {screen === "verified" && (
        <Box>
          <CheckCircleIcon sx={{ color: "green", fontSize: 50 }} />
          <Typography variant="h6" sx={{ color: "purple", mt: 1 }}>
            Bank Account Valid
          </Typography>
          <Box sx={{ mt: 2, textAlign: "left", px: 3 }}>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography variant="body2" color="textSecondary">
                Name at Bank
              </Typography>
              <Typography variant="body1" sx={{ color: "black" }}>
                {accountHolder}
              </Typography>
              <CheckCircleIcon sx={{ color: "green", fontSize: 16 }} />
            </Box>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              mt={1}
            >
              <Typography variant="body2" color="textSecondary">
                Account Number
              </Typography>
              <Typography variant="body1" sx={{ color: "black" }}>
                {accountNumber}
              </Typography>
              <CheckCircleIcon sx={{ color: "green", fontSize: 16 }} />
            </Box>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              mt={1}
            >
              <Typography variant="body2" color="textSecondary">
                Bank
              </Typography>
              <Typography variant="body1" sx={{ color: "black" }}>
                {bankName}
              </Typography>
              <CheckCircleIcon sx={{ color: "green", fontSize: 16 }} />
            </Box>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              mt={1}
            >
              <Typography variant="body2" color="textSecondary">
                IFSC
              </Typography>
              <Typography variant="body1" sx={{ color: "black" }}>
                {ifscCode}
              </Typography>
              <CheckCircleIcon sx={{ color: "green", fontSize: 16 }} />
            </Box>
          </Box>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={() => setScreen("amount")}
            sx={{
              mt: 3,
              borderRadius: "10px",
              fontSize: "16px",
              padding: "10px 0",
            }}
          >
            Proceed
          </Button>
        </Box>
      )}

      {screen === "amount" && (
        <Box>
          <Typography variant="h6" gutterBottom>
            Enter Transaction Amount
          </Typography>
          <TextField
            fullWidth
            type="number"
            label="Amount"
            variant="outlined"
            value={transactionAmount}
            onChange={handleAmountChange} // Use the new handler here
            sx={{
              mb: 3,
              borderRadius: "10px",
              "& .MuiOutlinedInput-root": { borderRadius: "10px" },
            }}
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleAmountProceed}
            sx={{ borderRadius: "10px", fontSize: "16px", padding: "10px 0" }}
          >
            Proceed
          </Button>
        </Box>
      )}

      {screen === "mpin" && (
        <Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 2,
            }}
          >
            <LockIcon color="primary" fontSize="large" />
          </Box>
          <Typography variant="h6" gutterBottom>
            Enter Secure PIN
          </Typography>
          <Box
            sx={{ display: "flex", justifyContent: "center", gap: 2, mb: 3 }}
          >
            {mpin.map((digit, index) => (
              <TextField
                key={index}
                type="password"
                inputProps={{
                  maxLength: 1,
                  style: {
                    textAlign: "center",
                    fontSize: "24px",
                    padding: "8px",
                  },
                }}
                value={digit}
                onChange={(e) => handleMPINInput(e.target.value, index)}
                ref={(el) => (inputRefs.current[index] = el)}
                sx={{
                  width: "50px",
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                    borderColor: "primary.main",
                  },
                }}
              />
            ))}
          </Box>
        </Box>
      )}

      {screen === "loading" && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mt: 3,
          }}
        >
          <CircularProgress color="primary" size={60} thickness={4} />
          <Typography variant="body1" sx={{ mt: 2 }}>
            {loadingMessage}
          </Typography>
        </Box>
      )}

      {screen === "success" && (
        <Box>
          <Typography variant="h6" align="center" sx={{ mb: 2 }}>
            Transaction Successful
          </Typography>

          <Typography variant="body2" color="textSecondary" align="center">
            {currentDate.toLocaleDateString()} at{" "}
            {currentDate.toLocaleTimeString()}
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              backgroundColor: "#f8f9fa",
              p: 2,
              borderRadius: 2,
              mt: 2,
            }}
          >
            <Typography variant="body2">Transaction ID</Typography>
            <Box
              display="flex"
              alignItems="center"
              onClick={handleCopyTransactionId}
              sx={{ cursor: "pointer" }}
            >
              <Typography variant="body2" sx={{ mr: 1 }}>
                {transactionId}
              </Typography>
              <ContentCopyIcon fontSize="small" />
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              backgroundColor: "#f8f9fa",
              p: 2,
              borderRadius: 2,
              mt: 2,
            }}
          >
            <Box>
              <Typography variant="subtitle2">Paid to</Typography>
              <Typography variant="body2" color="textSecondary">
                {accountHolder}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {accountNumber}
              </Typography>
            </Box>
            <Box textAlign="right">
              <Typography variant="subtitle2" sx={{ color: "#5e72eb" }}>
                ₹{transactionAmount}
              </Typography>
              <Button
                variant="text"
                sx={{ color: "#5e72eb", fontSize: "0.75rem" }}
                onClick={handleSendAgain}
              >
                SEND AGAIN
              </Button>
            </Box>
          </Box>

          <Button color="primary" onClick={() => navigate("/dashboard")}>
            Back to Dashboard
          </Button>
        </Box>
      )}

      {/* Snackbar for invalid amount */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="error"
          sx={{ width: "100%" }}
        >
          Invalid amount! Please enter a valid transaction amount.
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default TransactionApp;
