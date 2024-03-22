import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useWalletInterface } from "../services/wallets/useWalletInterface";
import NavBar from "../components/Navbar";

function Nftdetails() {
  const { walletInterface } = useWalletInterface();
  const nav = useNavigate();
  const {aid} = useParams();
  const {colname} = useParams();
  const { nft_Ref } = useParams();
  console.log("nft_Ref:", nft_Ref);

  const [nftDetails, setNFTDetails] = useState([{}]); // Initialize as an array with an empty object
  console.log(nftDetails);

  const [showPopup, setShowPopup] = useState(false);
  const [isLoading,setIsLoading] = useState(false);
  const [nftname, setnftname] = useState([]);
  const [id,setid] = useState([]);
  const [collname,setcollname] = useState([]);
  const [nftsymbol, setnftsymbol] = useState([]);
  const [nftdes, setnftdes] = useState([]);
  const [nftref,setnftref] = useState([]);
  const [price, setprice] = useState([]);
  const [royality, setroyality] = useState([]);
  const [pltformcharge, setpltformcharge] = useState([]);
  const [rmv,srmv] = useState([])


  const openPopup = () => {
    document.getElementById("editnft");
    setShowPopup(true);
    setnftref(rmv.NFT_ref)
    setnftname(rmv.NFT_name)
    setnftsymbol(rmv.NFT_symbol)
    setnftdes(rmv.NFT_des)
    setprice(rmv.NFT_price)
    setroyality(rmv. NFT_Royality)
    setpltformcharge(rmv. PlatformCharge )
  };

  const closePopup = () => {
    setShowPopup(false);
  };


  const Updatenft = async () => {
    const nft_ref = rmv.NFT_ref;
    await axios
      .put("https://hederanft-server.onrender.com/editnftdetails", {
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
  const Deletenft=(nft_ref)=>{
    axios.delete(`https://hederanft-server.onrender.com/deletenft/${aid}/${colname}/${nft_ref}`)
    .then((responce)=>{
        alert('NFT deleted with NFT_ref : ${nft_ref}');
        nav('/viewnft');
    })
    .catch((error)=>{
        alert('NFT not Possible to delete ');
    }); 
  }

  

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
    <NavBar/>
      <div className="nftdetails-container"> 
        {nftDetails.map((nft) => (
          <div key={nft.NFT_ref} className="nft_details">
            <div>
            <Button style={{color:"white" , fontSize:"30px"}}>NFT DETAILS :</Button><br/>
            <Button style={{color:"white" , fontSize:"20px"}} >NFT OWNER : </Button><Button sx={{ml : "65px", fontSize:"20px"}}>{sessionStorage.accid}</Button><br/>
            <Button style={{color:"white",  fontSize:"20px"}} >NFT Name : </Button><Button sx={{ml:"80px" , fontSize:"20px"}}>{nft.NFT_name}</Button><br/>
            <Button style={{color:"white",  fontSize:"20px"}} >NFT Description : </Button ><Button sx={{fontSize:"20px"}}>{nft.NFT_des}</Button><br/>
            <Button style={{color:"white",  fontSize:"20px"}} >NFT Symbol : </Button ><Button sx={{ml:"60px" , fontSize:"20px"}}>{nft.NFT_symbol}</Button><br/>
            <Button style={{color:"white",  fontSize:"20px"}} >NFT Price : </Button><Button sx={{ml:"80px" , fontSize:"20px"}}>{nft.NFT_price} HBARS</Button><br/>
            <Button style={{color:"white",  fontSize:"20px"}} >Royality : </Button><Button sx={{ml:"90px" , fontSize:"20px"}}>{nft.NFT_Royality} HBARS</Button><br/>
            <Button style={{color:"white",  fontSize:"20px"}} >PlatformCharge : </Button><Button sx={{fontSize:"20px"}}>{nft.PlatformCharge} HBARS</Button><br/><br/>
            {/* <h2>NFT OWNER : {sessionStorage.accid}</h2>
            <h2>NFT Name : {nft.NFT_name}</h2>
            <h2>NFT Symbol : {nft.NFT_symbol}</h2>
            <h2>NFT Description : {nft.NFT_des}</h2>
            <h2>NFT Price : {nft.NFT_price} HBARS</h2>
            <h2>Royality : {nft.NFT_Royality} HBARS</h2>
            <h2>PlatformCharge : {nft.PlatformCharge} HBARS</h2> */}
            {
              aid==sessionStorage.accid?<Button onClick={async() => { const associateId = await walletInterface.associateToken(nft.TokenId); console.log(associateId)}} variant='contained' sx={{ ml: "0%" , background:"green" }}>Associate</Button>:<b/>
            }
            {
                aid==sessionStorage.accid?<Button onClick={openPopup} onClickCapture={(e)=>srmv(nft)} variant='contained' sx={{ ml: "1%" , background:"violet" }} >update</Button>:<b/>
            } 
            {
                aid==sessionStorage.accid?<Button onClick={() =>Deletenft(nft.NFT_ref)} variant='contained' sx={{ ml: "1% " , background:"red" }} >Delete</Button> :<b/>
            }
            {
              aid==sessionStorage.accid?<b/>:<Button variant='contained' sx={{ ml: "0%" , background:"green" }}>BUY</Button>
            }
            </div>
            <div>
            {nft.NFT_Type == "video" ? (
                    <video
                      className="nft-image"
                      controls
                      src={`https://bronze-advanced-aardvark-335.mypinata.cloud/ipfs/${nft.NFT_cid}?pinataGatewayToken=BDTCLqWD4c3GL9V8xiS1O-VMJ2s_7PLE_gWEJRQM2iu1EoyxooaciqbI1K4Yj1Qe&_gl=1*1kacgnf*_ga*MTQ3MDQwMzE1MS4xNjkzMjI4MjMy*_ga_5RMPXG14TE*MTcwNDMwMTU3My4zNi4xLjE3MDQzMDE1OTcuMzYuMC4w`}
                      alt={nft.NFT_name}
                    />
                  ) : nft.NFT_Type === "audio" ? (
                    <audio
                      className="nft-image"
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

{showPopup && (
              <div className="popup">
                <div className="popup-content">
                  <span className="close-popup" onClick={closePopup}>
                    &times;<Button variant='contained' sx={{ m: "0% 0% 0% 0%" , background:"red" }} >Close</Button>
                  </span>
                  
    <div className="createcol-container" id="editnft">
        <h2>Edit Nft</h2>
        <label>Account id : </label>
        <input type="text" name="id" value={aid} onChange={(e)=>(setid(e.target.value))} />
        <br/>
        <br/>
        <label>Collection Name : </label>
        <input type="text" name="colname" value={colname} onChange={(e)=>setcollname(e.target.value)}/>
        <br/>
        <br/>
        <label> NFT-Token Name : </label>
        <input type="text" defaultValue={nftname} name="nftname" onChange={(e)=>setnftname(e.target.value)}/>
        <br/>
        <br/>
        <label >NFT-Token Symbol : </label>
        <input type="text" defaultValue={nftsymbol} name="nftsymbol" pattern="[A-Z]" onChange={(e)=>setnftsymbol(e.target.value)}/>
        <br/>
        <br/>
        <label>NFT-Token Description : </label>
        <input type="text" defaultValue={nftdes} name="nftdes" onChange={(e)=>setnftdes(e.target.value)}/>
        <br/>
        <br/>
        <label>NFT-Token Price : </label>
        <input type="number" defaultValue={price} onChange={(e)=>setprice(e.target.value)} />
        <br/>
        <br/>
        <label> NFT-Token Royality :</label>
        <input type="number" defaultValue={royality} onChange={(e)=>setroyality(e.target.value)}/>
        <br/>
        <br/>
        <label> NFT Platform Price :</label>
        <input type="number" defaultValue={pltformcharge} onChange={(e)=>setpltformcharge(e.target.value)} />
        <br/>
        <br/>
        {/* <label >NFT-Token-File : </label>
        <input type="file" onChange={(e)=>setfile(e.target.files[0])} /> */}
        <br/>
        <br/>
        <button onClick={Updatenft} disabled={isLoading}>
          {isLoading ? 'Updating NFT...' : 'Update NFT'}
        </button>
    </div>

                </div>
              </div>
            )}
            </div>
        ))}        
      </div>
    </>
  );
}

export default Nftdetails;
