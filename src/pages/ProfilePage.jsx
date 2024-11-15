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

  const shareQRCodeOnWhatsApp = async () => {
    const qrElement = document.getElementById("qrCode");

    if (qrElement && navigator.share) {
      try {
        // Capture the QR code as a canvas image
        const canvas = await html2canvas(qrElement, { useCORS: true });
        const imageDataUrl = canvas.toDataURL("image/png");

        // Convert the Base64 image data to a Blob
        const response = await fetch(imageDataUrl);
        const blob = await response.blob();

        // Create a File object from the Blob
        const file = new File([blob], "QRCode.png", { type: "image/png" });

        // Text message to accompany the QR code
        const textMessage = `Here's your UCPI QR code for receiving payments:\n\nUCPI ID: ${userInfo?.ucpiId}`;

        // Open the native share dialog with the text and file
        await navigator.share({
          title: "UCPI QR Code",
          text: textMessage,
          files: [file], // Attach the image file
        });
      } catch (error) {
        console.error("Error sharing QR code on WhatsApp:", error);
      }
    } else {
      alert("Sharing not supported on this device.");
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
      <Box
        display="flex"
        alignItems="center"
        p={2}
        sx={{ backgroundColor: "#F0F0F5", borderRadius: 2, mb: 2, mt: 4 }}
      >
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

      <Box
        display="flex"
        alignItems="center"
        p={2}
        sx={{ backgroundColor: "#F0F0F5", borderRadius: 2, mb: 2, mt: 4 }}
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
        sx={{ backgroundColor: "#F0F0F5", borderRadius: 2, mb: 2 }}
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
        <Box id="qrCode" mt={2}>
          <QRCodeSVG value={userInfo?.ucpiId} size={150} level="H" />
        </Box>

        {/* Share on WhatsApp Button */}
        <Button variant="contained" color="primary" onClick={shareQRCodeOnWhatsApp} sx={{ mt: 2 }}>
          Share QR Code on WhatsApp
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
