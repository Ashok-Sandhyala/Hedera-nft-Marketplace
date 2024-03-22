import React, { useState, useEffect } from "react";
import { Button } from "@mui/material";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import NavBar from "../components/Navbar";
import ResponsiveAppBar from "./bar";

function Viewnft() {
  const nav = useNavigate();
  const { aid } = useParams();
  const { colname } = useParams();
  const [adata, sadata] = useState();

  const [nftDetails, setNftDetails] = useState(null);
  // const id = sessionStorage.accountid;
  useEffect(() => {
    axios
      .get("https://hederanft-server.onrender.com/viewnft/" + aid + "/" + colname)
      .then((response) => {
        setNftDetails(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const Deletenft = async (TokenId) => {
    try {
      const response = await axios.delete(`https://hederanft-server.onrender.com/deletenft/${aid}/${colname}/${TokenId}`);
      if (response.data.message === "NFT deleted successfully") {
        alert(`NFT Deleted with NFT_REF: ${TokenId}`);
        window.location.reload(false);
      } else {
        alert(`NFT Deleted with NFT_REF: ${TokenId}`);
        window.location.reload(false);
      }
    } catch (error) {
      console.error("Error deleting NFT:", error);
      alert("An error occurred while deleting the NFT.");
    }
  };
  

  const updatePublicStatus = async (nftRef, isPublic) => {
    try {
      await axios.put(`https://hederanft-server.onrender.com/updatePublicStatus/${aid}/${nftRef}`, { isPublic });
      if (isPublic) {
        alert('NFT is now public successfully!');
      } else {
        alert('NFT is now private successfully!');
      }
      const updatedNftDetails = { nftDetails };
      const updatedNfts = updatedNftDetails.nfts.map((nft) => {
        if (nft.NFT_ref === nftRef) {
          return { nft, Public: isPublic };
        }
        return nft;
      });
      updatedNftDetails.nfts = updatedNfts;
      setNftDetails(updatedNftDetails);
    } catch (error) {
      console.error('Error updating Public status:', error);
    }
  };

  const handleClick = async(TokenId) => {
    const url =`https://hashscan.io/testnet/token/${TokenId}`;
    window.location.href = url;
  };
 
  

  return (
    <>
    <ResponsiveAppBar/>
      <div>
        {nftDetails !== null ? (
          <div className="view-head">
            <Button style={{ margin:'1%', color: "white", fontSize: "15px" }}>Collection Name :</Button> <Button sx={{ fontSize: "15px" }}>{nftDetails.colname}</Button> <br/>
            <Button style={{ marginLeft:'1%' ,color: "white", fontSize: "15px" }}>Collection Description : </Button>  <Button sx={{ fontSize: "15px" }}>{nftDetails.coldes}</Button>

            <div className="nft-container">
              {nftDetails.nfts.map((nft) => (
                <div className="nft-box" key={nft.NFT_ref}>
                  {nft.NFT_Type == "video" ? (
                    <video
                      className="view-image"
                      controls
                      src={`https://bronze-advanced-aardvark-335.mypinata.cloud/ipfs/${nft.NFT_cid}?pinataGatewayToken=BDTCLqWD4c3GL9V8xiS1O-VMJ2s_7PLE_gWEJRQM2iu1EoyxooaciqbI1K4Yj1Qe&_gl=1*1kacgnf*_ga*MTQ3MDQwMzE1MS4xNjkzMjI4MjMy*_ga_5RMPXG14TE*MTcwNDMwMTU3My4zNi4xLjE3MDQzMDE1OTcuMzYuMC4w`}
                      alt={nft.NFT_name}
                    />
                  ) : nft.NFT_Type === "audio" ? (
                    <audio
                      className="view-image"
                      controls
                      src={`https://bronze-advanced-aardvark-335.mypinata.cloud/ipfs/${nft.NFT_cid}?pinataGatewayToken=BDTCLqWD4c3GL9V8xiS1O-VMJ2s_7PLE_gWEJRQM2iu1EoyxooaciqbI1K4Yj1Qe&_gl=1*19pv0ws*_ga*MTQ3MDQwMzE1MS4xNjkzMjI4MjMy*_ga_5RMPXG14TE*MTcwNDIxODI0Ny4zNC4xLjE3MDQyMTgzNTEuNDAuMC4w`}
                      alt={nft.NFT_name}
                    />
                  ) : (
                    <img
                      className="view-image"
                      src={`https://bronze-advanced-aardvark-335.mypinata.cloud/ipfs/${nft.NFT_cid}?pinataGatewayToken=BDTCLqWD4c3GL9V8xiS1O-VMJ2s_7PLE_gWEJRQM2iu1EoyxooaciqbI1K4Yj1Qe&_gl=1*19pv0ws*_ga*MTQ3MDQwMzE1MS4xNjkzMjI4MjMy*_ga_5RMPXG14TE*MTcwNDIxODI0Ny4zNC4xLjE3MDQyMTgzNTEuNDAuMC4w`}
                      alt={nft.NFT_name}
                    />
                  )}
                  <p>NFT Name: {nft.NFT_name}</p>
                  <p>NFT Symbol: {nft.NFT_symbol}</p>
                  <p>NFT Description: {nft.NFT_des}</p>
                  <br/>
                  <div className="viewnftbuttons">
                  <Button variant='contained' sx={{ ml: "2%" , background:"green" }} onClick={() => handleClick(nft.TokenId)}>Check</Button>
                  {nft.Public !== true ? (
                    <Button  variant='contained' sx={{ ml: "0%" ,background:'green' }} onClick={() => updatePublicStatus(nft.NFT_ref, true)}>
                      Public
                    </Button>
                  ) : (
                    <Button variant='contained' sx={{ ml: "0%" ,background:'red' }} onClick={() => updatePublicStatus(nft.NFT_ref, false)}>
                      Private
                    </Button>
                  )}
                   {
                    aid==sessionStorage.accid?<Button onClick={() =>Deletenft(nft.TokenId)} variant='contained' sx={{ m: "0% 0% 0% 0%" , background:"red" }} >Delete</Button> :<b/>
                   }
                  <Link to={`/nftdetails/${aid}/${colname}/${nft.NFT_ref}`}>
                    <Button variant='contained' sx={{ ml: "0%" }}>VIEW</Button>
                  </Link>
                  
               <br/><br/>     
               </div>   
               <br/><br/>
                </div>
                
              ))}
            </div>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </>
  );
}

export default Viewnft;
