import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import NavBar from "../components/Navbar";
import { Button } from "@mui/material";
import { useWalletInterface } from "../services/wallets/useWalletInterface";
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
  const [rmv, srmv] = useState([])
  const [newAccountId, setNewAccountId] = useState(null);
  const [adata, sadata] = useState();


  const nav = useNavigate()

  const openPopup = (colname, Accountid, coldes, nft) => {
    document.getElementById("editnft");
    setShowPopup(true);
    setid(Accountid)
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
    setcreatorid(nft.CreaterId)
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  const Deletenft = async (id, collname, nftref) => {
    try {
      const response = await axios.delete(`https://hederanft-server.onrender.com/deletenft/${id}/${collname}/${nftref}`);
      if (response.data.message === "NFT deleted successfully") {
        alert(`NFT Deleted with NFT_REF: ${nftref}`);
        window.location.reload(false);
      }
    } catch (error) {
      alert("An error occurred while deleting the NFT.");
    }
  };

  const Buynft = async () => {
    console.log("aid")
      console.log("price")
    try {
      
      const royalityid = await walletInterface.transferHBAR(creatorid, royality);
      console.log('Royality Transaction id :', royalityid);
      const platformchargeid = await walletInterface.transferHBAR('0.0.815067', pltformcharge);
      console.log('platform charge transaction ID is :', platformchargeid)
      const txId = await walletInterface.transferHBAR(aid, price);
      console.log("Transaction ID:", txId);

      
      if (txId && royalityid && platformchargeid) {
        console.log("HBAR transaction successful. Proceeding with NFT purchase and deletion.");
        const postRequest = axios.post("https://hederanft-server.onrender.com/transferednft", {
          aid: sessionStorage.Hederaid,
          email : sessionStorage.email,
          hederaid : sessionStorage.HederaId,
          colname: collname,
          coldes: coldes,
          tokenId: tokenid,
          nft: nftname,
          nft_ref: nftref,
          nftsymbol: nftsymbol,
          nftdes: nftdes,
          price: price,
          royality: royality,
          pltformcharge: pltformcharge,
          ipfsHash: nftcid,
          creatorid: creatorid
        });
        console.log('data enter success');
        const deleteRequest = Deletenft(sessionStorage.accid, collname, nftref);
        const [postResponse, deleteResponse] = await Promise.all([postRequest, deleteRequest]);

        if (postResponse.data) {
          alert('NFT bought with tokenID ' + `${tokenid}`);
          console.log("NFT purchase successful.");
          window.location.reload(false);
        }
      }
    } catch (error) {
      alert(' buying the NFT not possible.');
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
        console.log("hid" + sessionStorage.hederaid)
        console.log("hpy" + sessionStorage.PrivateKey)
      })
      .catch((err) => {
        console.log(err);
      });
  }, [3]);

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
          <div className="popup">
            <div className="popup-content">
              <span className="close-popup" onClick={closePopup}>
                &times;<Button variant='contained' sx={{ m: "0% 0% 0% 0%", background: "red" }} >Close</Button>
              </span>
              

              <div className="createcol-container" id="editnft">
                <h2>BUY Nft</h2>
                <form onSubmit={(e) => e.preventDefault()}>
                  <label>Account id : </label>
                  <input type="text" name="id" value={sessionStorage.accid} />
                  <br />
                  <br />
                  <label>Collection Name : </label>
                  <input type="text" name="colname" defaultValue={collname} onChange={(e) => setcollname(e.target.value)} />
                  <br />
                  <br />
                  <label> NFT-Token Name : </label>
                  <input type="text" defaultValue={nftname} name="nftname" onChange={(e) => setnftname(e.target.value)} />
                  <br />
                  <br />
                  <label >NFT-Token Symbol : </label>
                  <input type="text" defaultValue={nftsymbol} name="nftsymbol" pattern="[A-Z]3" onChange={(e) => setnftsymbol(e.target.value)} />
                  <br />
                  <br />
                  <label>NFT-Token Description : </label>
                  <input type="text" defaultValue={nftdes} name="nftdes" onChange={(e) => setnftdes(e.target.value)} />
                  <br />
                  <br />
                  <label>NFT-Token Price : </label>
                  <input type="number" defaultValue={price} onChange={(e) => setprice(e.target.value)} />
                  <br />
                  <br />
                  <label> NFT-Token Royalty :</label>
                  <input type="number" defaultValue={royality} onChange={(e) => setroyality(e.target.value)} />
                  <br />
                  <br />
                  <label> NFT Platform Price :</label>
                  <input type="number" defaultValue={pltformcharge} onChange={(e) => setpltformcharge(e.target.value)} />
                  <br />
                  <br />
                  <Button variant='contained' sx={{ m: "0% 0% 0% 0%", background: "yellowgreen" }} disabled={isLoading} onClick={Buynft}>
                    {isLoading ? 'Buying NFT...' : 'Buy NFT'}
                  </Button>

                </form>
              </div>
            </div>
          </div>
        )}

      </div>
    </>
  );
}

export default Home;
