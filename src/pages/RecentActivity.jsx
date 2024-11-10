import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Avatar,
  Card,
  IconButton,
  TextField,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  CircularProgress,
  Snackbar,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useLocation, useNavigate } from "react-router-dom";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import SearchIcon from "@mui/icons-material/Search";
import axiosInstance from "../utils/axios";
import VerifiedIcon from "@mui/icons-material/CheckCircle"; // For verified icon
import { useDispatch, useSelector } from "react-redux";
import { fetchUserData } from "../stores/receiverSlice";

const RecentActivity = () => {
  const { state } = useLocation();
  const { amount } = state || {};
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [copiedUcpiId, setCopiedUcpiId] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const navigate = useNavigate();
  const [recentContacts, setRecentContacts] = useState([]);
  const dispatch = useDispatch();
  const { userData, loading, error } = useSelector((state) => state.receiver);

  const handleCardClick = () => {
    navigate(`/amount-entry/${userData.name}`, { state: { userData } });
  };

  const handleCopyUcpiId = (contact) => {
    const ucpiId = contact.recipientOrSenderUcpiId; // Assuming the UCPI ID is stored in this field
    navigator.clipboard.writeText(ucpiId);
    setCopiedUcpiId(ucpiId);
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  useEffect(() => {
    if (searchInput) {
      dispatch(fetchUserData(searchInput));
    }
  }, [dispatch, searchInput]);

  useEffect(() => {
    const fetchPaymentHistory = async () => {
      try {
        const response = await axiosInstance.get("/user/getAllTransactions");
        if (response.data && response.data) {
          setRecentContacts(response.data);
        }
      } catch (error) {
        console.error("Error fetching payment history:", error);
      }
    };

    fetchPaymentHistory();
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: 2,
        backgroundColor: "#f5f5f5",
        minHeight: "100vh",
      }}
    >
      {/* Header */}
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        width="100%"
        p={2}
      >
        <IconButton
          sx={{ backgroundColor: "#e0e3e7" }}
          onClick={
            () => navigate("/recent-activity", { state: { amount } }) // Pass the amount back to retain it
          }
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          Recent Activity
        </Typography>
        <Avatar sx={{ backgroundColor: "#1976d2" }}>A</Avatar>
      </Box>

      {/* UCPI ID Input */}
      <Card
        sx={{
          width: "100%",
          maxWidth: 400,
          mt: 3,
          p: 2,
          borderRadius: 4,
          boxShadow: 3,
          backgroundColor: "#ffffff",
        }}
      >
        <Typography variant="h6" align="center" sx={{ mb: 2 }}>
          Enter UCPI ID
        </Typography>
        <TextField
          fullWidth
          placeholder="Enter UCPI ID or Mobile Number"
          variant="outlined"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          InputProps={{
            startAdornment: (
              <IconButton>
                <SearchIcon />
              </IconButton>
            ),
          }}
        />
      </Card>
      {loading && (
        <Box mt={2}>
          <CircularProgress />
        </Box>
      )}
      {error && (
        <Typography color="error" align="center" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}

      {userData && (
        <Card
          sx={{
            width: "100%",
            maxWidth: 400,
            mt: 3,
            p: 2,
            borderRadius: 4,
            boxShadow: 3,
            backgroundColor: "#ffffff",
          }}
          onClick={handleCardClick}
        >
          <Box display="flex" alignItems="center">
            <Avatar
              src={userData?.profileUrl}
              sx={{ bgcolor: "#FFD700", mr: 2, width: 46, height: 46 }}
            >
              {!userData?.profileUrl && userData.name.charAt(0)}{" "}
            </Avatar>
            <Box>
              <Box display="flex" alignItems="center">
                <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                  {userData.bankDetails.name}
                </Typography>
                {userData.bankDetails.verified && (
                  <IconButton sx={{ ml: 1, color: "green" }}>
                    <VerifiedIcon fontSize="small" /> {/* Verified icon */}
                  </IconButton>
                )}
              </Box>
              <Typography variant="body2" color="textSecondary">
                <strong>{userData.ucpiId}</strong> - {userData.bankDetails.name}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {userData.bankDetails.bankName} - Linked on UPI
              </Typography>
            </Box>
          </Box>
        </Card>
      )}

      {/* Pay Again Section */}
      <Card
        sx={{
          width: "100%",
          maxWidth: 400,
          mt: 3,
          p: 2,
          borderRadius: 4,
          boxShadow: 3,
          backgroundColor: "#ffffff",
        }}
      >
        <Typography variant="h6" align="center" sx={{ mb: 2 }}>
          Pay Again
        </Typography>
        <Grid container spacing={2} justifyContent="center">
          {recentContacts.slice(0, 6).map((contact, index) => (
            <Grid item xs={4} key={index}>
              <Box
                textAlign="center"
                alignItems={"center"}
                justifyContent={"center"}
                display={"flex"}
                flexDirection={"column"}
                onClick={() => handleCopyUcpiId(contact)}
                sx={{ cursor: "pointer" }}
              >
                <Avatar
                  src={contact?.recipientOrSenderProfile}
                  sx={{ width: 60, height: 60 }}
                />
                <Typography variant="body2" mt={1}>
                  {contact.recipientOrSenderName}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Card>

      {/* Recent Activity Section */}
      <Card
        sx={{
          padding: 2,
          maxWidth: 400,
          backgroundColor: "#ffffff",
          borderRadius: 4,
          width: "100%",
          mt: 2,
        }}
      >
        <Typography
          variant="h6"
          align="center"
          sx={{ mb: 2, fontWeight: "bold" }}
        >
          Recent Activity
        </Typography>
        <List>
          {recentContacts.map((transaction, index) => (
            <React.Fragment key={index}>
              <ListItem disableGutters sx={{ paddingY: 1 }}>
                <Avatar
                  src={transaction?.recipientOrSenderProfile}
                  sx={{ marginRight: 2 }}
                />

                <ListItemText
                  primary={
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                        {transaction.recipientOrSenderName}
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                        + {transaction.credit}
                      </Typography>
                    </Box>
                  }
                  secondary={
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Typography variant="body2" sx={{ color: "#757575" }}>
                        {transaction.type}
                      </Typography>
                      <Box display={"flex"} alignItems={"center"} gap={1}>
                        <Avatar
                          src={transaction?.recipientOrSenderBankLogo}
                          sx={{ marginRight: 2, height: 18, width: 18 }}
                        />
                      </Box>
                    </Box>
                  }
                />
              </ListItem>
              {index < recentContacts.length - 1 && (
                <Divider sx={{ marginX: 2, backgroundColor: "#e0e0e0" }} />
              )}
            </React.Fragment>
          ))}
        </List>
      </Card>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        message={`UCPI ID ${copiedUcpiId} copied. Paste it in the search to pay.`}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        ContentProps={{
          sx: { backgroundColor: "green", color: "white" },
        }}
      />
    </Box>
  );
};

export default RecentActivity;
