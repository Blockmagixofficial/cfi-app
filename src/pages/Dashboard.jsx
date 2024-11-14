import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  Avatar,
  Card,
  IconButton,
  TextField,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemText,
  Modal,
} from "@mui/material";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import { Close as CloseIcon } from "@mui/icons-material";
import { Scanner } from "@yudiel/react-qr-scanner";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import PersonIcon from "@mui/icons-material/Person";
import img1 from "../assets/qrc.png";
import img2 from "../assets/contact.png";
import img3 from "../assets/bank.png";
import img4 from "../assets/ucpi.png";
import SearchIcon from "@mui/icons-material/Search";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import img5 from "../assets/001.jpg";
import img6 from "../assets/002.jpg";
import img7 from "../assets/003.jpg";
import axiosInstance from "../utils/axios";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { clearReceiverData, fetchUserData } from "../stores/receiverSlice";

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.user.userInfo);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showScanner, setShowScanner] = useState(false);
  const { userData, error } = useSelector((state) => state.receiver);

  const handleScan = (data) => {
    if (data) {
      console.log("Scanned Data:", data); 
      if (data === userInfo?.ucpiId) {
        console.log("UCPI ID is correct:", data);

        // Fetch user data with the valid UCPI ID
        dispatch(fetchUserData(data))
          .then(() => console.log("Fetched user data successfully."))
          .catch((err) => console.error("Error fetching user data:", err));

        setShowScanner(false); // Close scanner after a successful scan
      } else {
        console.error("Scanned data does not match UCPI ID.");
        alert("Invalid UCPI ID. Please try again.");
      }
    }
  };

  const handleCloseScanner = () => {
    setShowScanner(false);
    dispatch(clearReceiverData());
  };

  const handleNavigation = () => {
    navigate("/recent-activity");
  };

  const handleProfile = () => {
    navigate("/profile");
  };


  const handleCheckBalance = () => {
    navigate("/check-balance");
  };
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrow: false,
  };

  useEffect(() => {
    const fetchPaymentHistory = async () => {
      try {
        const response = await axiosInstance.get("/user/getAllTransactions");
        if (response.data && response.data) {
          setPaymentHistory(response.data);
        }
      } catch (error) {
        console.error("Error fetching payment history:", error);
      }
    };

    fetchPaymentHistory();
  }, []);

  // Filtered payment history based on search term
  const filteredPaymentHistory = paymentHistory.filter((transaction) =>
    transaction.recipientOrSenderName
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

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
        {/* Profile Info */}
        <Box display="flex" alignItems="center" gap={2} onClick={handleProfile}>
          <Avatar
            src={userInfo?.profileUrl}
            alt="Avatar"
            sx={{ width: 50, height: 50 }}
          />
          <Box>
            <Typography variant="h6" color="black">
              {userInfo?.name || "Add Address"}
            </Typography>
            <Typography
              variant="body2"
              color="textSecondary"
              sx={{ color: "black" }}
            >
              {userInfo?.ucpiId || "Ambejogai Subdistrict"}
            </Typography>
          </Box>
        </Box>

        {/* Icons for Help and QR Code Scanner */}
        <Box display="flex" alignItems="center" gap={2}>
        
          <IconButton onClick={() => setShowScanner(true)}>
            <QrCodeScannerIcon sx={{ color: "black" }} />
          </IconButton>
        </Box>

        {/* QR Code Scanner in Modal */}
        <Modal
          open={showScanner}
          onClose={handleCloseScanner}
          aria-labelledby="qr-scanner-modal"
          aria-describedby="qr-scanner-to-scan-ucpi-id"
        >
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100vh"
            bgcolor="rgba(0, 0, 0, 0.8)"
          >
            <Box
              sx={{
                width: "90%",
                maxWidth: 400,
                p: 2,
                bgcolor: "white",
                borderRadius: 2,
                textAlign: "center",
                position: "relative",
              }}
            >
              <IconButton
                onClick={handleCloseScanner}
                sx={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  color: "gray",
                }}
              >
                <CloseIcon />
              </IconButton>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Scan UCPI ID
              </Typography>
              <Scanner
                onDecode={handleScan}
                onError={(err) =>
                  console.error("Error scanning QR code: ", err)
                }
                style={{ width: "100%" }}
              />
              <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
                QR code within the frame to scan
              </Typography>
            </Box>
          </Box>
        </Modal>

        {/* Display Fetched User Data */}
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
                  <strong>{userData.ucpiId}</strong> -{" "}
                  {userData.bankDetails.name}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {userData.bankDetails.bankName} - Linked on UPI
                </Typography>
              </Box>
            </Box>
          </Card>
        )}

        {/* Error Handling */}
        {error && (
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
          >
            <Typography variant="body2" color="error">
              {error}
            </Typography>
          </Card>
        )}
      </Box>

      {/* Welcome Message */}

      {/* Slider Section */}
      <Slider
        {...sliderSettings}
        style={{ width: "100%", maxWidth: 350, marginTop: 20 }}
      >
        {[img5, img6, img7].map((imgSrc, index) => (
          <Box
            key={index}
            sx={{
              position: "relative",
              borderRadius: 2,
              overflow: "hidden",
              boxShadow: 3,
              "& img": {
                width: "100%",
                height: "15vh",
                borderRadius: 2,
              },
            }}
          >
            <img src={imgSrc} alt={`banner-${index + 1}`} />

            {/* Overlay with Text */}
          </Box>
        ))}
      </Slider>

      {/* UCPI Money Transfer Options */}
      <Card
        sx={{
          width: "100%",
          maxWidth: 350,
          mt: 3,
          p: 2,
          borderRadius: 4,
          backgroundColor: "#ffffff",
        }}
      >
        <Typography
          variant="h6"
          align="left"
          sx={{ mb: 2, fontWeight: "bold" }}
        >
          UCPI Money Transfers
        </Typography>
        <Grid container spacing={2} justifyContent="center">
          <Grid item>
            <Box
              onClick={handleNavigation}
              sx={{
                display: "flex",
                flexDirection: "column",
                color: "#1976d2",
                textAlign: "center",
              }}
            >
              <img src={img1} style={{ width: "65px" }} />
              <Typography variant="body2">
                Scan & <br /> Pay
              </Typography>
            </Box>
          </Grid>
          <Grid item>
            <Box
              onClick={handleNavigation}
              sx={{
                display: "flex",
                flexDirection: "column",
                color: "#1976d2",
                textAlign: "center",
              }}
            >
              <img src={img2} style={{ width: "65px" }} />
              <Typography variant="body2">
                Pay <br /> Contact
              </Typography>
            </Box>
          </Grid>
          <Grid item>
            <Box
              onClick={handleCheckBalance}
              sx={{
                display: "flex",
                flexDirection: "column",
                color: "#1976d2",
                textAlign: "center",
              }}
            >
              <img src={img3} style={{ width: "65px" }} />
              <Typography variant="body2">
                Bank <br /> Balance
              </Typography>
            </Box>
          </Grid>
          <Grid item>
            <Box
              onClick={handleNavigation}
              sx={{
                display: "flex",
                flexDirection: "column",
                color: "#1976d2",
                textAlign: "center",
              }}
            >
              <img src={img4} style={{ width: "65px" }} />
              <Typography variant="body2">
                Pay <br />
                UCPI ID
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Card>

      {/* Payment History Section */}
      <Box
        sx={{
          width: "100%",
          maxWidth: 350,
          mt: 3,
          p: 2,
          bottom: 0,
          mb: 0,
          borderRadius: 4,
          backgroundColor: "#ffffff",
        }}
      >
        <Typography
          variant="h6"
          align="left"
          sx={{ mb: 2, fontWeight: "bold" }}
        >
          Payment History
        </Typography>
        <Box
          display="flex"
          alignItems="center"
          mb={2}
          sx={{ border: "1px solid #e0e0e0", borderRadius: 1, p: 0.5 }}
        >
          <TextField
            placeholder="Search by Amount"
            variant="outlined"
            size="small"
            fullWidth
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              disableUnderline: true,
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  border: "none",
                },
              },
            }}
          />
          <IconButton>
            <SearchIcon />
          </IconButton>
          <IconButton>
            <ArrowDownwardIcon
              sx={{
                border: "1px solid #000",
                borderRadius: "50%",
                padding: "3px",
              }}
            />
          </IconButton>
        </Box>
        <List>
          {filteredPaymentHistory.map((transaction, index) => (
            <React.Fragment key={index}>
              <ListItem disableGutters sx={{ paddingY: 1 }}>
                <Avatar
                  src={transaction?.recipientOrSenderProfile || ""}
                  sx={{ marginRight: 2, backgroundColor: "skyblue" }}
                >
                  {!transaction?.recipientOrSenderProfile && <PersonIcon />}
                </Avatar>

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

                      <Box display={"flex"} alignItems={"center"} gap={1}>
                        <img
                          src={transaction?.bankUsedLogo}
                          style={{ height: "25px", width: "25px" }}
                        />
                      </Box>
                    </Box>
                  }
                />
              </ListItem>
              {index < paymentHistory.length - 1 && (
                <Divider sx={{ marginX: 2, backgroundColor: "#e0e0e0" }} />
              )}
            </React.Fragment>
          ))}
        </List>
      </Box>
    </Box>
  );
};

export default Dashboard;
