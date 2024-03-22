import {MongoClient} from "mongodb";
import dotenv from 'dotenv';
dotenv.config();

let db; 

async function connectToDB(cb){
    const url = process.env.mongodb_url;
    const client = new MongoClient(url);
    await client.connect();
    db = client.db("NFT_MARKET");
    cb();
}

export {db,connectToDB};