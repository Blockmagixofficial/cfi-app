import { Box, Button, Typography } from '@mui/material';
import React from 'react';
import { useNavigate,useLocation } from 'react-router';
import img from "../assets/nodp.jpg";
import img2 from "../assets/nodp2.jpg";
import ActionAreaCard from '../components/Card';
import logo from "../assets/logo.png"
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
    const responseData = location.state?.data.data;
    // console.log(responseData,"****")
    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    // Select a random bank entry
    const randomBank = banks[Math.floor(Math.random() * banks.length)];

    return (
        <Box sx={{
            display: "grid",
            placeItems: "center"
        }}
        >
            <Box display={"flex"} justifyContent={"space-around"} alignItems={"center"} gap={10} m={2}>
                <img src={logo} alt={"logo"} height={50} width={50}/>
                <Button onClick={handleLogout} sx={{ border: "1px solid red",padding:1 }}>Log out</Button>
            </Box>
            <ActionAreaCard 
                email={responseData.emailId} 
                id={responseData.userName} 
                image={img2} 
                bankName={randomBank.bankName} 
                accountNo={randomBank.accountNo} 
            />
            <Box>
                <Button
                 sx={{
                    border: "1px solid skyblue",
                    margin:2,
                    padding:1
                }}
                onClick={()=>navigate("/transaction")}>Pay Money</Button>
            </Box>
        </Box>
    );
};

export default Dashboard;
