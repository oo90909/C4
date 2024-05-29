import React from 'react';
import { Link } from 'react-router-dom';
import { buy, fuHua, getMetadata, getOffEgg, tokenURI, upload ,tokenOfOwnerByIndex} from '../utils/branding.js'; // 假设获取数据和图片的函数
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { id } from 'ethers';

const EggCard = ({ tokenId }) => {
  // console.log(tokenId)
  const [url, setUrl] = useState('');
  const navigate = useNavigate();

  const [metadata, setMetadata] = useState({
    id:null,
    parentId1:null,
    parentId2:null,
    species:null,
    owner:null,
    isHatched:null,
 });
  

  const onConnectWallet=async()=>{
await fuHua(tokenId)
  }

  const goToMarket=async()=>{

    await buy(false,tokenId,10000)

  }

  const upL=async()=>{
    await upload(false,tokenId,10000)
  }

  const getOff=async()=>{
     await getOffEgg(tokenId)
  }

  useEffect(() => {
    const getInfo = async () => {
      const _id = await getMetadata(false,tokenId,0);
      const _d1 = await getMetadata(false,tokenId,1);
      const _d2 = await getMetadata(false,tokenId,2);
      const _species=await getMetadata(false,tokenId,3);
      const _owner=await tokenOfOwnerByIndex(false,tokenId);

      const _isHatched=await getMetadata(false,tokenId,5);

     setMetadata({ id:_id,
       parentId1:_d1,
       parentId2:_d2,
       species:_species,
       owner:_owner,
       isHatched:_isHatched})

      const url = "https://picdm.sunbangyan.cn/2023/12/29/725d475c11f56bde0d44350ba378a611.jpeg";

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
        <h3>parent1:{metadata.d1}</h3>
        <h3>parent2:{metadata.d2}</h3>
        <h3>species:{metadata.species}</h3>
        <h3>owner:{metadata.owner}</h3>

        <h3>isHatched:{metadata.isHatched}</h3>

      </div>
      <button className="connect-wallet-button" onClick={onConnectWallet}>孵化</button>

      <button className="button2" onClick={goToMarket}>购买</button>    
      <button className="button3" onClick={upL}>upload</button>   
      <button className="connect-wallet-button" onClick={getOff}>取走</button>

      </div>
  );
};


export default EggCard;