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
import img2 from "../assets/nodp2.jpg";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useNavigate } from "react-router";

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
    {
      name: "Tushar",
      transaction: "Paid at 7:30PM",
      amount: "300",
      from: "ICON",
    },
    {
      name: "Peter",
      transaction: "Paid at 6:30PM",
      amount: "800",
      from: "ICON",
    },
    {
      name: "Rama",
      transaction: "Received at 4:00PM",
      amount: "1000",
      from: "ICON",
    },
  ];

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
        <Avatar src={img2} alt="Avatar" sx={{ width: 50, height: 50 }} />
        <Box sx={{ textAlign: "center", flexGrow: 1 }}>
          <Typography variant="h6">Ashwini</Typography>
          <Typography variant="body2" color="textSecondary">
            UCPI-ID: 12345
          </Typography>
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
          boxShadow: 3,
          backgroundColor: "#ffffff",
        }}
      >
        <Typography variant="h6" align="center" sx={{ mb: 2 }}>
          UCPI Money Transfers
        </Typography>
        <Grid container spacing={2} justifyContent="center">
          <Grid item>
            <Button
              variant="contained"
              onClick={handleNavigation}
              startIcon={<QrCodeScannerIcon />}
              sx={{
                backgroundColor: "#1976d2",
                color: "#fff",
                borderRadius: "8px",
                padding: "10px 15px",
                fontWeight: "bold",
                "&:hover": { backgroundColor: "#115293" },
              }}
            >
              SCAN & PAY
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              onClick={handleNavigation}
              startIcon={<AccountBalanceWalletIcon />}
              sx={{
                backgroundColor: "#1976d2",
                color: "#fff",
                borderRadius: "8px",
                padding: "10px 15px",
                fontWeight: "bold",
                "&:hover": { backgroundColor: "#115293" },
              }}
            >
              PAY TO UPI ID
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              onClick={handleNavigation}
              startIcon={<AccountBalanceIcon />}
              sx={{
                backgroundColor: "#1976d2",
                color: "#fff",
                borderRadius: "8px",
                padding: "10px 15px",
                fontWeight: "bold",
                "&:hover": { backgroundColor: "#115293" },
              }}
            >
              BANK TRANSFER
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              onClick={handleNavigation}
              startIcon={<SettingsIcon />}
              sx={{
                backgroundColor: "#1976d2",
                color: "#fff",
                borderRadius: "8px",
                padding: "10px 15px",
                fontWeight: "bold",
                "&:hover": { backgroundColor: "#115293" },
              }}
            >
              MANAGE BANK
            </Button>
          </Grid>
        </Grid>
      </Card>

      {/* Payment History Section */}
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
          Payment History
        </Typography>
        <Box display="flex" alignItems="center" mb={2}>
          <TextField
            placeholder="Search by Amount"
            variant="outlined"
            size="small"
            fullWidth
          />
          <IconButton sx={{ ml: 1 }}>
            <Search />
          </IconButton>
          <IconButton>
            <ArrowDownward />
          </IconButton>
        </Box>
        <List>
          {paymentHistory.map((transaction, index) => (
            <React.Fragment key={index}>
              <ListItem>
                <ListItemText
                  primary={`${transaction.name} - ${transaction.transaction}`}
                  secondary={`Amount: ${transaction.amount} | From: ${transaction.from}`}
                />
              </ListItem>
              {index < paymentHistory.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      </Card>
    </Box>
  );
};

export default Dashboard;
