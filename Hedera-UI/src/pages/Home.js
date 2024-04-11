import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import NavBar from "../components/Navbar";
// import { Button } from "@mui/material";
import { useWalletInterface } from "../services/wallets/useWalletInterface";
import { Button, TextField, Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import environmentSetup from '../pages/create-hedera-account'
import Register from "./register";
import ResponsiveAppBar from "./bar";
import {transferHBAR} from '@hashgraph/sdk';
import { AccountId } from "@hashgraph/sdk";

function Home() {
  const aid = sessionStorage.accid;
  const { walletInterface } = useWalletInterface();

  const [publishedNFTs, setPublishedNFTs] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [nftname, setnftname] = useState([]);
  const [id, setid] = useState([]);
  const [collname, setcollname] = useState([]);
  const [coldes, setcoldes] = useState([]);
  const [nftsymbol, setnftsymbol] = useState([]);
  const [nftdes, setnftdes] = useState([]);
  const [nftref, setnftref] = useState([]);
  const [price, setprice] = useState([]);
  const [royality, setroyality] = useState([]);
  const [pltformcharge, setpltformcharge] = useState([]);
  const [tokenid, settokenid] = useState([]);
  const [nftcid, setnftcid] = useState([]);
  const [creatorid, setcreatorid] = useState([]);
  const [mediatype, setmediatype] = useState([]);
  const [metadata , setmetadata] = useState([]);
  const [rmv, srmv] = useState([])
  const [newAccountId, setNewAccountId] = useState(null);
  const [adata, sadata] = useState();
  const [hederaid ,sHederaid] = useState('');
  const [ownerid,sownerid] = useState('');
  const [privatekey , sprivatekey ] = useState('');
  const [wid ,swid] = useState('');

  sessionStorage.Hederaid = hederaid;
  const nav = useNavigate()
  
  
  const openPopup = (colname, Accountid, coldes, nft) => {
    document.getElementById("editnft");
    setShowPopup(true);
    setid(Accountid)
    swid(Accountid)
    setcollname(colname)
    setcoldes(coldes)
    setnftref(nft.NFT_ref)
    setnftname(nft.NFT_name)
    setnftsymbol(nft.NFT_symbol)
    setnftdes(nft.NFT_des)
    setprice(nft.NFT_price)
    setroyality(nft.NFT_Royality)
    setpltformcharge(nft.PlatformCharge)
    settokenid(nft.TokenId)
    setnftcid(nft.NFT_cid)
    setmediatype(nft.NFT_Type)
    setmetadata(nft.Metadata_CID)
    setcreatorid(nft.CreaterId)
    sownerid(nft.OwnerId)
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  console.log("ganeshsreeja :"+wid);

  const Deletenft = (id,collname ,TokenId) => {
    axios.delete(`https://hederanft-server.onrender.com/deletenft/${id}/${collname}/${TokenId}`)
      .then((responce) => {
        alert('NFT deleted with NFT_ref : ${TokenId}');
        nav('/viewnft');
      })
      .catch((error) => {
        alert('NFT not Possible to delete ');
      });
  }

  console.log(id);
  console.log(collname);
  console.log(tokenid);
  const Buynft = async () => {
    try {

      // const royalityid = await walletInterface.transferHBAR(creatorid, royality);
      // console.log('Royality Transaction id :', royalityid);
      // const platformchargeid = await walletInterface.transferHBAR('0.0.815067', pltformcharge);
      // console.log('platform charge transaction ID is :', platformchargeid)
      // const txId = await walletInterface.transferHBAR(ownerid, price);
      // console.log("Transaction ID:", txId);

      console.log('start');
      // const response = await axios.post("http://localhost:9000/buyingnft", {
      //   Email: sessionStorage.email,
      //   Hid: sessionStorage.hederaid,
      //   aid: sessionStorage.accid,
      //   colname: collname,
      //   coldes: coldes,
      //   tokenId: tokenid.toString(),
      //   nft: nftname,
      //   nft_ref: nftref,
      //   nftsymbol: nftsymbol,
      //   nftdes: nftdes,
      //   price: price,
      //   royality: royality,
      //   pltformcharge: pltformcharge,
      //   selectedMediaType: mediatype,
      //   ipfsHash: nftcid,
      //   Metadatahash: metadata,
      //   creatorId : creatorid,
      // }, {
      //   headers: {
      //     'Content-Type': 'application/json'
      //   }
      // });
 
    
        const deleteRequest = Deletenft(id, collname, tokenid);

        if (deleteRequest) {
          alert('NFT bought with tokenID ' + `${tokenid}`);
          console.log("NFT purchase successful.");
          // window.location.reload(false);
        }
      
      

      console.log("center");
      console.log(response.data);
      // if (response.data) {
      //   alert('NFT Buying Success ' + `${tokenid}`);
      //   window.location.reload(false);
      // } else {
      //   alert('Failed to buy NFT');
      // }
    } catch (error) {
      console.error('Error Buying NFT:', error);
    } finally {
      setIsLoading(false);
    }
  };


  useEffect(() => {
    axios
      .get("https://hederanft-server.onrender.com/viewpublishednfts")
      .then((response) => {
        setPublishedNFTs(response.data);
        
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  
  useEffect(() => {
    axios.get("https://hederanft-server.onrender.com/accountdetails/" + sessionStorage.email)
      .then((responce) => {
        sadata(responce.data);
        const dm = responce.data;
        console.log('account keys are :')
        console.log(dm)
        sessionStorage.hederaid = dm[0].HederaId
        sessionStorage.PrivateKey = dm[0].HederaPrivatekey
        // console.log("hid" + sessionStorage.hederaid)
        // console.log(sessionStorage.accid)
        // console.log("hpy" + sessionStorage.PrivateKey)
      })
      .catch((err) => {
        console.log(err);
      });
  }, [3]);

  // useEffect(() => {
  //   axios.get("https://hederanft-server.onrender.com/collectiondetails/" + sessionStorage.email)
  //     .then((responce) => {
  //       sHederaid(responce.data.HederaId);
  //       sprivatekey(responce.data.HederaPrivatekey);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // }, []);


  return (
    <>
      <div>
        <ResponsiveAppBar />
        <div className="public-nft-container">
          {publishedNFTs.map((collection) => (
            collection.nfts.map((nft) => (
              <div key={nft.NFT_ref} className="public-nft-box">
                {nft.NFT_Type == "video" ? (
                  <video
                    className="nft-image-home"
                    controls
                    src={`https://bronze-advanced-aardvark-335.mypinata.cloud/ipfs/${nft.NFT_cid}?pinataGatewayToken=BDTCLqWD4c3GL9V8xiS1O-VMJ2s_7PLE_gWEJRQM2iu1EoyxooaciqbI1K4Yj1Qe&_gl=1*1kacgnf*_ga*MTQ3MDQwMzE1MS4xNjkzMjI4MjMy*_ga_5RMPXG14TE*MTcwNDMwMTU3My4zNi4xLjE3MDQzMDE1OTcuMzYuMC4w`}
                    alt={nft.NFT_name}
                  />
                ) : nft.NFT_Type === "audio" ? (
                  <audio
                    className="nft-image-home"
                    controls
                    src={`https://bronze-advanced-aardvark-335.mypinata.cloud/ipfs/${nft.NFT_cid}?pinataGatewayToken=BDTCLqWD4c3GL9V8xiS1O-VMJ2s_7PLE_gWEJRQM2iu1EoyxooaciqbI1K4Yj1Qe&_gl=1*19pv0ws*_ga*MTQ3MDQwMzE1MS4xNjkzMjI4MjMy*_ga_5RMPXG14TE*MTcwNDIxODI0Ny4zNC4xLjE3MDQyMTgzNTEuNDAuMC4w`}
                    alt={nft.NFT_name}
                  />
                ) : (
                  <img
                    className="nft-image-home"
                    src={`https://bronze-advanced-aardvark-335.mypinata.cloud/ipfs/${nft.NFT_cid}?pinataGatewayToken=BDTCLqWD4c3GL9V8xiS1O-VMJ2s_7PLE_gWEJRQM2iu1EoyxooaciqbI1K4Yj1Qe&_gl=1*19pv0ws*_ga*MTQ3MDQwMzE1MS4xNjkzMjI4MjMy*_ga_5RMPXG14TE*MTcwNDIxODI0Ny4zNC4xLjE3MDQyMTgzNTEuNDAuMC4w`}
                    alt={nft.NFT_name}
                  />
                )}
                <p>Acc Id : {collection.accounid}</p>
                <p>NFT Name: {nft.NFT_name}</p>
                <p>NFT Symbol: {nft.NFT_symbol}</p>
                <p>NFT Description: {nft.NFT_des}</p>

                {
                  walletInterface != null && (
                    <div>
                      <Link to={`/nftdetails/${collection.accounid}/${collection.colname}/${nft.NFT_ref}`}><Button variant='contained' sx={{ m: "2% 0% 0% 5%" }}>VIEW</Button></Link>

                      {
                        collection.accounid === sessionStorage.accid ? <b /> : <Link>
                          <Button onClick={() => { openPopup(collection.colname, collection.accounid, collection.coldes, nft); }}
                            variant="contained"
                            sx={{ m: "2% 0% 0% 5%", background: "green" }} > BUY </Button>
                        </Link>
                      }
                      
                    </div>
                  )
                }
 
 
              </div>
              
            ))
          ))}
          
        </div>


        {showPopup && (
        <Dialog open={showPopup} onClose={closePopup}>
          <DialogTitle>
            BUY Nft
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
                value={wid}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Collection Name"
                variant="outlined"
                name="customNftname"
                value={collname}
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
              <TextField
                label="NFT Platform Price"
                variant="outlined"
                type="number"
                name="customPltformcharge"
                value={pltformcharge}
                
                fullWidth
                margin="normal"
              />
              <Button variant='contained' color="primary" disabled={isLoading} onClick={Buynft} fullWidth>
                {isLoading ? 'Buying NFT...' : 'Buy NFT'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      )}

      </div>
    </>
  );
}

export default Home;
