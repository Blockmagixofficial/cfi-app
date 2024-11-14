import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  IconButton,
  Grid,
  Checkbox,
  FormControlLabel,
  Button,
  AppBar,
  Toolbar,
  Snackbar,
  Alert,
} from "@mui/material";
import BackspaceIcon from "@mui/icons-material/Backspace";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router";

const PinSetupScreen = ({ onBack, onSubmit }) => {
  const [oldPin, setOldPin] = useState("");
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [isChangeMode, setIsChangeMode] = useState(false); // New state to handle change mode
  const navigate = useNavigate();

  // Check if a PIN already exists in localStorage
  useEffect(() => {
    const savedPin = localStorage.getItem("userPin");
    if (savedPin) {
      setIsChangeMode(true);
    }
  }, []);

  const handleNumberClick = (number) => {
    if (isChangeMode && oldPin.length < 4) {
      setOldPin(oldPin + number);
    } else if (pin.length < 4) {
      setPin(pin + number);
    }
  };

  const handleConfirmNumberClick = (number) => {
    if (confirmPin.length < 4) setConfirmPin(confirmPin + number);
  };

  const handleDelete = () => {
    if (confirmPin.length) {
      setConfirmPin(confirmPin.slice(0, -1));
    } else if (pin.length) {
      setPin(pin.slice(0, -1));
    } else if (oldPin.length) {
      setOldPin(oldPin.slice(0, -1));
    }
  };

  const handleToggleShowPin = () => {
    setShowPin(!showPin);
  };

  const handleSubmit = () => {
    const savedPin = localStorage.getItem("userPin");

    if (isChangeMode) {
      // Check if old PIN is correct
      if (oldPin !== savedPin) {
        alert("Old PIN is incorrect");
        return;
      }
    }

    if (pin === confirmPin && pin.length === 4) {
      localStorage.setItem("userPin", pin);
      setSnackbarOpen(true); // Show Snackbar on successful submit
      if (onSubmit) onSubmit(pin);

      // Redirect to recent-activity after setting PIN
      setTimeout(() => {
        navigate("/recent-activity");
      }, 2000); // Delay to allow Snackbar to be displayed
    } else {
      alert("PINs do not match or are not 4 digits");
    }
  };

  const handleCancel = () => {
    setOldPin("");
    setPin("");
    setConfirmPin("");
  };

  const handleBack = () => {
    navigate("/profile");
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box sx={{ backgroundColor: "#f0f4f8", minHeight: "100vh", py: 4, color: "#000" }}>
      {/* Header with Back Button */}
      <AppBar position="static" color="transparent" elevation={0}>
        <Toolbar>
          <IconButton edge="start" onClick={handleBack}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" fontWeight="bold">
            {isChangeMode ? "Change Passcode" : "Register New Passcode"}
          </Typography>
        </Toolbar>
      </AppBar>

      <Box textAlign="center" py={4}>
        {isChangeMode && (
          <>
            <Typography variant="body1" fontWeight="medium" sx={{ mb: 1 }}>
              Enter Old Passcode
            </Typography>
            <Box display="flex" justifyContent="center" gap={1} mb={3}>
              {[...Array(4)].map((_, index) => (
                <Box
                  key={index}
                  borderBottom="2px solid #1976d2"
                  width={50}
                  height={30}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  fontSize="1.5rem"
                  color="#1976d2"
                  fontWeight="bold"
                >
                  {showPin && oldPin[index] ? oldPin[index] : oldPin[index] ? "•" : ""}
                </Box>
              ))}
            </Box>
          </>
        )}

        <Typography variant="body1" fontWeight="medium" sx={{ mb: 1 }}>
          Enter {isChangeMode ? "New " : ""}Passcode
        </Typography>
        <Box display="flex" justifyContent="center" gap={1} mb={3}>
          {[...Array(4)].map((_, index) => (
            <Box
              key={index}
              borderBottom="2px solid #1976d2"
              width={50}
              height={30}
              display="flex"
              alignItems="center"
              justifyContent="center"
              fontSize="1.5rem"
              color="#1976d2"
              fontWeight="bold"
            >
              {showPin && pin[index] ? pin[index] : pin[index] ? "•" : ""}
            </Box>
          ))}
        </Box>

        <Typography variant="body1" fontWeight="medium" sx={{ mb: 1 }}>
          Confirm {isChangeMode ? "New " : ""}Passcode
        </Typography>
        <Box display="flex" justifyContent="center" gap={1} mb={2}>
          {[...Array(4)].map((_, index) => (
            <Box
              key={index}
              width={50}
              height={30}
              borderBottom="2px solid #1976d2"
              display="flex"
              alignItems="center"
              justifyContent="center"
              fontSize="1.5rem"
              color="#1976d2"
              fontWeight="bold"
            >
              {showPin && confirmPin[index] ? confirmPin[index] : confirmPin[index] ? "•" : ""}
            </Box>
          ))}
        </Box>

        <FormControlLabel
          control={
            <Checkbox
              checked={showPin}
              onChange={handleToggleShowPin}
              color="primary"
            />
          }
          label="Show"
          sx={{ mt: 2 }}
        />

        <Grid container spacing={2} mt={8}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, "", 0, "delete"].map((item, index) => (
            <Grid item xs={4} key={index}>
              {item === "delete" ? (
                <IconButton
                  onClick={handleDelete}
                  sx={{
                    width: 60,
                    height: 60,
                    backgroundColor: "#1976d2",
                    color: "#fff",
                    "&:hover": {
                      backgroundColor: "#1565c0",
                    },
                  }}
                >
                  <BackspaceIcon />
                </IconButton>
              ) : item === "" ? (
                <Box /> // Empty box for spacing
              ) : (
                <Button
                  variant="contained"
                  onClick={() =>
                    isChangeMode && oldPin.length < 4
                      ? handleNumberClick(item)
                      : pin.length < 4
                      ? handleNumberClick(item)
                      : handleConfirmNumberClick(item)
                  }
                  sx={{
                    width: 65,
                    height: 65,
                    borderRadius: "50%",
                    fontSize: "1.5rem",
                    backgroundColor: "#1976d2",
                    color: "#fff",
                    fontWeight: "bold",
                    "&:hover": {
                      backgroundColor: "#1565c0",
                    },
                  }}
                >
                  {item}
                </Button>
              )}
            </Grid>
          ))}
        </Grid>

        <Box display="flex" justifyContent="space-between" alignItems="center" mt={4}>
          <Button onClick={handleCancel} color="error" sx={{ fontWeight: "bold" }}>
            Cancel
          </Button>
          <IconButton
            onClick={handleSubmit}
            sx={{
              backgroundColor: "#1976d2",
              color: "#fff",
              "&:hover": {
                backgroundColor: "#1565c0",
              },
            }}
            disabled={pin.length !== 4 || confirmPin.length !== 4 || (isChangeMode && oldPin.length !== 4)}
          >
            <CheckCircleIcon fontSize="large" />
          </IconButton>
        </Box>

        {/* Snackbar for successful PIN setup */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={4000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: "100%" }}>
            PIN has been successfully set!
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
};

export default PinSetupScreen;
