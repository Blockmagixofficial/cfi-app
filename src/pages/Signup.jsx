import {
    Box,
    Typography,
    Snackbar,
    Alert,
    useMediaQuery,
    IconButton,
    Button,
  } from "@mui/material";
  import React, { useState } from "react";
  import MailOutlineIcon from "@mui/icons-material/MailOutline";
  import PersonIcon from "@mui/icons-material/Person";
  import LockIcon from "@mui/icons-material/Lock";
  import VisibilityIcon from "@mui/icons-material/Visibility";
  import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
  import { useLocation, useNavigate } from "react-router-dom";
  import axiosInstance from "../utils/axios";
  
  const Signup = () => {
    const location = useLocation();
    const isSignIn = location.pathname === "/signin";
    const navigate = useNavigate();
    const isMobile = useMediaQuery("(max-width:600px)");
  
    // State for password visibility
    const [showPassword, setShowPassword] = useState(false);
  
    // State for capturing form values
    const [formData, setFormData] = useState({
      fullName: "",
      email: "",
      password: "",
    });
  
    // Snackbar state
    const [snackbar, setSnackbar] = useState({
      open: false,
      message: "",
      severity: "success",
    });
  
    // Validation states
    const [passwordChecks, setPasswordChecks] = useState({
      hasUppercase: false,
      hasSpecialChar: false,
      isValidLength: false,
    });
  
    // Handle form input changes
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData({
        ...formData,
        [name]: value,
      });
  
      // If password input changes, validate the password
      if (name === "password") {
        validatePassword(value);
      }
    };
  
    // Validate password function
    const validatePassword = (password) => {
      setPasswordChecks({
        hasUppercase: /[A-Z]/.test(password),
        hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
        isValidLength: password.length > 6,
      });
    };
  
    // Generate a unique username
    const generateUniqueUsername = () => {
      const cleanedFullName = formData.fullName.replace(/\s+/g, "").toLowerCase();
      const randomNumber = Math.floor(Math.random() * 10000);
      return `${cleanedFullName}${randomNumber}`;
    };
  
    // Handle registration
    const handleRegister = async () => {
      const generatedUserName = generateUniqueUsername();
  
      try {
        const response = await axiosInstance.post("/user/signup", {
          step: 1,
          emailId: formData.email,
          userName: generatedUserName,
          firstName: formData.fullName,
          lastName: formData.fullName,
          password: formData.password,
        });
  
        if (response.data && response.data.success) {
          setSnackbar({
            open: true,
            message: "Sign up successful!",
            severity: "success",
          });
          setTimeout(() => {
            navigate("/signin");
          }, 2000);
        }
      } catch (err) {
        setSnackbar({
          open: true,
          message: "Sign up failed! Try again.",
          severity: "error",
        });
      }
    };
  
    // Handle login
    const handleLogin = async () => {
      try {
        const response = await axiosInstance.post("/user/web-login", {
          emailId: formData.email,
          password: formData.password,
        });
  
        if (response.data && response.data.success) {
          setSnackbar({
            open: true,
            message: "Login successful!",
            severity: "success",
          });
          localStorage.setItem("token", response.data.data.token);
          navigate("/dashboard", { state: { data: response.data } });
        } else {
          setSnackbar({
            open: true,
            message: "Login failed! Please try again.",
            severity: "error",
          });
        }
      } catch (err) {
        setSnackbar({
          open: true,
          message: "Login failed! Please try again.",
          severity: "error",
        });
      }
    };
  
    // Submit handler
    const handleSubmit = (e) => {
      e.preventDefault();
      if (isSignIn) {
        handleLogin();
      } else {
        handleRegister();
      }
    };
  
    const handleSignIn = (e) => {
      e.preventDefault();
      navigate("/signin");
    };
  
    const handleSignup = (e) => {
      e.preventDefault();
      navigate("/signup");
    };
  
    // Close Snackbar
    const handleCloseSnackbar = () => {
      setSnackbar({ ...snackbar, open: false });
    };
  
    return (
      <Box
        sx={{
          height: "90vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "20px",
        }}
      >
        <Box
          sx={{
            borderRadius: 4,
            boxShadow: 3,
            backgroundColor: "#ffffff",
            padding: "20px",
          }}
        >
          <Typography
            fontFamily={"Poppins, sans-serif"}
            fontSize={!isMobile ? "24px" : "20px"}
            fontWeight={700}
            textAlign="center"
            mb={1}
            color="#1976d2"
          >
            {isSignIn ? "Welcome Back!" : "Create Account"}
          </Typography>
          <Typography
            fontFamily={"Poppins, sans-serif"}
            fontSize={!isMobile ? "14px" : "12px"}
            fontWeight={500}
            textAlign="center"
            mb={3}
            color="gray"
          >
            {isSignIn ? "Log in to continue" : "Sign up to get started"}
          </Typography>
  
          {/* Full Name Input (for Signup) */}
          {!isSignIn && (
            <Box
              mb={2}
              display="flex"
              alignItems="center"
              sx={{
                border: "1px solid #ddd",
                borderRadius: "25px",
                padding: "10px",
              }}
            >
              <PersonIcon sx={{ color: "#1976d2", mr: 1 }} />
              <input
                type="text"
                placeholder="Full Name"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                style={{
                  backgroundColor: "transparent",
                  border: "none",
                  outline: "none",
                  width: "100%",
                  color: "#333",
                }}
              />
            </Box>
          )}
  
          {/* Email Input */}
          <Box
            mb={2}
            display="flex"
            alignItems="center"
            sx={{
              border: "1px solid #ddd",
              borderRadius: "25px",
              padding: "10px",
            }}
          >
            <MailOutlineIcon sx={{ color: "#1976d2", mr: 1 }} />
            <input
              type="email"
              placeholder="Email Address"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              style={{
                backgroundColor: "transparent",
                border: "none",
                outline: "none",
                width: "100%",
                color: "#333",
              }}
            />
          </Box>
  
          {/* Password Input */}
          <Box
            mb={2}
            display="flex"
            alignItems="center"
            sx={{
              border: "1px solid #ddd",
              borderRadius: "25px",
              padding: "10px",
            }}
          >
            <LockIcon sx={{ color: "#1976d2", mr: 1 }} />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              style={{
                backgroundColor: "transparent",
                border: "none",
                outline: "none",
                width: "100%",
                color: "#333",
              }}
            />
            <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
              {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
            </IconButton>
          </Box>
  
          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            fullWidth
            sx={{
              marginTop: "20px",
              padding: "12px",
              borderRadius: "25px",
              fontSize: "16px",
            }}
          >
            {isSignIn ? "Login" : "Register"}
          </Button>
  
          {/* Toggle Signup/Signin */}
          <Typography
            onClick={isSignIn ? handleSignup : handleSignIn}
            sx={{
              color: "#1976d2",
              textAlign: "center",
              marginTop: "15px",
              fontSize: "14px",
              cursor: "pointer",
            }}
          >
            {isSignIn
              ? "Not registered? Sign up here"
              : "Already have an account? Sign in here"}
          </Typography>
  
          {/* Snackbar for feedback */}
          <Snackbar
            open={snackbar.open}
            autoHideDuration={4000}
            onClose={handleCloseSnackbar}
          >
            <Alert
              onClose={handleCloseSnackbar}
              severity={snackbar.severity}
              sx={{ width: "100%" }}
            >
              {snackbar.message}
            </Alert>
          </Snackbar>
        </Box>
      </Box>
    );
  };
  
  export default Signup;
  