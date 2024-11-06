import { Box, Button, Typography, Avatar, Card, CardContent } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import img2 from "../assets/nodp2.jpg";
import logo from "../assets/logo.png";

const banks = [
    { bankName: "State Bank of India", accountNo: "1234*****890" },
    { bankName: "HDFC Bank", accountNo: "5678*****123" },
    { bankName: "ICICI Bank", accountNo: "478*****120" },
    { bankName: "Bank of Baroda", accountNo: "1357*****246" },
    { bankName: "Punjab National Bank", accountNo: "2468*****135" },
    { bankName: "Bank of America", accountNo: "9876*****543" },
    { bankName: "Wells Fargo", accountNo: "8765*****432" },
    { bankName: "Chase Bank", accountNo: "7654*****321" },
    { bankName: "Citibank", accountNo: "6543*****210" },
    { bankName: "Goldman Sachs", accountNo: "5432*****109" }
];

const Dashboard = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [responseData, setResponseData] = useState(null);

    useEffect(() => {
        // Check if location.state exists
        const data = location.state?.data?.data;

        if (data) {
            // Store data in localStorage if available
            localStorage.setItem("responseData", JSON.stringify(data));
            setResponseData(data);
        } else {
            // Retrieve from localStorage if location.state is not available
            const storedData = localStorage.getItem("responseData");
            if (storedData) {
                setResponseData(JSON.parse(storedData));
            }
        }
    }, [location.state]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("responseData"); // Clear stored responseData on logout
        navigate("/");
    };

    const randomBank = banks[Math.floor(Math.random() * banks.length)];

    if (!responseData) {
        // Optional: Redirect to login or display a message if no responseData is found
        return <Typography>Loading...</Typography>;
    }

    return (
        <Box sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: 2,
            backgroundColor: "#f0f2f5",
            minHeight: "100vh"
        }}>
            {/* Header with Logo and Logout Button */}
            <Box display={"flex"} justifyContent={"space-between"} alignItems={"center"} width="100%" p={2}>
                <img src={logo} alt={"logo"} height={50} width={50} />
                <Button onClick={handleLogout} variant="outlined" color="error" sx={{ borderRadius: "20px", padding: "8px 16px" }}>
                    Log out
                </Button>
            </Box>

            {/* Profile Card */}
            <Card sx={{
                width: "100%",
                maxWidth: 400,
                marginTop: 2,
                padding: 2,
                borderRadius: 4,
                boxShadow: 3,
                backgroundColor: "#ffffff",
                textAlign: "center"
            }}>
                <Avatar
                    src={img2}
                    alt="Profile Picture"
                    sx={{ width: 80, height: 80, margin: "0 auto" }}
                />
                <CardContent>
                    <Typography variant="h6" sx={{ marginTop: 1 }}>
                        {responseData.userName}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        {responseData.emailId}
                    </Typography>
                    <Box sx={{ marginTop: 2, textAlign: "left" }}>
                        <Typography variant="subtitle2" color="textSecondary">
                            Bank Name:
                        </Typography>
                        <Typography variant="body1">
                            {randomBank.bankName}
                        </Typography>
                        <Typography variant="subtitle2" color="textSecondary" sx={{ marginTop: 1 }}>
                            Account Number:
                        </Typography>
                        <Typography variant="body1">
                            {randomBank.accountNo}
                        </Typography>
                    </Box>
                </CardContent>
            </Card>

            {/* Pay Money Button */}
            <Box sx={{ marginTop: 4, width: "100%", maxWidth: 400 }}>
                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={() => navigate("/transaction")}
                    sx={{
                        borderRadius: "20px",
                        padding: "12px 0",
                        fontSize: "16px",
                        boxShadow: 3,
                        backgroundColor: "#1976d2",
                        '&:hover': { backgroundColor: "#1565c0" }
                    }}
                >
                    Pay Money
                </Button>
            </Box>
        </Box>
    );
};

export default Dashboard;
