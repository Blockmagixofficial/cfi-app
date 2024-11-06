import React, { useState, useRef } from 'react';
import { TextField, Button, Container, Typography, Box, CircularProgress } from '@mui/material';
import { useSpring, animated } from 'react-spring';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import LockIcon from '@mui/icons-material/Lock';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';

const TransactionApp = () => {
  const [screen, setScreen] = useState('amount');
  const [balance, setBalance] = useState(100);
  const [transactionAmount, setTransactionAmount] = useState(0);
  const [mpin, setMpin] = useState(['', '', '', '']);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const inputRefs = useRef([]);

  const transactionId = "T2305201058366754628773";

  const screenTransition = useSpring({
    opacity: screen === 'loading' || screen === 'success' ? 1 : 0.9,
    transform: screen === 'loading' || screen === 'success' ? 'translateY(0)' : 'translateY(-20px)',
    config: { tension: 220, friction: 30 },
  });

  const handleAmountProceed = () => {
    if (transactionAmount <= balance && transactionAmount > 0) {
      setScreen('mpin');
    } else {
      alert("Insufficient balance or invalid amount!");
    }
  };

  const handleMPINInput = (value, index) => {
    const newMpin = [...mpin];
    newMpin[index] = value;
    setMpin(newMpin);

    if (value && index < 3) {
      inputRefs.current[index + 1].focus();
    }

    if (index === 3 && newMpin.every((digit) => digit !== '')) {
      setLoading(true);
      setScreen('loading');
      setLoadingMessage("Verifying PIN...");

      setTimeout(() => {
        setLoadingMessage("Processing Transaction...");
      }, 1500);

      setTimeout(() => {
        setLoading(false);
        setBalance(balance - transactionAmount);
        setScreen('success');
        setMpin(['', '', '', '']);
      }, 3000);
    }
  };

  const handleCopyTransactionId = () => {
    navigator.clipboard.writeText(transactionId).then(() => {
      alert("Transaction ID copied to clipboard");
    });
  };

  const handleSendAgain = () => {
    setTransactionAmount(0);
    setScreen('amount');
  };

  return (
    <Container
      maxWidth="xs"
      sx={{
        textAlign: 'center',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '20px',
        backgroundColor: '#f8f9fa',
        boxShadow: 3,
        borderRadius: 2,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
        <AccountBalanceWalletIcon color="primary" fontSize="large" />
        <Typography variant="h4" sx={{ ml: 1, color: 'primary.main' }}>
          ₹{balance.toFixed(2)}
        </Typography>
      </Box>

      {screen === 'amount' && (
        <animated.div style={screenTransition}>
          <Typography variant="h6" gutterBottom>
            Enter Transaction Amount
          </Typography>
          <TextField
            fullWidth
            type="number"
            label="Amount"
            variant="outlined"
            value={transactionAmount}
            onChange={(e) => setTransactionAmount(Number(e.target.value))}
            sx={{
              mb: 3,
              borderRadius: '10px',
              '& .MuiOutlinedInput-root': { borderRadius: '10px' },
            }}
            InputProps={{ sx: { borderRadius: '10px' } }}
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleAmountProceed}
            sx={{ borderRadius: '10px', fontSize: '16px', padding: '10px 0' }}
          >
            Proceed
          </Button>
        </animated.div>
      )}

      {screen === 'mpin' && (
        <animated.div style={screenTransition}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
            <LockIcon color="primary" fontSize="large" />
          </Box>
          <Typography variant="h6" gutterBottom>
            Enter Secure PIN
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 3 }}>
            {mpin.map((digit, index) => (
              <TextField
                key={index}
                type="password"
                inputProps={{
                  maxLength: 1,
                  style: { textAlign: 'center', fontSize: '24px', padding: '8px' },
                }}
                value={digit}
                onChange={(e) => handleMPINInput(e.target.value, index)}
                ref={(el) => (inputRefs.current[index] = el)}
                sx={{
                  width: '50px',
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                    borderColor: 'primary.main',
                  },
                }}
              />
            ))}
          </Box>
        </animated.div>
      )}

      {screen === 'loading' && (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 3 }}>
          <CircularProgress color="primary" size={60} thickness={4} />
          <Typography variant="body1" sx={{ mt: 2 }}>
            {loadingMessage}
          </Typography>
        </Box>
      )}

      {screen === 'success' && (
        <animated.div style={screenTransition}>
          <Typography variant="h6" align="center" sx={{ mb: 2 }}>
            Transaction Successful
          </Typography>
          <Typography variant="body2" color="textSecondary" align="center">
      {currentDate.toLocaleDateString()} at {currentDate.toLocaleTimeString()}
          </Typography>

          <Box
            sx={{ display: 'flex', justifyContent: 'space-between', backgroundColor: '#f8f9fa', p: 2, borderRadius: 2, mt: 2 }}
          >
            <Typography variant="body2">Transaction ID</Typography>
            <Box display="flex" alignItems="center" onClick={handleCopyTransactionId} sx={{ cursor: 'pointer' }}>
              <Typography variant="body2" sx={{ mr: 1 }}>
                {transactionId}
              </Typography>
              <ContentCopyIcon fontSize="small" />
            </Box>
          </Box>

          <Box
            sx={{ display: 'flex', justifyContent: 'space-between', backgroundColor: '#f8f9fa', p: 2, borderRadius: 2, mt: 2 }}
          >
            <Box>
              <Typography variant="subtitle2">Paid to</Typography>
              <Typography variant="body2" color="textSecondary">RAMESH NAYAK MUDAVAT</Typography>
              <Typography variant="body2" color="textSecondary">9381978288</Typography>
            </Box>
            <Box textAlign="right">
              <Typography variant="subtitle2" sx={{ color: '#5e72eb' }}>
                ₹{transactionAmount.toFixed(2)}
              </Typography>
              <Button variant="text" sx={{ color: '#5e72eb', fontSize: '0.75rem' }} onClick={handleSendAgain}>
                SEND AGAIN
              </Button>
            </Box>
          </Box>

          <Box
            sx={{ display: 'flex', justifyContent: 'space-between', backgroundColor: '#f8f9fa', p: 2, borderRadius: 2, mt: 2 }}
          >
            <Box>
              <Typography variant="subtitle2">Debited from</Typography>
              <Typography variant="body2" color="textSecondary">XXXXXXXX8289</Typography>
              <Typography variant="body2" color="textSecondary">UTR: 350679646058</Typography>
            </Box>
            <Box textAlign="right">
              <Typography variant="subtitle2" sx={{ color: '#5e72eb' }}>
                ₹{transactionAmount.toFixed(2)}
              </Typography>
              <Button variant="text" sx={{ color: '#5e72eb', fontSize: '0.75rem' }}>
                SPLIT EXPENSE
              </Button>
            </Box>
          </Box>
        </animated.div>
      )}
    </Container>
  );
};

export default TransactionApp;
