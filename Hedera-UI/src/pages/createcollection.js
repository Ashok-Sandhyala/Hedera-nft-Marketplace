import axios from 'axios';
import * as React from "react";
import { useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import FolderIcon from '@mui/icons-material/Folder';
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import NavBar from '../components/Navbar.js'
import ResponsiveAppBar from './bar.js';
import { useEffect } from 'react';

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});
function Collection() {
  const [id, setid] = useState();
  const [colname, setcolname] = useState();
  const [coldes, setcoldes] = useState();
  const [hederaid, sethederaid] = useState();
  const [data, setdata] = useState();
  const accountId = sessionStorage.accid;


  const create = async () => {
    if (!accountId || !colname || !coldes) {
      alert('Please fill in all the required fields.');
      return;
    }
    try {
      const response = await axios.post("https://hederanft-server.onrender.com/create/" + accountId +"/"+ sessionStorage.email + "/" + data + "/" + colname + "/" + coldes);
      console.log(response.data);
      if (response.data) {
        alert('Collection created');
        window.location.reload(false);
      }
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    axios.get("https://hederanft-server.onrender.com/collectiondetails/" + sessionStorage.email)
      .then((responce) => {
        setdata(responce.data.HederaId);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <>
      <ResponsiveAppBar />
      <div className="create-col" >
        <ThemeProvider theme={darkTheme}>
          <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box
              sx={{
                marginTop: 8,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Avatar sx={{ m: 1, bgcolor: 'blue' }}>
                <FolderIcon style={{ width: '60%', height: '70%', color: 'white' }} />
              </Avatar>
              <Typography component="h1" variant="h5">
                CREATE-COLLECTION
              </Typography>
              <Box
                component="form"
                noValidate
                sx={{ mt: 3 }}
              >
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      autoComplete="given-name"
                      name="id"
                      required
                      fullWidth
                      id="Accountid"
                      label="Accountid "
                      value={sessionStorage.accid}
                      onChange={(e) => setid(e.target.value)}
                      readonly
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      autoComplete="given-name"
                      name="HederaId"
                      required
                      fullWidth
                      id="HederaId"
                      label="HederaId"
                      value={data}
                      onChange={(e) => sethederaid(e.target.value)}
                      InputLabelProps={{
                        shrink: true, // Ensure the label remains at the top
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      label="Collection Name"
                      name="colname"
                      onChange={(e) => setcolname(e.target.value)}
                      autoFocus
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      label="Description"
                      name="coldes"
                      onChange={(e) => setcoldes(e.target.value)}
                      autoFocus
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      type="button"
                      fullWidth
                      variant="contained"
                      onClick={create}
                      sx={{ mt: 3, mb: 2 }}
                    >
                      Create Collection
                    </Button>
                  </Grid>
                  <br />
                </Grid>
              </Box>
            </Box>
          </Container>
        </ThemeProvider>
      </div>
    </>
  )
}

export default Collection;
