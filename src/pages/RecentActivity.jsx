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
  Divider,
  CircularProgress,
  Snackbar,
  InputAdornment,
  Skeleton,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useLocation, useNavigate } from "react-router-dom";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import SearchIcon from "@mui/icons-material/Search";
import axiosInstance from "../utils/axios";
import VerifiedIcon from "@mui/icons-material/CheckCircle";
import { useDispatch, useSelector } from "react-redux";
import { clearReceiverData, fetchUserData } from "../stores/receiverSlice";

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
  const [loadingPaymentHistory, setLoadingPaymentHistory] = useState(true);
  const handleCardClick = () => {
    navigate(`/amount-entry/${userData.name}`, { state: { userData } });
  };

  const [snackbarMessage, setSnackbarMessage] = useState(""); 

  const handleCopyUcpiId = (contact) => {
    const ucpiId = contact.recipientOrSenderUcpiId;
    navigator.clipboard.writeText(ucpiId);
    setCopiedUcpiId(ucpiId);
    setSnackbarMessage(`UCPI ID ${copiedUcpiId} copied. Paste it in the search to pay.`); 

    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  useEffect(() => {
    if (searchInput) {
      dispatch(fetchUserData(searchInput));
    } else {
      dispatch(clearReceiverData());
    }
  }, [dispatch, searchInput]);

  useEffect(() => {
    if (userData && userData.ucpiId !== searchInput) {
      dispatch(clearReceiverData());
    }
  }, [searchInput, userData, dispatch]);

  useEffect(() => {
    const fetchPaymentHistory = async () => {
      setLoadingPaymentHistory(true); // Set loading to true before fetching
      try {
        const response = await axiosInstance.get("/user/getAllTransactions");
        if (response.data) {
          setRecentContacts(response.data);
        }
      } catch (error) {
        console.error("Error fetching payment history:", error);
      } finally {
        setLoadingPaymentHistory(false); // Set loading to false after fetching
      }
    };

    fetchPaymentHistory();
  }, []);

  const handleInvalidUpiClick = () => {
    setSnackbarMessage("Invalid UPI ID"); 
    setSnackbarOpen(true); 
  };

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
      {/* Header */}
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
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
        <IconButton
          sx={{ backgroundColor: "#e0e3e7" }}
          onClick={() => navigate("/recent-activity", { state: { amount } })}
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
          p: 3,
          borderRadius: 4,
          boxShadow: "none",
          backgroundColor: "#f9f9fb",
          textAlign: "left",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            mb: 2,
            color: "#333",
            fontWeight: "bold",
          }}
        >
          Enter UCPI ID
        </Typography>
        <TextField
          fullWidth
          placeholder="Enter UCPI ID or Mobile Number"
          variant="outlined"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  sx={{ backgroundColor: "#e0e0e0", borderRadius: "50%" }}
                >
                  <SearchIcon sx={{ color: "#555" }} />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 8,
            },
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "#ccc",
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "#999",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "#1976d2",
            },
          }}
        />
      </Card>


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
                    <VerifiedIcon fontSize="small" />
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

      {!userData && searchInput && !loading && (
        <Card
          sx={{
            width: "100%",
            maxWidth: 350,
            mt: 2,
            p: 2,
            borderRadius: 4,
            boxShadow: 3,
            backgroundColor: "#ffffff",
          }}
          onClick={handleInvalidUpiClick}
        >
          <Box display="flex" alignItems="center">
            <Avatar sx={{ bgcolor: "#A32CC4", mr: 2, width: 46, height: 46 }}>
              {searchInput.charAt(0).toUpperCase()}
            </Avatar>
            <Box>
              <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                New UPI ID
              </Typography>
              <Typography variant="body2">{searchInput}</Typography>
            </Box>
          </Box>
        </Card>
      )}

      {loadingPaymentHistory ? (
        <Box mt={2} width="100%" maxWidth={400}>
          {/* Skeleton Loader for User Card */}
          <Skeleton
            variant="rectangular"
            height={80}
            sx={{ mb: 2, borderRadius: 2 }}
          />

          {/* Skeleton Loader for Pay Again Section */}
          <Skeleton variant="text" sx={{ mb: 2, width: "60%" }} />
          <Grid container spacing={2}>
            {[...Array(6)].map((_, index) => (
              <Grid item xs={4} key={index}>
                <Skeleton variant="circular" width={60} height={60} />
                <Skeleton variant="text" sx={{ mt: 1, width: "80%" }} />
              </Grid>
            ))}
          </Grid>

          {/* Skeleton Loader for Recent Activity Section */}
          <Skeleton variant="text" sx={{ mt: 3, mb: 2, width: "60%" }} />
          {[...Array(3)].map((_, index) => (
            <Box key={index} display="flex" alignItems="center" mb={2}>
              <Skeleton
                variant="circular"
                width={40}
                height={40}
                sx={{ mr: 2 }}
              />
              <Box width="100%">
                <Skeleton variant="text" width="80%" />
                <Skeleton variant="text" width="40%" />
              </Box>
            </Box>
          ))}
        </Box>
      ) : (
        <>
          {/* Render User Card if Data is Available */}

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
            <Typography
              variant="h6"
              align="left"
              sx={{ mb: 2, fontWeight: "bold" }}
            >
              Pay Again
            </Typography>
            <Grid container spacing={2} justifyContent="center">
              {recentContacts.slice(0, 6).map((contact, index) => (
                <Grid item xs={4} key={index}>
                  <Box
                    textAlign="center"
                    alignItems="center"
                    display="flex"
                    flexDirection="column"
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
              align="left"
              sx={{ mb: 2, fontWeight: "bold" }}
            >
              Recent Activity
            </Typography>
            <List>
              {recentContacts.slice(0, 6).map((transaction, index) => (
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
                          <Typography
                            variant="body1"
                            sx={{ fontWeight: "bold" }}
                          >
                            {transaction.recipientOrSenderName}
                          </Typography>
                          <Typography
                            variant="body1"
                            sx={{
                              fontWeight: "bold",
                              color: transaction.credit >= 0 ? "green" : "red",
                            }}
                          >
                            {transaction.credit}
                          </Typography>
                        </Box>
                      }
                      secondary={
                        <Box
                          display="flex"
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <Typography
                            variant="body2"
                            sx={{ color: "#757575", fontSize: 12 }}
                          >
                            {new Date(transaction.updatedAt).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                                hour: "numeric",
                                minute: "numeric",
                              }
                            )}
                          </Typography>

                          <Box display="flex" alignItems="center" gap={1}>
                            <img
                              src={transaction?.recipientOrSenderBankLogo}
                              style={{ height: "25px", width: "25px" }}
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
        </>
      )}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        

        message={snackbarMessage}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        ContentProps={{
          sx: { backgroundColor: "#333", color: "white" },
        }}
      />
    </Box>
  );
};

export default RecentActivity;
