import React from "react";
import { Box, Avatar, Typography, IconButton, Button } from "@mui/material";
import {
  Logout,
  ArrowForwardIos,
  HelpOutline,
  ArrowBackIos,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { clearUser } from "../stores/userSlice";
import { QRCodeSVG } from "qrcode.react";

export default function ProfilePage() {
  const userInfo = useSelector((state) => state.user.userInfo);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleBack = () => {
    navigate("/dashboard");
  };

  const handlePinSetup = () => {
    navigate("/pin-setup");
  };
  const handleLogout = () => {
    localStorage.clear();
    dispatch(clearUser());
    navigate("/signin");
  };

  return (
    <Box sx={{ backgroundColor: "white", minHeight: "80vh" }}>
      {/* Header */}
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        p={1}
      >
        <Box display="flex" alignItems="center">
          <IconButton onClick={handleBack}>
            <ArrowBackIos sx={{ color: "#191970" }} />
          </IconButton>
          <Typography variant="h6" color="#191970">
            Profile and Payments
          </Typography>
        </Box>
        <IconButton>
          <HelpOutline sx={{ color: "#191970" }} />
        </IconButton>
      </Box>

   
      {/* Profile Section */}
      <Box
        display="flex"
        alignItems="center"
        p={2}
        sx={{
          backgroundColor: "#F0F0F5",
          borderRadius: 2,
          mb: 2,
          mt: 4,
        }}
      >
        <Avatar
          src={userInfo?.profileUrl}
          alt="Avatar"
          sx={{ width: 60, height: 60, mr: 2 }}
        />
        <Box>
          <Typography variant="h6" color="#191970">
            {userInfo?.name || "Ashwini Nagargoje"}
          </Typography>
          <Typography variant="body2" color="#595959">
            {userInfo?.emailId}
          </Typography>
        </Box>
        <IconButton sx={{ marginLeft: "auto", color: "#191970" }}>
          <ArrowForwardIos />
        </IconButton>
      </Box>


      <Box
        display="flex"
        alignItems="center"
        p={2}
        sx={{
          backgroundColor: "#F0F0F5",
          borderRadius: 2,
          mb: 2,
          mt: 4,
        }}
        onClick={handlePinSetup}
      >
        <Typography>SetUp MPIN For Transaction</Typography>

        <IconButton sx={{ marginLeft: "auto", color: "#191970" }}>
          <ArrowForwardIos />
        </IconButton>
      </Box>
      {/* Receive Money Section */}
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        p={2}
        sx={{
          backgroundColor: "#F0F0F5",
          borderRadius: 2,
          mb: 2,
        }}
      >
        <Box>
          <Typography variant="subtitle1" color="#191970">
            Receive Money
          </Typography>
          <Typography variant="body2" color="#595959">
            UCPI ID: {userInfo?.ucpiId}
          </Typography>
        </Box>

        {/* QR Code for UCPI ID */}
        <Box mt={2}>
          <QRCodeSVG value={userInfo?.ucpiId} size={150} level="H" />,
        </Box>
      </Box>

      {/* Logout Section */}
      <Box
        display="flex"
        alignItems="center"
        p={2}
        sx={{
          backgroundColor: "#F0F0F5",
          borderRadius: 2,
        }}
      >
        <Logout sx={{ color: "#FF5A5F", mr: 1 }} />
        <Button sx={{ color: "#FF5A5F" }} onClick={handleLogout}>
          LOGOUT
        </Button>
      </Box>
    </Box>
  );
}
