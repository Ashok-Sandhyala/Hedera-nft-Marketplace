import express from 'express';
import cors from "cors";
import {db,connectToDB} from '../src/db.js';
import dot from "dotenv";
dot.config();

const app=express()
app.use(express.json()) 
app.use(cors())
const ipfs_api_key = process.env.ipfs_api_key;
const ipfs_secret_api_key = process.env.ipfs_secret_api_key;
const operatorAccountId = process.env.MY_ACCOUNT_ID;
const operatorPrivatekey = process.env.MY_PRIVATE_KEY;

app.get('/ipfsapi',async(req,res)=>{
  res.json({ipfs_api_key,ipfs_secret_api_key,operatorAccountId,operatorPrivatekey})
})


//***********************************Registration *********************************************************/

app.post('/registration/:email/:password/:hederaid/:hederaprivatekey/',async(req,res)=>{
  const details = await db.collection('Userdetails').insertOne({
    Email : req.params.email,
    Password : req.params.password,
    HederaId : req.params.hederaid,
    HederaPrivatekey : req.params.hederaprivatekey,
  })
  res.json(details);
})
app.post('/updatePassword/:email/:confirmPassword', async (req, res) => {
  try {
    const collection = db.collection('Userdetails');
    
    const filter = { Email: req.params.email };
    const update = { $set: { Password: req.params.confirmPassword } };

    const result = await collection.findOneAndUpdate(filter, update, { returnDocument: 'after' });

    if (result.value) {
      res.json({ success: true, message: 'Password updated successfully.' });
    } else {
      res.json({ success: false, message: 'User not found or password not updated.' });
    }
  } catch (error) {
    console.error('Error updating password:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});

app.get('/check-email/:email', async (req, res) => {
  const details = await db.collection('Userdetails').findOne({ Email: req.params.email });
  res.json(details);
});

app.get('/login/:mail/:password',async(req,res)=>{
  const details = await db.collection('Userdetails').findOne({
    Email : req.params.mail,
    Password : req.params.password,
    
  })
  res.json(details);
})

//**********************************create collection*************************************************************/
app.post('/create/:id/:mail/:hederaid/:colname/:coldes',async(req,res)=>{
    const details = await db.collection('NFT_Details').insertOne({
        Accountid : req.params.id,
        Email : req.params.mail,
        Hederaid : req.params.hederaid,
        colname : req.params.colname,
        coldes : req.params.coldes
    });
    res.json(details);
})
app.get('/collectiondetails/:email',async(req,res)=>{
  const {email} = req.params;
  const details = await db.collection('Userdetails').findOne({Email : email})
  res.json(details)
})

app.get('/collections/:email/:walletid',async(req,res)=>{
  const {email} = req.params;
  const {walletid} = req.params;
  const details = await db.collection('NFT_Details').find({Email : email , Accountid : walletid}).toArray()
  res.json(details)
})

app.get('/collectiondetails/',async(req,res)=>{
  // const { accountid } = req.params;
  const details = await db.collection('NFT_Details').find().toArray()
  res.json(details);
})

//************************************************Create NFT******************************************************/

app.get('/accountdetails/:email',async(req,res)=>{
  const {email} = req.params;
  const details = await db.collection('Userdetails').find({Email : email}).toArray()
  res.json(details);
})


app.post('/createnft', async (req, res) => {
  try {
    const {
      Email,
      Hid,
      aid,
      colname,
      coldes,
      tokenId,
      nft,
      nft_ref,
      nftsymbol,
      nftdes,
      price,
      royality,
      pltformcharge,
      selectedMediaType,
      ipfsHash,
      Metadatahash,
    } = req.body;

    const existingDocument = await db.collection('NFT_Details').findOne({
      Accountid: aid,
      colname: colname,
    });

    if (existingDocument) {
      const updatedDocument = await db.collection('NFT_Details').findOneAndUpdate(
        { Accountid: aid, colname: colname },
        {
          $push: {
            nfts: {
              Email : Email,
              HederaId : Hid,
              CreaterId: aid,
              OwnerId: aid,
              TokenId: tokenId,
              NFT_name: nft,
              NFT_ref: nft_ref,
              NFT_symbol: nftsymbol,
              NFT_des: nftdes,
              NFT_price: price,
              NFT_Royality: royality,
              PlatformCharge: pltformcharge,
              NFT_Type: req.body.selectedMediaType,
              NFT_cid: ipfsHash,
              Metadata_CID: Metadatahash,
              Public: false,
            },
          },
        },
        {
          returnOriginal: false, // Return the updated document
        }
      );

      res.json(updatedDocument.value);
    } else {
      // If the document doesn't exist, create a new one
      const newDocument = await db.collection('NFT_Details').insertOne({
        Accountid: aid,
        colname: colname,
        coldes: coldes,
        nfts: {
          Email : Email,
          HederaId : Hid,
          CreaterId: aid,
          OwnerId: aid,
          TokenId: tokenId,
          NFT_name: nft,
          NFT_ref: nft_ref,
          NFT_symbol: nftsymbol,
          NFT_des: nftdes,
          NFT_price: price,
          NFT_Royality: royality,
          PlatformCharge: pltformcharge,
          NFT_Type: req.body.selectedMediaType,
          NFT_cid: ipfsHash,
          Metadata_CID: Metadatahash,
          Public: false,
        },
      });
      res.json(newDocument.ops[0]);
    }
  } catch (error) {
    console.error('Error creating NFT:', error);
    res.status(500).send('Internal Server Error');
  }
});


app.post('/createnft123/:aid/:colname/:coldes/:tokenId/:nft/:nft_ref/:nftsymbol/:nftdes/:price/:royality/:pltformcharge/:nfttype/:ipfsHash', async (req, res) => {
    const { aid, colname, coldes,tokenId, nft, nft_ref, nftsymbol, nftdes,price,royality,pltformcharge,nfttype,ipfsHash } = req.params;
    const existingDocument = await db.collection('NFT_Details').findOne({ Accountid: aid, colname: colname });
    if (existingDocument) {
      const updatedDocument = await db.collection('NFT_Details').findOneAndUpdate(
        { Accountid: aid, colname: colname },
        {
          $push: {
            nfts: {
              CreaterId : aid,
              OwnerId : aid,
              TokenId : tokenId,
              NFT_name: nft,
              NFT_ref: nft_ref,
              NFT_symbol: nftsymbol,
              NFT_des: nftdes,
              NFT_price : price,
              NFT_Royality : royality,
              PlatformCharge : pltformcharge,
              NFT_Type : nfttype,
              NFT_cid: ipfsHash,
              Public : false,
            }
          }
        },
        {
          returnOriginal: false // Return the updated document
        }
      );
  
      res.json(updatedDocument.value);
    } else {
      // If the document doesn't exist, create a new one
      const newDocument = await db.collection('NFT_Details').insertOne({
        Accountid: aid,
        colname: colname,
        coldes: coldes,
        nfts: {
          CreaterId : aid,
          OwnerId : aid,
          TokenId : tokenId,
          NFT_name: nft,
          NFT_ref: nft_ref,
          NFT_symbol: nftsymbol,
          NFT_des: nftdes,
          NFT_price : price,
          NFT_Royality : royality,
          PlatformCharge : pltformcharge,
          NFT_Type : nfttype,
          NFT_cid: ipfsHash,
          Public : false,
        }
      });
  
      res.json(newDocument.ops[0]);
    }
  });
  
/*******************************************Buy nft *********************************************************/
  app.post('/transfernft', async (req, res) => {
    const {
      Email,
      Hid,
      aid,
      colname,
      coldes,
      tokenId,
      nft,
      nft_ref,
      nftsymbol,
      nftdes,
      price,
      royality,
      pltformcharge,
      selectedMediaTyp,
      ipfsHash,
    } = req.body;
  
    const existingDocument = await db.collection('NFT_Details').findOne({ Accountid: aid, colname: colname });
  
    if (existingDocument) {
      try {
        const updatedDocument = await db.collection('NFT_Details').findOneAndUpdate(
          { Accountid: aid, colname: colname },
          {
            $push: {
              nfts: {
                CreaterId : creatorid,
                OwnerId : aid,
                TokenId: tokenId,
                NFT_name: nft,
                NFT_ref: nft_ref,
                NFT_symbol: nftsymbol,
                NFT_des: nftdes,
                NFT_price: price,
                NFT_Royality: royality,
                PlatformCharge: pltformcharge,
                NFT_cid: ipfsHash,
                Public: false,
              }
            }
          }
          ,
          {
            returnOriginal: false // Return the updated document
          }
        );
  
        if (updatedDocument) {
          res.json(updatedDocument);
        }
      } catch (error) {
        res.status(500).json({ error: error.toString() });
      }
    } else {
      try {
        
        const newDocument = await db.collection('NFT_Details').insertOne({
          Accountid: aid,
          colname: colname,
          coldes: coldes,
          nfts: [{
            CreaterId : creatorid,
            OwnerId : aid,
            TokenId: tokenId,
            NFT_name: nft,
            NFT_ref: nft_ref,
            NFT_symbol: nftsymbol,
            NFT_des: nftdes,
            NFT_price: price,
            NFT_Royality: royality,
            PlatformCharge: pltformcharge,
            NFT_cid: ipfsHash,
            Public: false,
          }]
        });
        res.json(newDocument);
      } catch (error) {
        res.status(500).json({ error: error.toString() });
      }
    }
  });
  
  /*********************************view NFT *******************************************************************************************/

  app.get('/viewnft/:aid/:colname', async (req, res) => {
    const { aid, colname } = req.params;
    const collectionDocument = await db.collection('NFT_Details').findOne({$and: [{Accountid : aid} ,{colname : colname },]},{nfts :1});
    res.json(collectionDocument);
  });
    
  /**********************************NFT Details retrieve**********************************************************/
  
  app.get('/nftdetails/:nft_ref', async (req, res) => {
    const nft_ref = req.params.nft_ref; 
    try {
      const nftdetails = await db.collection('NFT_Details').findOne({
        'nfts': { $elemMatch: { NFT_ref: nft_ref } }
      });
      if (nftdetails) {
        const matchingNFT = nftdetails.nfts.find(x => x.NFT_ref === nft_ref);
        res.json(matchingNFT);
      } 
    }catch(err){
      console.log(err);
    }
  });
  
/****************************************public update**************************************************************/


app.put('/updatePublicStatus/:aid/:nft_ref', async (req, res) => {
    const { aid, nft_ref } = req.params;
    const { isPublic } = req.body;
    try {
      const result = await db.collection('NFT_Details').findOneAndUpdate(
        { 'Accountid': aid, 'nfts.NFT_ref': nft_ref },
        { $set: { 'nfts.$.Public': isPublic } },
        { returnOriginal: false }
      );
      if (result.value) {
        res.json({ success: true, message: `Public status updated to ${isPublic}` });
      } else {
        res.json({ success: false, message: 'NFT not found' });
      }
    } catch (error) {
      console.error('Error updating Public status:', error);
    }
  });
  
  
  /**************************************Published NFTS (Home page visible NFTS*********************************** */
  
  app.get('/viewpublishednfts', async (req, res) => {
    try {
      const details = await db.collection('NFT_Details').find({}).toArray();
      const publishedNFTs = details.reduce((acc, collection) => {
        // Check if collection.nfts exists before using filter
        if (collection.nfts && Array.isArray(collection.nfts)) {
          const publishedCollectionNFTs = collection.nfts.filter((nft) => nft.Public === true);
          if (publishedCollectionNFTs.length > 0) {
            acc.push({
              accounid: collection.Accountid,
              colname: collection.colname,
              coldes: collection.coldes,
              nfts: publishedCollectionNFTs,
            });
          }
        }
        return acc;
      }, []);
      res.json(publishedNFTs);
    } catch (error) {
      console.error('Error fetching published NFTs:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  });


/***************************************Delete NFT************************************************************/

  app.delete('/deletenft/:aid/:colname/:TokenId', async (req, res) => {
  const { aid, colname, TokenId } = req.params;
  try {
    const existingDocument = await db.collection('NFT_Details').findOne({ Accountid: aid, colname: colname });
    if (existingDocument) {
      const nftIndex = existingDocument.nfts.findIndex((nft) => nft.TokenId === TokenId);
      if (nftIndex !== -1) {
        existingDocument.nfts.splice(nftIndex, 1);
        const result = await db.collection('NFT_Details').updateOne(
          { Accountid: aid, colname: colname },
          { $set: { nfts: existingDocument.nfts } }
        ); 
        res.json(result);
      } 
    } else {
      console.log("Document not found.");
      res.status(404).json({ error: "Document not found" });
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "An error occurred while deleting the NFT." });
  }
});



/*****************************************edit nft details*******************************************************/

app.put('/editnftdetails/', async (req, res) => {
  const { aid, colname, nft_ref, nftname, nftsymbol, nftdes, price, royality, pltformcharge } = req.body;

  try {
    const existingDocument = await db.collection('NFT_Details').findOne({ Accountid: aid, colname: colname });

    if (existingDocument) {
      const nftIndex = existingDocument.nfts.findIndex((nft) => nft.NFT_ref === nft_ref);

      if (nftIndex !== -1) {
        // Update NFT details
        existingDocument.nfts[nftIndex] = {
          ...existingDocument.nfts[nftIndex],
          NFT_name: nftname,   // Use the same variable names as in the frontend
          NFT_symbol: nftsymbol,
          NFT_des: nftdes,
          NFT_price: price,
          NFT_Royality: royality,
          PlatformCharge: pltformcharge,
        };

        const result = await db.collection('NFT_Details').updateOne(
          { Accountid: aid, colname: colname, 'nfts.NFT_ref': nft_ref }, // Correct the query to match the subdocument
          { $set: { 'nfts.$': existingDocument.nfts[nftIndex] } } // Use $ to update the matched subdocument
        );

        res.status(200).json({ message: "NFT updated successfully" });
      } else {
        res.status(404).json({ error: "NFT not found" });
      }
    } else {
      res.status(404).json({ error: "Document not found" });
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "An error occurred while updating the NFT." });
  }
});

/***********************************************Buy NFT*******************************************************/

app.post('/buyingnft', async (req, res) => {
  const {
    Email,
    Hid,
    aid,
    colname,
    coldes,
    tokenId,
    nft,
    nft_ref,
    nftsymbol,
    nftdes,
    price,
    royality,
    pltformcharge,
    selectedMediaType,
    ipfsHash,
    creatorId,
    Metadatahash,
  } = req.body;

  const existingDocument = await db.collection('NFT_Details').findOne({ Accountid: aid, colname: colname });

  if (existingDocument) {
    try {
      const updatedDocument = await db.collection('NFT_Details').findOneAndUpdate(
        { Accountid: aid, colname: colname },
        {
          $push: {
            nfts: {
              Email : Email,
              HederaId : Hid,
              CreaterId: creatorId,
              OwnerId: aid,
              TokenId: tokenId,
              NFT_name: nft,
              NFT_ref: nft_ref,
              NFT_symbol: nftsymbol,
              NFT_des: nftdes,
              NFT_price: price,
              NFT_Royality: royality,
              PlatformCharge: pltformcharge,
              NFT_cid: ipfsHash,
              NFT_Type : selectedMediaType,
              Public: false,
              Metadata_CID : Metadatahash,
            }
          }
        },
        {
          returnOriginal: false // Return the updated document
        }
      );

      if (updatedDocument) {
        res.json(updatedDocument);
      }
    } catch (error) {
      res.status(500).json({ error: error.toString() });
    }
  } else {
    try {
      const newDocument = await db.collection('NFT_Details').insertOne({
        Email : Email,
        Accountid: aid,
        colname: colname,
        coldes: coldes,
        Hederaid : Hid,
        nfts: [{
          Email : Email,
              HederaId : Hid,
              CreaterId: creatorId,
              OwnerId: aid,
              TokenId: tokenId,
              NFT_name: nft,
              NFT_ref: nft_ref,
              NFT_symbol: nftsymbol,
              NFT_des: nftdes,
              NFT_price: price,
              NFT_Royality: royality,
              PlatformCharge: pltformcharge,
              NFT_cid: ipfsHash,
              NFT_Type : selectedMediaType,
              Public: false,
              Metadata_CID : Metadatahash,
        }]
      });
      res.json(newDocument);
    } catch (error) {
      res.status(500).json({ error: error.toString() });
    }
  }
});
//******************************************************************************************************************/

app.get('/',(req,res)=>{
    res.send("server running successfully")
})
connectToDB(()=>{
    app.listen(9000,()=>{
        console.log('server Running at port 9000')
    })
}
)