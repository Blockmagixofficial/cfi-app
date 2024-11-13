import React from "react";
import { Box, Button, Typography, IconButton, Avatar } from "@mui/material";
import { ArrowBackIos, HelpOutline, ArrowForwardIos, Logout } from "@mui/icons-material";
import { QRCodeSVG } from "qrcode.react";
import html2canvas from "html2canvas";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearUser } from "../stores/userSlice";

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

  const isMobileDevice = () => {
    return /Mobi|Android/i.test(navigator.userAgent);
  };

  const shareQRCode = async () => {
    const qrElement = document.getElementById("qrCode");

    if (qrElement) {
      const canvas = await html2canvas(qrElement);
      const imageDataUrl = canvas.toDataURL("image/png");
      const blob = await (await fetch(imageDataUrl)).blob();
      const file = new File([blob], "QRCode.png", { type: "image/png" });
      const message = `Here's my UCPI ID QR Code for receiving money!`;

      try {
        if (navigator.share && isMobileDevice()) {
          // If on mobile and Web Share API is supported, use native share
          await navigator.share({
            title: "UCPI QR Code",
            text: message,
            files: [file],
          });
        } else {
          // If on desktop, share via WhatsApp Web
          const whatsappURL = `https://web.whatsapp.com/send?text=${encodeURIComponent(
            message
          )}`;
          window.open(whatsappURL, "_blank");
        }
      } catch (error) {
        console.error("Error sharing:", error);
        alert("Failed to share the QR code.");
      }
    }
  };

  return (
    <Box sx={{ backgroundColor: "white", minHeight: "80vh" }}>
      {/* Header */}
      <Box display="flex" alignItems="center" justifyContent="space-between" p={1}>
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
      <Box display="flex" alignItems="center" p={2} sx={{ backgroundColor: "#F0F0F5", borderRadius: 2, mb: 2, mt: 4 }}>
        <Avatar src={userInfo?.profileUrl} alt="Avatar" sx={{ width: 60, height: 60, mr: 2 }} />
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

      <Box display="flex" alignItems="center" p={2} sx={{ backgroundColor: "#F0F0F5", borderRadius: 2, mb: 2, mt: 4 }} onClick={handlePinSetup}>
        <Typography>SetUp MPIN For Transaction</Typography>
        <IconButton sx={{ marginLeft: "auto", color: "#191970" }}>
          <ArrowForwardIos />
        </IconButton>
      </Box>

      {/* Receive Money Section */}
      <Box display="flex" flexDirection="column" alignItems="center" p={2} sx={{ backgroundColor: "#F0F0F5", borderRadius: 2, mb: 2 }}>
        <Box>
          <Typography variant="subtitle1" color="#191970">
            Receive Money
          </Typography>
          <Typography variant="body2" color="#595959">
            UCPI ID: {userInfo?.ucpiId}
          </Typography>
        </Box>

        {/* QR Code for UCPI ID */}
        <Box id="qrCode" mt={2}>
          <QRCodeSVG value={userInfo?.ucpiId} size={150} level="H" />
        </Box>

        {/* Share on WhatsApp Button */}
        <Button variant="contained" color="primary" onClick={shareQRCode} sx={{ mt: 2 }}>
          Share QR Code
        </Button>
      </Box>

      {/* Logout Section */}
      <Box display="flex" alignItems="center" p={2} sx={{ backgroundColor: "#F0F0F5", borderRadius: 2 }}>
        <Logout sx={{ color: "#FF5A5F", mr: 1 }} />
        <Button sx={{ color: "#FF5A5F" }} onClick={handleLogout}>
          LOGOUT
        </Button>
      </Box>
    </Box>
  );
}
