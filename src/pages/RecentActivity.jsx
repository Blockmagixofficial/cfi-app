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
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useNavigate } from "react-router-dom";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import SearchIcon from "@mui/icons-material/Search";
import axiosInstance from "../utils/axios";
import VerifiedIcon from "@mui/icons-material/CheckCircle"; // For verified icon

const recentContacts = [
  {
    name: "Vashi Akhtar",
    transactionTime: "Today, 02:36 PM",
    amount: -80,
    from: "Axis",
    iconColor: "#90caf9",
  },
  {
    name: "Peter Johnson",
    transactionTime: "Yesterday, 01:15 PM",
    amount: -150,
    from: "HDFC",
    iconColor: "#ffcc80",
  },
  {
    name: "Rama Devi",
    transactionTime: "02 Nov, 10:00 AM",
    amount: 200,
    from: "SBI",
    iconColor: "#c5e1a5",
  },
  {
    name: "Simran Kaur",
    transactionTime: "3 Nov, 05:00 PM",
    amount: 300,
    from: "ICICI",
    iconColor: "#ffab91",
  },
  {
    name: "Anil Kumar",
    transactionTime: "Last week",
    amount: -100,
    from: "Canara",
    iconColor: "#9fa8da",
  },
  {
    name: "Neha Singh",
    transactionTime: "Last month",
    amount: 150,
    from: "Union",
    iconColor: "#b39ddb",
  },
];
const RecentActivity = () => {
  const [ucpiID, setUcpiID] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  const [recentContacts, setRecentContacts] = useState([]);

  const handleCardClick = () => {
    navigate(`/amount-entry/${userData.name}`, { state: { userData } });
  };

  const handleUCPIInputSubmit = (contact) => {
    navigate(`/amount-entry/${contact.recipientOrSenderName.slice(0, 4)}`, {
      state: { contact },
    });
  };

  useEffect(() => {
    if (searchInput) {
      setLoading(true);
      setError(null);
      setUserData(null); // Clear previous data

      const fetchUserData = async () => {
        try {
          const response = await axiosInstance.get(
            `/user/userByUcpiId/${searchInput}`
          );

          // Check if response is null
          if (response.data === null) {
            setError(
              "User bank details not found. Please check and try again."
            );
          } else {
            setUserData(response.data); // Store the response data if found
          }
        } catch (err) {
          setError("An error occurred. Please try again.");
        } finally {
          setLoading(false);
        }
      };

      fetchUserData();
    } else {
      setUserData(null);
      setError(null);
    }
  }, [searchInput]);

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
        <IconButton sx={{ backgroundColor: "#e0e3e7" }} href="/">
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
              sx={{ bgcolor: "#FFD700", mr: 2, width: 56, height: 56 }}
            >
              {!userData?.profileUrl && userData.name.charAt(0)}{" "}
            </Avatar>
            <Box>
              <Box display="flex" alignItems="center">
                <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                  {userData.bankDetails.name}
                </Typography>
                {userData.bankDetails.verified && (
                  <IconButton sx={{ ml: 1, color: "blue" }}>
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
            <Grid
              item
              xs={4}
              key={index}
              onClick={() => handleUCPIInputSubmit(contact)}
            >
              <Box
                textAlign="center"
                alignItems={"center"}
                justifyContent={"center"}
                display={"flex"}
                flexDirection={"column"}
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
    </Box>
  );
};

export default RecentActivity;
