import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Avatar,
  Card,
  IconButton,
  TextField,
  CircularProgress,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SearchIcon from "@mui/icons-material/Search";
import axiosInstance from "../utils/axios";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const SearchVerifiedDetails = () => {


  // Function to handle search on each character entry


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
      <Box display="flex" alignItems="center" width="100%" mb={2}>
        <IconButton sx={{ backgroundColor: "#e0e3e7" }} href="/">
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h6" sx={{ ml: 2, fontWeight: "bold" }}>
          Send Money to Any Bank A/c
        </Typography>
      </Box>

      {/* Search Input */}
      <Box display="flex" alignItems="center" sx={{ width: "100%", maxWidth: 400, mb: 3 }}>
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
      </Box>

      {/* Display Loading, Error, or User Data */}
      {loading && <CircularProgress />}
      {error && (
        <Typography color="error" align="center">
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
        >
          <Typography variant="h6" sx={{ mb: 1, fontWeight: "bold" }}>
            Verified Details
          </Typography>
          <Box display="flex" alignItems="center">
            <Avatar
              sx={{
                bgcolor: "#ffeb3b",
                width: 50,
                height: 50,
                marginRight: 2,
              }}
            >
              {userData.bankDetails.name.charAt(0).toUpperCase()}
            </Avatar>
            <Box>
              <Box display="flex" alignItems="center">
                <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                  {userData.bankDetails.name}
                </Typography>
                {userData.bankDetails.verified && (
                  <CheckCircleIcon sx={{ color: "blue", fontSize: 18, ml: 1 }} />
                )}
              </Box>
              <Typography variant="body2" sx={{ color: "#757575" }}>
                {userData.bankDetails.accountNumber} - {userData.bankDetails.ucpid}
              </Typography>
              <Typography variant="body2" sx={{ color: "#757575" }}>
                Bank A/c linked on UPI
              </Typography>
            </Box>
          </Box>
        </Card>
      )}
    </Box>
  );
};

export default SearchVerifiedDetails;
