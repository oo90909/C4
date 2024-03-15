import React from 'react';
import { Link } from 'react-router-dom';
import { getMetadata, tokenURI, upload ,buy,tokenOfOwnerByIndex} from '../utils/branding.js'; // 假设获取数据和图片的函数
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Contract } from 'ethers';


const DradngeCard = ({ tokenId }) => {
  // console.log(tokenId)
  const [metadata, setMetadata] = useState({
     id:null,
     isMale:null,
     isPaired:null,
     species:null,
     color:null,
     rarity:null,
     owner:null,
     pictrueUri:null
  });

  const [url, setUrl] = useState('');
  const navigate = useNavigate();


 

      const onConnectWallet=async()=>{
await upload(true,tokenId,10000)
      }

      const goToMarket=async()=>{

        await buy(false,tokenId,10000)
    
      }
    

  useEffect(() => {
    const getInfo = async () => {
      const _id = await getMetadata(true,tokenId,0);
       const _isMale = await getMetadata(true,tokenId,1);
       const _isPaired = await getMetadata(true,tokenId,2);
       const _species=await getMetadata(true,tokenId,3);
       const _color=await getMetadata(true,tokenId,4);

       const _rarity=await getMetadata(true,tokenId,5);
       const _owner=await tokenOfOwnerByIndex(true,tokenId);

       const _pictrueUri=await getMetadata(true,tokenId,7);


      setMetadata({ id:_id,
        isMale:_isMale,
     isPaired:_isPaired,
     species:_species,
     color:_color,
     rarity:_rarity,
     owner:_owner,
     pictrueUri:_pictrueUri
        })

    const url = await tokenURI(true,tokenId);
      setUrl(url);
    }
    getInfo();
  }, []);
  return (
    <div className="nft-card" >
      <div className="nft-image">
        <img src={url} alt={"图片"} />
      </div>
      <div className="nft-info">
        <h3>id:{metadata.id}</h3>
        <h3>isMale:{metadata.isMale}</h3>
        <h3>isPaired:{metadata.isPaired}</h3>
        <h3>species:{metadata.species}</h3>
        <h3>color:{metadata.color}</h3>
        <h3>rarity:{metadata.rarity}</h3>
        <h3>owner:{metadata.owner}</h3>
        <h3>pictrueUri:{metadata.pictrueUri}</h3>


      </div>
     
      <button className="connect-wallet-button" onClick={onConnectWallet}>upload</button>
      <button className="button2" onClick={goToMarket}>购买</button>    


    </div>
  );
};


export default DradngeCard;