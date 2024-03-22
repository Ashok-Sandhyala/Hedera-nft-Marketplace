import * as React from "react";
import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import environmentSetup from "./create-hedera-account";
import axios from 'axios'

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

export default function Register() {
  const nav = useNavigate();
  const [step, setStep] = React.useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [otpAttempts, setOtpAttempts] = useState(0);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const maxOtpAttempts = 3;
 
 
  const generateRandomOtp = () => {
    return Math.floor(1000 + Math.random() * 9000).toString();
  };

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleValidate = async (event) => {
    event.preventDefault();
    const checkEmailResponse = await axios.get("https://hederanft-server.onrender.com/check-email/" + email);
    if (!email) {
      alert('Please enter an email address before sending otp.');
      return;
    } else if (checkEmailResponse.data) {
      alert("Email already registered. Please use another email.");
      return;
    }

    const newOtp = generateRandomOtp();
    setGeneratedOtp(newOtp);
    setOtpAttempts(0);

    const config = {
      SecureToken: "a950768f-ad90-436e-9f26-a6a03895f959",
      To: email,
      From: 'bora1132004@gmail.com',
      Subject: "This is the subject for email verification",
      Body: `Your OTP is: ${newOtp}`,
    };

    try {
      await window.Email.send(config).then(() => alert("email sent successfully"))
      setStep(2);
    } catch (error) {
      alert('Email not sent. Please try again.');
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (step === 2 && otp === generatedOtp) {
      alert('Email Verified Successfully')
      setStep(3);
    } else if (step === 2 && otp !== generatedOtp) {
      setOtpAttempts(otpAttempts + 1);

      if (otpAttempts < maxOtpAttempts - 1) {
        alert(`Wrong OTP. Please try again. Attempts left: ${maxOtpAttempts - otpAttempts - 1}`);
      } else {
        alert('Maximum attempts reached. Please start again.');
        setStep(1);
      }
    }
  };

  const signupbutton = async () => {
    try {
      const { newAccountId, newAccountPrivateKey } = await environmentSetup();
      console.log('New Generated Account ID:', newAccountId);
      console.log('New generated Private key :', newAccountPrivateKey)
      const response = await axios.post("https://hederanft-server.onrender.com/registration/" + email + "/" + confirmPassword + "/" + newAccountId + "/" + newAccountPrivateKey);
      console.log(response.data);
      if (response.data) {
        alert('Registration was Successful');

        const emailConfig = {
          SecureToken: "a950768f-ad90-436e-9f26-a6a03895f959",
          To: email,
          From: 'bora1132004@gmail.com',
          Subject: "Hedera NFT Registration Successful",
          Body: `Thank you for registering!\n\nYour new account details:\nAccount ID: ${newAccountId}\nEmail: ${email}\nPassword: ${confirmPassword}`,
        };

        try {
          await window.Email.send(emailConfig).then(() => alert("Email sent successfully"));
        } catch (emailError) {
          console.error('Error sending registration email:', emailError);
        }
        nav('/');
      }
    } catch (error) {
      console.error('Error creating Hedera account:', error);
    }

  }

  return (
    <ThemeProvider theme={darkTheme}>
      <Grid container component="main" sx={{ height: "100vh", justifyContent: 'center', alignItems: 'center' }}>
        <CssBaseline />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 10,
              mx: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign up
            </Typography>
            <Box
              component="form"
              noValidate
              sx={{ mt: 5 }}
            >

              {step === 1 && (
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      id="email"
                      label="Email Address"
                      autoComplete="email"
                      onChange={(event) => setEmail(event.target.value)}
                      sx={{ color: "text.primary" }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      type="button"
                      fullWidth
                      variant="contained"
                      sx={{ mt: 3, mb: 2 }}
                      onClick={handleValidate}
                    >
                      Send OTP
                    </Button>
                    <Grid container justifyContent="flex-end">
                      <Grid item>
                        <Link href="/login" variant="body2">
                          Already have an account? Sign in
                        </Link>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              )}

              {step === 2 && (
                <>
                  <Grid container spacing={2}>
                    <Grid item xs={12} justifyContent="flex-end">
                      <label>OTP send to - {email}</label>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        required
                        fullWidth
                        name="otp"
                        label="Enter OTP"
                        type="text"
                        id="otp"
                        autoComplete="off"
                        onChange={(event) => setOtp(event.target.value)}
                        sx={{ color: "text.primary" }}
                      />
                    </Grid>
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      sx={{ mt: 3, mb: 2 }}
                      onClick={handleSubmit}
                    >
                      Next
                    </Button>
                    <Grid container justifyContent="flex-end">
                      <Grid item>
                        <Link href="/login" variant="body2">
                          Already have an account? Sign in
                        </Link>
                      </Grid>
                    </Grid>
                  </Grid>
                </>
              )}
              {step === 3 && (
                <>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        required
                        fullWidth
                        label="Enter Password"
                        type={showPassword ? "text" : "password"}
                        id="password"
                        autoComplete="new-password"
                        sx={{ color: "text.primary" }}
                        onChange={(event) => setPassword(event.target.value)}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton onClick={handleShowPassword}>
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        required
                        fullWidth
                        name="confirmPassword"
                        label="Confirm Password"
                        type={showConfirmPassword ? "text" : "password"}
                        id="confirmPassword"
                        autoComplete="new-password"
                        sx={{ color: "text.primary" }}
                        onChange={(event) => setConfirmPassword(event.target.value)}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton onClick={handleShowConfirmPassword}>
                                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                  </Grid>
                  <Grid xs={12}>
                    {
                      password === confirmPassword ? <Button
                        type="button"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        onClick={signupbutton}
                      >
                        Sign Up
                      </Button> : <b />
                    }
                    <br />
                    <Grid container justifyContent="flex-end">
                      <Grid item>
                        <Link href="/login" variant="body2">
                          Already have an account? Sign in
                        </Link>
                      </Grid>
                    </Grid>
                  </Grid>
                </>
              )}

            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
