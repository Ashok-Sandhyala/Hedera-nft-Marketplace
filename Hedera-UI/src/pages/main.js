import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import NavBar from '../components/Navbar'
import ResponsiveAppBar from "./bar";
import { Button, CircularProgress } from "@mui/material";

function Main() {
    const [data, setdata] = useState([]);
    const [loading, setLoading] = useState(true);
    const accid = sessionStorage.accid
    const nav = useNavigate();
    console.log( sessionStorage.email)
    const Collection = () => {
        nav('/createcollection');
    }

    console.log(sessionStorage.operatorid);
    console.log(sessionStorage.operatorprivatekey);
    console.log(sessionStorage.hederaid);
    console.log(sessionStorage.PrivateKey);
    
    const handleClick = async () => {
        const url = `https://hashscan.io/testnet/account/${sessionStorage.accid}?app=false&p2=1&ph=1&pt=1`;
        window.location.href = url;
    };

    useEffect(() => {
        axios.get(`https://hederanft-server.onrender.com/collections/${ sessionStorage.email}`)
            .then((response) => {
                setdata(response.data);
                setLoading(false);
                console.log(response.data);
            })
            .catch((err) => {
                console.log(err);
                setLoading(false);
            });
    }, []);

    return (
        <>
            <ResponsiveAppBar />
            <br />
            <Button variant='contained' sx={{ m: "0% 0% 0% 0%" }} onClick={Collection}>CREATE COLLECTION</Button>
            {/* <h3>Click here to check your Hashpack Wallet Transaction status</h3> */}
            <Button variant='contained' sx={{ m: "0% 0% 0% 0%", background: "yellowgreen" }} onClick={handleClick}>Check</Button>
            <br />

            {loading ? (
                <CircularProgress sx={{ m: "0px" }} />  
            ) : (
                <div className="main-container">
                    {data && data.map((item) => (
                        <div key={item.Accountid} className="main-collection">
                            <h3>Accountid: {item.Accountid}</h3>
                            <h3>Collection: {item.colname}</h3>
                            <h3>Description: {item.coldes}</h3>
                            <Link to={`/viewnft/${item.Accountid}/${item.colname}`}>
                                <Button variant='contained' sx={{ m: "10% 0% 0% 15%" }}>VIEW NFT</Button>
                            </Link>
                            <Link to={`/createnft/${item.Accountid}/${item.colname}/${item.coldes}`}>
                                <Button variant='contained' sx={{ m: "10% 0% 0% 15%" }}>CREATE NFT</Button>
                            </Link>
                            <br />
                        </div>
                    ))}
                </div>
            )}
        </>
    )
}

export default Main;
