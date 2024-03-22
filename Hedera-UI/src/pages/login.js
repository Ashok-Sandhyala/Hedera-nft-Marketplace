import * as React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import axios from 'axios'
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import { useWalletInterface } from '../services/wallets/useWalletInterface';
import { WalletSelectionDialog } from '../components/WalletSelectionDialog';


const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});


export default function SignInSide() {
  const nav = useNavigate();

  const [email, setemail] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [checked, setChecked] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [open, setOpen] = useState(false);
  const [data, setdata] = useState('');
  const [Hederaid, sHederaid] = useState('');
  const { accountId, walletInterface } = useWalletInterface();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  sessionStorage.email = email;
  sessionStorage.gmail = email;
  sessionStorage.Hederaid = accountId;
  sessionStorage.accid = accountId;

  const handleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleConnect = async () => {
    if (accountId) {
      walletInterface.disconnect();
    } else {
      setOpen(true);
    }
  };
  if (accountId) {
    nav('/')
  }

  const handleSubmit = async () => {
    if (!email || !confirmPassword) {
      alert("please fill all the required fields");
    }
    try {
      const response = await axios.get(`https://hederanft-server.onrender.com/login/${email}/${confirmPassword}`);
      console.log(response.data);
      if (response.data) {
        alert('Login was Successful');
        setLoggedIn(true);
      } else {
        alert('Please signup');
        nav('/register');
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    axios.get("https://hederanft-server.onrender.com/ipfsapi/")
      .then((responce) => {
        setdata(responce.data);
        sessionStorage.pinata_api_key = responce.data.ipfs_api_key;
        sessionStorage.pinata_secret_api_key = responce.data.ipfs_secret_api_key;
        sessionStorage.operatorid = responce.data.operatorAccountId;
        sessionStorage.operatorprivatekey = responce.data.operatorPrivatekey;
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    axios.get("https://hederanft-server.onrender.com/collectiondetails/" + sessionStorage.email)
      .then((responce) => {
        sHederaid(responce.data.HederaId);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

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
              SIGN IN
            </Typography>
            <Box
              component="form"
              noValidate
              sx={{ mt: 5 }}
            >
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    autoComplete="email"
                    onChange={(event) => setemail(event.target.value)}
                    sx={{ color: "text.primary" }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="Password"
                    label="Password"
                    type={showConfirmPassword ? "text" : "password"}
                    id="Password"
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

                <Grid item xs={12}>
                  <Button
                    type="button"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                    onClick={handleSubmit}
                  >
                    Login
                  </Button>
                </Grid>
                {loggedIn && (
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={<Checkbox checked={checked} onChange={() => setChecked(!checked)} />}
                      label="Please Connect Hashpack Wallet."
                    />
                  </Grid>
                )}

              </Grid>

              <Button
                type="button"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={!checked}
                onClick={handleConnect}
              >
                Connect Wallet
              </Button>
              <WalletSelectionDialog open={open} onClose={() => setOpen(false)} />
              <Grid container>
                <Grid item xs={6}>
                  <Link href="/register" variant="body2">
                    Don't have an Account? Sign Up
                  </Link>
                </Grid>
                <Grid item xs={6} container justifyContent="flex-end">
                  <Link href="/forgetpassword" variant="body2">
                    Forget Password? Click here
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
