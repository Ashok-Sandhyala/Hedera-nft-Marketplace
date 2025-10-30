import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useWalletInterface } from "../services/wallets/useWalletInterface";
import NavBar from "../components/Navbar";
import ResponsiveAppBar from "./bar";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import { TextField, Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

function Nftdetails() {
  const { walletInterface } = useWalletInterface();
  const nav = useNavigate();
  const { aid } = useParams();
  const { colname } = useParams();
  const { nft_Ref } = useParams();
  console.log("nft_Ref:", nft_Ref);

  const [nftDetails, setNFTDetails] = useState([{}]); // Initialize as an array with an empty object
  console.log(nftDetails);

  const [showPopup, setShowPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [nftname, setnftname] = useState([]);
  const [id, setid] = useState([]);
  const [collname, setcollname] = useState([]);
  const [nftsymbol, setnftsymbol] = useState([]);
  const [nftdes, setnftdes] = useState([]);
  const [nftref, setnftref] = useState([]);
  const [price, setprice] = useState([]);
  const [royality, setroyality] = useState([]);
  const [pltformcharge, setpltformcharge] = useState([]);
  const [rmv, srmv] = useState([])
  const [royaltyAmount, setRoyaltyAmount] = useState(0);
  const [platformChargeAmount, setPlatformChargeAmount] = useState(0);


  const openPopup = () => {
    document.getElementById("editnft");
    setShowPopup(true);
    setnftref(rmv.NFT_ref)
    setnftname(rmv.NFT_name)
    setnftsymbol(rmv.NFT_symbol)
    setnftdes(rmv.NFT_des)
    setprice(rmv.NFT_price)
    setroyality(rmv.NFT_Royality)
    setpltformcharge(rmv.PlatformCharge)
  };

  const closePopup = () => {
    setShowPopup(false);
  };


  const Updatenft = async () => {
    const nft_ref = rmv.NFT_ref;
    await axios
      .put("http://localhost:9000/editnftdetails", {
        aid,
        colname,
        nft_ref,
        nftname,
        nftsymbol,
        nftdes,
        price,
        royality,
        pltformcharge,
      })
      .then((result) => {
        console.log(result);
        if (result.data) {
          alert("NFT edited Successfully");
          window.location.reload(1);
        } else {
          alert("Try again");
        }
      })
      .catch((e) => console.log(e));
  };

  /*************************************deleteNFT*************************************************************/
  const Deletenft = (TokenId) => {
    axios.delete(`http://localhost:9000/deletenft/${aid}/${colname}/${TokenId}`)
      .then((responce) => {
        alert('NFT deleted with NFT_ref : ${TokenId}');
        nav('/viewnft');
      })
      .catch((error) => {
        alert('NFT not Possible to delete ');
      });
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
    axios
      .get(`http://localhost:9000/nftdetails/${nft_Ref}`)
      .then((response) => {
        setNFTDetails([response.data]);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, [nft_Ref]);

  return (
    <>
      <ResponsiveAppBar />
      <div className="nftdetails-container">
        {nftDetails.map((nft) => (
          <div key={nft.NFT_ref} className="nft_details">
            <div className="img">
              {nft.NFT_Type == "video" ? (
                <video
                  className="nft-image"
                  controls
                  src={`https://bronze-advanced-aardvark-335.mypinata.cloud/ipfs/${nft.NFT_cid}?pinataGatewayToken=BDTCLqWD4c3GL9V8xiS1O-VMJ2s_7PLE_gWEJRQM2iu1EoyxooaciqbI1K4Yj1Qe&_gl=1*1kacgnf*_ga*MTQ3MDQwMzE1MS4xNjkzMjI4MjMy*_ga_5RMPXG14TE*MTcwNDMwMTU3My4zNi4xLjE3MDQzMDE1OTcuMzYuMC4w`}
                  alt={nft.NFT_name}
                />
              ) : nft.NFT_Type === "audio" ? (
                <audio
                  className="nft-audio"
                  controls
                  src={`https://bronze-advanced-aardvark-335.mypinata.cloud/ipfs/${nft.NFT_cid}?pinataGatewayToken=BDTCLqWD4c3GL9V8xiS1O-VMJ2s_7PLE_gWEJRQM2iu1EoyxooaciqbI1K4Yj1Qe&_gl=1*19pv0ws*_ga*MTQ3MDQwMzE1MS4xNjkzMjI4MjMy*_ga_5RMPXG14TE*MTcwNDIxODI0Ny4zNC4xLjE3MDQyMTgzNTEuNDAuMC4w`}
                  alt={nft.NFT_name}
                />
              ) : (
                <img
                  className="nft-image"
                  src={`https://bronze-advanced-aardvark-335.mypinata.cloud/ipfs/${nft.NFT_cid}?pinataGatewayToken=BDTCLqWD4c3GL9V8xiS1O-VMJ2s_7PLE_gWEJRQM2iu1EoyxooaciqbI1K4Yj1Qe&_gl=1*19pv0ws*_ga*MTQ3MDQwMzE1MS4xNjkzMjI4MjMy*_ga_5RMPXG14TE*MTcwNDIxODI0Ny4zNC4xLjE3MDQyMTgzNTEuNDAuMC4w`}
                  alt={nft.NFT_name}
                />
              )}
            </div>
            <div className="content">
              <Button style={{ color: "white", fontSize: "30px" }}>NFT DETAILS :</Button><br />
              <Button style={{ color: "white", fontSize: "20px" }} >NFT OWNER : </Button><Button sx={{ ml: "65px", fontSize: "20px" }}>{sessionStorage.accid}</Button><br />
              <Button style={{ color: "white", fontSize: "20px" }} >NFT Name : </Button><Button sx={{ ml: "80px", fontSize: "20px" }}>{nft.NFT_name}</Button><br />
              <Button style={{ color: "white", fontSize: "20px" }} >Description : </Button ><Button sx={{ ml: "30px" , fontSize: "20px" }}>{nft.NFT_des}</Button><br />
              <Button style={{ color: "white", fontSize: "20px" }} >NFT Symbol : </Button ><Button sx={{ ml: "60px", fontSize: "20px" }}>{nft.NFT_symbol}</Button><br />
              <Button style={{ color: "white", fontSize: "20px" }} >NFT Price : </Button><Button sx={{ ml: "80px", fontSize: "20px" }}>{nft.NFT_price} HBARS</Button><br />
              <Button style={{ color: "white", fontSize: "20px" }} >Royality : </Button><Button sx={{ ml: "90px", fontSize: "20px" }}>{nft.NFT_Royality} HBARS</Button><br />
              <Button style={{ color: "white", fontSize: "20px" }} >PlatformCharge : </Button><Button sx={{ fontSize: "20px" }}>{nft.PlatformCharge} HBARS</Button><br /><br />
             
              {
                aid == sessionStorage.accid ? <Button onClick={async () => { const associateId = await walletInterface.associateToken(nft.TokenId); console.log(associateId) }} variant='contained' sx={{ ml: "0%", background: "green" }}>Associate</Button> : <b />
              }
              {
                aid == sessionStorage.accid ? <Button onClick={openPopup} onClickCapture={(e) => srmv(nft)} variant='contained' sx={{ ml: "1%", background: "violet" }} >update</Button> : <b />
              }
              {
                aid == sessionStorage.accid ? <Button onClick={() => Deletenft(nft.TokenId)} variant='contained' sx={{ ml: "1% ", background: "red" }} >Delete</Button> : <b />
              }
              {
                aid == sessionStorage.accid ? <b /> : <Button variant='contained' sx={{ ml: "0%", background: "green" }}>BUY</Button>
              }
            </div>
            

            {showPopup && (
              
<Dialog open={showPopup} onClose={closePopup}>
          <DialogTitle>
            UPDATE Nft
            <IconButton aria-label="close" onClick={closePopup}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <form >
               <TextField
                label="Account Id"
                variant="outlined"
                name="Account Id"
                value={aid}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Collection Name"
                variant="outlined"
                name="customNftname"
                value={colname}
                fullWidth
                margin="normal"
              />
              <TextField
                label="NFT-Token Name"
                variant="outlined"
                name="customNftsymbol"
                value={nftname}
                fullWidth
                margin="normal"
              />
              <TextField
                label="NFT-Token Symbol"
                variant="outlined"
                name="customNftdes"
                value={nftsymbol}
                fullWidth
                margin="normal"
              />
              <TextField
                label="NFT-Token Description"
                variant="outlined"
                name="customNftdes"
                value={nftdes}
                fullWidth
                margin="normal"
              />
              <TextField
                label="NFT-Token Price"
                variant="outlined"
                type="number"
                name="customPrice"
                value={price}
                fullWidth
                margin="normal"
                onChange={(e) => (setprice(e.target.value))}
              />
              <TextField
                label="NFT-Token Royalty"
                variant="outlined"
                type="number"
                name="customRoyality"
                value={royality}
                fullWidth
                margin="normal"
              />
              <Grid item xs={12}>
        <Typography variant="subtitle2" gutterBottom>
          {royality !== '' && `(${royality}% of ${price} HBAR is ${royaltyAmount} HBAR)`}
        </Typography>
      </Grid>
              <TextField
                label="NFT Platform Price"
                variant="outlined"
                type="number"
                name="customPltformcharge"
                value={pltformcharge}
                fullWidth
                margin="normal"
              /><Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                {pltformcharge !== '' && `(${pltformcharge}% of ${price} HBAR is ${platformChargeAmount} HBAR)`}
              </Typography>
            </Grid>
            <br/>
              <Button variant='contained' color="primary" disabled={isLoading} onClick={Updatenft} fullWidth>
                {isLoading ? 'UPDATING NFT...' : 'UPDATE NFT'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>

            )}
          </div>
        ))}
      </div>
    </>
  );
}

export default Nftdetails;
