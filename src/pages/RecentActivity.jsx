import React, { useState } from "react";
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
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useNavigate } from "react-router-dom";

const recentContacts = [
  { name: "Rahul", date: "Today", amount: "+70" },
  { name: "Priya", date: "Yesterday", amount: "-50" },
  { name: "Vijay", date: "2 days ago", amount: "+120" },
  { name: "Karan", date: "4 days ago", amount: "-200" },
  { name: "Simran", date: "Last week", amount: "+300" },
  { name: "Anjali", date: "Last month", amount: "+150" },
];

const RecentActivity = () => {
  const [ucpiID, setUcpiID] = useState("");
  const navigate = useNavigate();

  const handleContactClick = (name) => {
    navigate(`/amount-entry/${name}`);
  };

  const handleUCPIInputSubmit = () => {
    if (ucpiID) {
      navigate(`/amount-entry/${ucpiID}`);
    }
  };

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
          placeholder="Enter UCPI ID"
          variant="outlined"
          value={ucpiID}
          onChange={(e) => setUcpiID(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleUCPIInputSubmit()}
          sx={{ mb: 2 }}
        />
      </Card>

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
            <Grid item xs={4} key={index} textAlign="center">
              <IconButton
                sx={{ backgroundColor: "#e0f7fa", width: 60, height: 60 }}
                onClick={() => handleContactClick(contact.name)}
              >
                <AccountCircleIcon fontSize="large" />
              </IconButton>
              <Typography variant="body2" mt={1}>
                {contact.name}
              </Typography>
            </Grid>
          ))}
        </Grid>
      </Card>

      {/* Recent Activity Section */}
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
          Recent Activity
        </Typography>
        <List>
          {recentContacts.map((activity, index) => (
            <React.Fragment key={index}>
              <ListItem>
                <ListItemAvatar>
                  <Avatar>
                    <AccountCircleIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={activity.name}
                  secondary={activity.date}
                />
                <Typography
                  variant="body2"
                  color={activity.amount.startsWith("+") ? "green" : "red"}
                >
                  {activity.amount}
                </Typography>
              </ListItem>
              {index < recentContacts.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      </Card>
    </Box>
  );
};

export default RecentActivity;
