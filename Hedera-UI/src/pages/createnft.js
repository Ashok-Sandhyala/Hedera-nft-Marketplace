import React, { useEffect, useState } from "react";

import { useParams } from "react-router-dom";
import {
  Client,
  AccountId,
  PrivateKey,
  TokenCreateTransaction,
  TokenType,
  TokenSupplyType,
  TokenMintTransaction,
  Hbar,
} from '@hashgraph/sdk';


import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useWalletInterface } from "../services/wallets/useWalletInterface";
import { WalletSelectionDialog } from "../components/WalletSelectionDialog";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { ButtonGroup } from "@mui/material";

import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";


const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

function Nft() {
  const { colname } = useParams();
  const { coldes } = useParams();
  const { aid } = useParams();

  const min = Math.pow(10, 6);
  const max = Math.pow(10, 7) - 1;
  const nft_ref = (Math.floor(Math.random() * (max - min + 1)) + min).toString();


  const [nft, setnft] = useState('');
  const [nftsymbol, setnftsymbol] = useState('');
  const [nftdes, setnftdes] = useState('');
  const [price, setprice] = useState('');
  const [royality, setroyality] = useState('');
  const [pltformcharge, setpltformcharge] = useState('');
  const [file, setfile] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [tokenid, setTokenId] = useState('');
  const [id, setid] = useState('');
  const [collname, setcollname] = useState('');
  const [data, sdata] = useState([])
  const [adata, sadata] = useState();
  const [selectedMediaType, setSelectedMediaType] = useState("");
  const [royaltyAmount, setRoyaltyAmount] = useState(0);
  const [platformChargeAmount, setPlatformChargeAmount] = useState(0);
  const [metadata, setmetadata] = useState('')


  const operatorAccountId = AccountId.fromString(sessionStorage.operatorid);
  const operatorPrivateKey = PrivateKey.fromString(sessionStorage.operatorprivatekey);
  const treasuryAccId = AccountId.fromString(sessionStorage.hederaid);
  const treasuryAccPvKey = PrivateKey.fromString(sessionStorage.PrivateKey);

  const wipeKey = PrivateKey.generate();
  const pauseKey = PrivateKey.generate();
  const supplyKey = PrivateKey.generate();
  const adminKey = PrivateKey.generate();
  const kycKey = PrivateKey.generate();
  const freezeKey = PrivateKey.generate();

  const client = Client.forTestnet().setOperator(
    operatorAccountId,
    operatorPrivateKey
  );

  const createNftToken = async () => {
    setIsLoading(true);
    try {
      const nftCreate = await new TokenCreateTransaction()
        .setTokenName(nft)
        .setTokenSymbol(nftsymbol)
        .setTokenType(TokenType.NonFungibleUnique)
        .setDecimals(0)
        .setInitialSupply(0)
        .setTreasuryAccountId(treasuryAccId)
        .setSupplyType(TokenSupplyType.Finite)
        .setMaxSupply(1)
        .setSupplyKey(supplyKey)
        // .setAdminKey(adminKey)
        .setPauseKey(pauseKey)
        .setFreezeKey(freezeKey)
        .setWipeKey(wipeKey)
        .setKycKey(kycKey)
        .freezeWith(client);
      const nftCreateTxSign = await nftCreate.sign(treasuryAccPvKey);
      const nftCreateSubmit = await nftCreateTxSign.execute(client);
      const nftCreateRx = await nftCreateSubmit.getReceipt(client);
      const tokenId = nftCreateRx.tokenId;
      setTokenId(tokenId.toString());

      const formData = new FormData();
      formData.append('file', file);

      const ipfsResponse = await axios.post(
        'https://api.pinata.cloud/pinning/pinFileToIPFS',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            pinata_api_key: sessionStorage.pinata_api_key,
            pinata_secret_api_key: sessionStorage.pinata_secret_api_key,
          },
        }
      );

      const ipfsHash = ipfsResponse.data.IpfsHash;




      const metadata = {
        name: nft,
        symbol: nftsymbol,
        description: nftdes,
        Tokenid: tokenId,
        external_url: 'https://pinata.cloud',
        Image: `ipfs://${ipfsHash}`,
      };
      const res = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          pinata_api_key: sessionStorage.pinata_api_key,
          pinata_secret_api_key: sessionStorage.pinata_secret_api_key,
        },
        body: JSON.stringify(metadata),
      });
      const metadataHash = (await res.json()).IpfsHash;
      console.log('Metadata uploaded. MetadataCID:', metadataHash);
      setmetadata(metadataHash)
      //Minting NFT
      const maxTransactionFee = new Hbar(20);
      const CID = [Buffer.from(`ipfs://${metadata}/metadata.json`),]
      const mintTx = new TokenMintTransaction()
        .setTokenId(tokenId)
        .setMetadata(CID)
        .setMaxTransactionFee(maxTransactionFee)
        .freezeWith(client);
      const mintTxSign = await mintTx.sign(supplyKey);
      const mintTxSubmit = await mintTxSign.execute(client);
      const mintRx = await mintTxSubmit.getReceipt(client);
      console.log(`- Minted success for NFT ${tokenId} \n`);


      const response = await axios.post("http://localhost:9000/createnft", {
        aid: aid,
        colname: colname,
        coldes: coldes,
        tokenId: tokenId.toString(),
        nft: nft,
        nft_ref: nft_ref,
        nftsymbol: nftsymbol,
        nftdes: nftdes,
        price: price,
        royality: royality,
        pltformcharge: pltformcharge,
        selectedMediaType: selectedMediaType,
        ipfsHash: ipfsHash,
        Metadatahash: metadata,
      });
      console.log(response.data);

      if (response) {
        alert('NFT Created with tokenID ' + `${tokenId}`);
        window.location.reload(false);
      }
    } catch (error) {
      setError('Error creating NFT: ' + error.toString());
      console.error('Error creating NFT:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const Prev = async () => {
    document.getElementById("first").style.display = "block";
    document.getElementById("second").style.display = "none";
  }
  const next = async () => {
    document.getElementById("first").style.display = "none";
    document.getElementById("second").style.display = "block";
  }




  const calculatePercentageAmount = (percentage, targetStateSetter) => {
    const priceValue = parseFloat(price) || 0;
    const percentageValue = parseFloat(percentage) || 0;
    const calculatedAmount = (priceValue * percentageValue) / 100;
    targetStateSetter(calculatedAmount.toFixed(5)); // Limiting to 5 decimal places
  };

  useEffect(() => {
    calculatePercentageAmount(royality, setRoyaltyAmount);
  }, [royality, price]);
  useEffect(() => {
    calculatePercentageAmount(pltformcharge, setPlatformChargeAmount);
  }, [pltformcharge, price]);


  useEffect(() => {
    axios.get("http://localhost:9000/accountdetails/" + sessionStorage.email)
      .then((responce) => {
        sadata(responce.data);
        const dm = responce.data;
        console.log('account keys are :')
        console.log(dm)
        sessionStorage.hederaid = dm[0].HederaId
        sessionStorage.PrivateKey = dm[0].HederaPrivatekey
        console.log("hid" + sessionStorage.hederaid)
        console.log("hpy" + sessionStorage.PrivateKey)
      })
      .catch((err) => {
        console.log(err);
      });
  }, [3]);

  return (
    <>
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
            <Typography component="h1" variant="h5">
              CREATE NFT
            </Typography>
            <Box
              component="form"
              noValidate
              sx={{ mt: 3 }}
            >
              <div id="first">
                <Grid container spacing={2} id="first">
                  <Grid item xs={12}>
                    <TextField
                      autoComplete="given-name"
                      name="Account id"
                      required
                      fullWidth
                      id="Account id"
                      value={aid}
                      label="Account id"
                      onChange={(e) => (setid(e.target.value))}
                    // autoFocus
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      id="Collection Name"
                      label="Collection Name"
                      name="Collection Name"
                      value={colname}
                      onChange={(e) => setcollname(e.target.value)}
                    // autoFocus
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      id="NFT Token Name"
                      label="NFT Token Name"
                      name="NFT Token Name"
                      onChange={(e) => setnft(e.target.value)}
                    // autoFocus
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      id="NFT-Token Symbol"
                      label="NFT-Token Symbol"
                      name="NFT-Token Symbol"
                      onChange={(e) => setnftsymbol(e.target.value)}
                    // autoFocus
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      id="NFT-Token Description "
                      label="NFT-Token Description "
                      name="NFT-Token Description "
                      onChange={(e) => setnftdes(e.target.value)}
                    // autoFocus
                    />
                  </Grid>
                  <Button variant="contained" sx={{ m: "5% 0% 0% 40%" }} onClick={next}>next</Button>

                </Grid>
              </div>


              <div id="second" style={{ display: "none" }}>
                <Grid container spacing={2} id="second">
                  <Button variant="contained" sx={{ margin: "5% 0% 0% 5%" }} onClick={Prev}>Back</Button>
                  <Grid item xs={12}>
                    <TextField
                      autoComplete="given-name"
                      name="NFT-Token Price "
                      required
                      fullWidth
                      id="NFT-Token Price "
                      label="NFT-TOKEN PRICE "
                      onChange={(e) => setprice(e.target.value)}
                      autoFocus
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      id="NFT-Token Royality "
                      label="NFT TOKEN ROYALITY "
                      name="NFT-Token Royality "
                      onChange={(e) => setroyality(e.target.value)}
                      autoFocus
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Typography variant="subtitle2" gutterBottom>
                      {royality !== '' && `(${royality}% of ${price} HBAR is ${royaltyAmount} HBAR)`}
                    </Typography>
                  </Grid>


                  <Grid item xs={15}>
                    <TextField
                      required
                      fullWidth
                      id="Platform Charge"
                      label="PLATFORM CHARGE"
                      name="Platform Charge"
                      onChange={(e) => setpltformcharge(e.target.value)}
                      autoFocus
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" gutterBottom>
                      {pltformcharge !== '' && `(${pltformcharge}% of ${price} HBAR is ${platformChargeAmount} HBAR)`}
                    </Typography>
                  </Grid>

                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel id="media-type-label">NFT TYPE</InputLabel>
                      <Select
                        labelId="media-type-label"
                        id="media-type-select"
                        value={selectedMediaType}
                        label="Media Type"
                        onChange={(e) => setSelectedMediaType(e.target.value)}
                      >
                        <MenuItem value="image">IMAGE</MenuItem>
                        <MenuItem value="audio">AUDIO</MenuItem>
                        <MenuItem value="video">VIDEO</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>


                  {selectedMediaType === "image" && (
                    <Button sx={{ margin: "5% 0% 0% 5%", fontSize: "15px" }}>NFTIMAGE  <Grid item xs={12}>
                      <input type="file" style={{ margin: "0% 0% 0% 20%" }} fullWidth onChange={(e) => setfile(e.target.files[0])} />
                    </Grid></Button>
                  )}

                  {selectedMediaType === "audio" && (
                    <Button sx={{ margin: "5% 0% 0% 5%", fontSize: "15px" }}>NFTAUDIO  <Grid item xs={12}>
                      <input type="file" style={{ margin: "0% 0% 0% 20%" }} fullWidth onChange={(e) => setfile(e.target.files[0])} />
                    </Grid></Button>
                  )}

                  {selectedMediaType === "video" && (
                    <Button sx={{ margin: "5% 0% 0% 5%", fontSize: "15px" }}>NFTVIDEO  <Grid item xs={12}>
                      <input type="file" style={{ margin: "0% 0% 0% 20%" }} fullWidth onChange={(e) => setfile(e.target.files[0])} />
                    </Grid></Button>
                  )}

                  <Button variant='contained' sx={{ m: "5% 0% 0% 60%" }} onClick={createNftToken} disabled={isLoading}>
                    {isLoading ? 'Creating NFT...' : 'Create NFT'}
                  </Button>
                </Grid>
              </div>

            </Box>
          </Box>
        </Container>
      </ThemeProvider>
    </>
  )
}
export default Nft