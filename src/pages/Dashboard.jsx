import React from "react";
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
} from "@mui/material";
import { Search, ArrowDownward } from "@mui/icons-material";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import SettingsIcon from "@mui/icons-material/Settings";
import Slider from "react-slick";
import { css, keyframes } from "@emotion/react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import ContactPhoneIcon from "@mui/icons-material/ContactPhone";
import PersonIcon from "@mui/icons-material/Person";
import img1 from "../assets/qrc.png";
import img2 from "../assets/contact.png";
import img3 from "../assets/bank.png";
import img4 from "../assets/ucpi.png";
import SearchIcon from "@mui/icons-material/Search";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
// Animation for bounce effect
const bounce = keyframes`
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-8px);
  }
  60% {
    transform: translateY(-4px);
  }
`;

const Dashboard = () => {
  const navigate = useNavigate();
  const userInfo = useSelector((state) => state.user.userInfo);

  console.log("userInfo", userInfo);
  const handleNavigation = () => {
    navigate("/recent-activity");
  };

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };


  const paymentHistory = [
    { name: "Vashi Akhtar", transactionTime: "Today, 02:36 PM", amount: "- ₹80", from: "Axis", iconColor: "#90caf9" },
    { name: "Peter Johnson", transactionTime: "Yesterday, 01:15 PM", amount: "- ₹150", from: "HDFC", iconColor: "#ffcc80" },
    { name: "Rama Devi", transactionTime: "02 Nov, 10:00 AM", amount: "+ ₹200", from: "SBI", iconColor: "#c5e1a5" },
  ];

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: 2,
        pb:0,
        backgroundColor: "#f5f5f5",
        minHeight: "100%",
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
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar
            src={userInfo?.profileUrl}
            alt="Avatar"
            sx={{ width: 50, height: 50 }}
          />
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6">{userInfo?.name}</Typography>
            <Typography variant="body2" color="textSecondary">
              {userInfo?.ucpiId}
            </Typography>
          </Box>
        </Box>
        <IconButton>
          <Search />
        </IconButton>
      </Box>

      {/* Welcome Message */}
      <Typography
        variant="h4"
        sx={{ mt: 2, animation: `${bounce} 2s ease-in-out infinite` }}
      >
        Welcome to CFI
      </Typography>

      {/* Slider Section */}
      <Slider
        {...sliderSettings}
        style={{ width: "100%", maxWidth: 400, marginTop: 20 }}
      >
        <Box
          sx={{
            padding: 2,
            backgroundColor: "#1976d2",
            color: "#fff",
            borderRadius: 2,
            textAlign: "center",
            width: "100%",
            maxWidth: 340,
            margin: "0 auto",
          }}
        >
          <Typography sx={{ fontSize: 14, fontWeight: "bold" }}>
            Get a 10% Bonus on <br /> Your First Transfer
          </Typography>
        </Box>

        <Box
          sx={{
            padding: 2,
            backgroundColor: "#388e3c",
            color: "#fff",
            borderRadius: 2,
            textAlign: "center",
            width: "100%",
            maxWidth: 340,
            margin: "0 auto",
          }}
        >
          <Typography sx={{ fontSize: 14, fontWeight: "bold" }}>
            Refer a Friend and <br /> Earn Rewards
          </Typography>
        </Box>

        <Box
          sx={{
            padding: 2,
            backgroundColor: "#d32f2f",
            color: "#fff",
            borderRadius: 2,
            textAlign: "center",
            width: "100%",
            maxWidth: 340,
            margin: "0 auto",
          }}
        >
          <Typography sx={{ fontSize: 14, fontWeight: "bold" }}>
            Get Cashback on <br /> Every Transaction
          </Typography>
        </Box>
      </Slider>

      {/* UCPI Money Transfer Options */}
      <Card
        sx={{
          width: "100%",
          maxWidth: 400,
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
              <Typography variant="body2">Scan &  <br /> Pay</Typography>
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
              <Typography variant="body2">Pay <br /> Contact</Typography>
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
              <img src={img3} style={{ width: "65px" }} />
              <Typography variant="body2">Bank <br /> Transfer</Typography>
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
              <Typography variant="body2">Pay  <br />UCPI ID</Typography>
            </Box>
          </Grid>
        </Grid>
      </Card>

      {/* Payment History Section */}
      <Box
      sx={{
        width: "100%",
        maxWidth: 400,
        mt: 3,
        p: 2,
        bottom:0,
      mb:0,
        borderRadius: 4,
        backgroundColor: "#ffffff",
      }}
    >
      <Typography variant="h6" align="left" sx={{ mb: 2, fontWeight: "bold" }}>
        Payment History
      </Typography>
      <Box display="flex" alignItems="center" mb={2} sx={{ border: "1px solid #e0e0e0", borderRadius: 1, p: 0.5 }}>
        <TextField
          placeholder="Search by Amount"
          variant="outlined"
          size="small"
          fullWidth
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
          <ArrowDownwardIcon sx={{ border: "1px solid #000", borderRadius: "50%", padding: "3px" }} />
        </IconButton>
      </Box>
      <List>
        {paymentHistory.map((transaction, index) => (
          <React.Fragment key={index}>
            <ListItem disableGutters sx={{ paddingY: 1 }}>
              <Avatar sx={{ bgcolor: transaction.iconColor, marginRight: 2 }}>
                <AccountBalanceIcon />
              </Avatar>
              <ListItemText
                primary={
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                      {transaction.name}
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: "bold", color: transaction.amount.startsWith("-") ? "red" : "green" }}>
                      {transaction.amount}
                    </Typography>
                  </Box>
                }
                secondary={
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="body2" sx={{ color: "#757575" }}>
                      Paid {transaction.transactionTime}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#757575" }}>
                      From: {transaction.from}
                    </Typography>
                  </Box>
                }
              />
            </ListItem>
            {index < paymentHistory.length - 1 && <Divider sx={{ marginX: 2, backgroundColor: "#e0e0e0" }} />}
          </React.Fragment>
        ))}
      </List>
    </Box>
    </Box>
  );
};

export default Dashboard;
