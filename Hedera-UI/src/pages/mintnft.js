import React, { useState } from 'react';
import FormData from 'form-data';
import axios from 'axios';

const FileUploadForm = () => {
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const uploadFileToIPFS = async () => {
    try {
      const data = new FormData();
      data.append('file', file);
      data.append('pinataMetadata', '{"name":"pinnie nft image "}');

      const res = await axios.post(
        'https://api.pinata.cloud/pinning/pinFileToIPFS',
        data,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            pinata_api_key: sessionStorage.pinata_api_key,
            pinata_secret_api_key: sessionStorage.pinata_secret_api_key,
          },
        }
      );

      // Use response directly for axios
      const ipfsHash = res.data.IpfsHash;
      console.log('File uploaded CID:', ipfsHash);

      // Return the CID to be used for metadata
      return ipfsHash;
    } catch (error) {
      console.error(error);
      throw error; // Rethrow the error to handle it in the calling function
    }
  };

  const uploadMetadataToIPFS = async (cid) => {
    try {
      const metadata = {
        name: 'pinnie nft',
        description: 'a pinnie minted with pinata ',
        external_url: 'https://pinata.cloud',
        Image: `ipfs://${cid}`,
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

      return metadataHash;
    } catch (error) {
      console.error(error);
      throw error; // Rethrow the error to handle it in the calling function
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const fileCID = await uploadFileToIPFS();
      const metadataCID = await uploadMetadataToIPFS(fileCID);

      // Use the metadataCID as needed
    } catch (error) {
      // Handle errors from both file and metadata uploads
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="fileInput">Choose a file:</label>
        <input type="file" id="fileInput" onChange={handleFileChange} />
      </div>
      <button type="submit">Upload File</button>
    </form>
  );
};

export default FileUploadForm;
