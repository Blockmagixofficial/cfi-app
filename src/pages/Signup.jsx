import { Box, Typography, Snackbar, Alert,useMediaQuery } from "@mui/material";
import React, { useState } from "react";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import PersonIcon from "@mui/icons-material/Person";
import LockIcon from "@mui/icons-material/Lock";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useLocation, useNavigate } from "react-router-dom"; // Updated for redirect
import axiosInstance from "../utils/axios";

const Signup = () => {
  const location = useLocation();
  const isSignIn = location.pathname === "/signin";
  const navigate = useNavigate(); // For navigation after success
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
    severity: "success", // Can be 'error' for error cases
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

  // Function to generate a unique username
  const generateUniqueUsername = () => {
    const cleanedFullName = formData.fullName.replace(/\s+/g, "").toLowerCase(); // Remove spaces
    const randomNumber = Math.floor(Math.random() * 10000); // Generate a random number (0 to 9999)
    const userName = `${cleanedFullName}${randomNumber}`; // Concatenate full name with random number
    return userName;
  };

  // Function to handle registration
  const handleRegister = async () => {
    const generatedUserName = generateUniqueUsername(); // Generate a unique username

    try {
      const response = await axiosInstance.post("/user/signup", {
        step: 1,
        emailId: formData.email,
        userName: generatedUserName, // Use the generated unique username
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
          navigate("/signin"); // Redirect to signin after signup success
        }, 2000); // Delay the redirection to let Snackbar show
      }
    } catch (err) {
      setSnackbar({
        open: true,
        message: "Sign up failed! Try again.",
        severity: "error",
      });
    }
  };

  // Function to handle login 
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
        navigate("/dashboard");
        // You can navigate to the desired page after successful login
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

  // Function to handle button click based on isSignIn value
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
      color={"black"}
      width={!isMobile ? "80%" : "100%"}
      border={"1px solid red"}
      height={!isMobile ? "50vh" : "60vh"}
      mt={!isSignIn ? 10 : 17.5}
      ml={!isMobile ? 10 : 0}
    >
      <Box>
        <Typography
          fontFamily={"Poppins,sans-serif"}
          fontSize={!isMobile ? "30px" : "20px"}
          fontWeight={800}
          ml={!isMobile ? 0 : 7.5}
        >
          {isSignIn ? "Hello Again!" : "Hello!"}
        </Typography>
        <Typography
          fontFamily={"Poppins,sans-serif"}
          fontSize={!isMobile ? "16px" : "12px"}
          fontWeight={500}
          ml={!isMobile ? 0 : 7.5}
        >
          {isSignIn ? "Welcome Back" : "Sign Up to Get Started"}
        </Typography>
      </Box>
      <Box>
        {!isSignIn && (
          <Box
            width={!isMobile ? "70%" : "60%"}
            height={!isMobile ? "6vh" : "4vh"}
            border={"1.5px solid #EEEEEE"}
            borderRadius={"30px"}
            mt={2}
            p={0.5}
            ml={!isMobile ? 0 : 7.5}
          >
            <Box
              pl={2}
              pt={0.75}
              display={"flex"}
              alignItems={"center"}
              gap={1}
            >
              <PersonIcon sx={{ color: "#EEEEEE" }} />
              <input
                placeholder="Full Name"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                style={{
                  backgroundColor: "transparent",
                  border: "none",
                  outline: "none",
                  color: "black",
                }}
                className="custom-placeholder"
              />
            </Box>
          </Box>
        )}
        <Box
          width={!isMobile ? "70%" : "60%"}
          height={!isMobile ? "6vh" : "4vh"}
          border={"1.5px solid #EEEEEE"}
          borderRadius={"30px"}
          mt={2}
          p={0.5}
          ml={!isMobile ? 0 : 7.5}
        >
          <Box pl={2} pt={0.75} display={"flex"} alignItems={"center"} gap={1}>
            <MailOutlineIcon sx={{ color: "#EEEEEE" }} />
            <input
              placeholder="Email Address"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              style={{
                backgroundColor: "transparent",
                border: "none",
                outline: "none",
                color: "black",
              }}
              className="custom-placeholder"
            />
          </Box>
        </Box>
        <Box
          width={!isMobile ? "70%" : "60%"}
          height={!isMobile ? "6vh" : "4vh"}
          border={"1.5px solid #EEEEEE"}
          borderRadius={"30px"}
          mt={2}
          p={0.5}
          ml={!isMobile ? 0 : 7.5}
        >
          <Box pl={2} pt={0.75} display={"flex"} alignItems={"center"} gap={1}>
            <LockIcon sx={{ color: "#EEEEEE" }} />
            <input
              placeholder="Password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleInputChange}
              style={{
                backgroundColor: "transparent",
                border: "none",
                outline: "none",
                color: "black",
                width: "90%",
              }}
              className="custom-placeholder"
            />
            {showPassword ? (
              <VisibilityOffIcon
                sx={{ color: "#EEEEEE", cursor: "pointer" }}
                onClick={() => setShowPassword(false)}
              />
            ) : (
              <VisibilityIcon
                sx={{ color: "#EEEEEE", cursor: "pointer" }}
                onClick={() => setShowPassword(true)}
              />
            )}
          </Box>
        </Box>

        {/* Password strength checks */}
        {!isSignIn && (
          <Box pl={5} pt={2} pb={2} ml={!isMobile ? 0 : 7.5}>
            <Typography fontSize={!isMobile ? "12px" : ""}>Password must contain:</Typography>
            <Box pt={0.25} display={"flex"} alignItems={"center"} gap={1}>
              <div
                style={{
                  height: "10px",
                  width: "10px",
                  borderRadius: "50%",
                  backgroundColor: passwordChecks.hasUppercase
                    ? "#28a745"
                    : "#EEEEEE",
                }}
              ></div>
              <Typography fontSize={!isMobile ? "12px" : ""}>Upper case letter</Typography>
            </Box>
            <Box pt={0.25} display={"flex"} alignItems={"center"} gap={1}>
              <div
                style={{
                  height: "10px",
                  width: "10px",
                  borderRadius: "50%",
                  backgroundColor: passwordChecks.hasSpecialChar
                    ? "#28a745"
                    : "#EEEEEE",
                }}
              ></div>
              <Typography fontSize={!isMobile ? "12px" : ""}>Special Character . -%&!@^</Typography>
            </Box>
            <Box pt={0.25} display={"flex"} alignItems={"center"} gap={1}>
              <div
                style={{
                  height: "10px",
                  width: "10px",
                  borderRadius: "50%",
                  backgroundColor: passwordChecks.isValidLength
                    ? "#28a745"
                    : "#EEEEEE",
                }}
              ></div>
              <Typography fontSize={!isMobile ? "12px" : ""}>Minimum 6 characters</Typography>
            </Box>
          </Box>
        )}

        {/* Submit Button */}
        <Box ml={!isMobile ? 0 : 7.5}>
          <button
            onClick={handleSubmit}
            style={{
              width: !isMobile ? "75%" : "70%",
              padding: "15px 20px",
              fontSize: "16px",
              borderRadius: "30px",
              backgroundColor: "#0575E6",
              color: "#fff",
              border: "none",
              cursor: "pointer",
              marginTop: "20px",
            }}
          >
            {isSignIn ? "Login" : "Register"}
          </button>
        </Box>
        <Box pl={!isMobile ? 7 : 3} ml={!isMobile ? 0 : 7.5}>
          <p
            style={{ color: "black", cursor: "pointer",textDecoration:"underline",fontSize:"12px" }}
            onClick={isSignIn ? handleSignup : handleSignIn}
          >
            {isSignIn
              ? "Not registered yet? Sign up here"
              : "Already registered? Sign in here"}
          </p>
        </Box>
      </Box>

      {/* Snackbar for showing messages */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
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
  );
};

export default Signup;
