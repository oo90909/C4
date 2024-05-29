import { useState, useEffect } from 'react';
import EggCard from './EggCard.js';
import {balanceOf,getAllNFTs,getMetadata,getMyNFTs, getWhoseLength} from '../utils/branding.js';
import { useNavigate } from 'react-router-dom';

const userAddress='0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';
const marketAddress='0xD631348E8915dbBc1F1D18FE6DCBFD6cd8514e6c';

const MarketEgg = () => {
  //调用getallNFt方法获取所有NFT

  const [EggsData, setEggsData] = useState([]);
  const navigate = useNavigate();


  

  useEffect(() => {
    
    const fetchNFTs = async () => {
      const length = await getWhoseLength(false,marketAddress);
      console.log('length', length)
      const array = await getAllNFTs(false);
      console.log("array:",array)
      for (let i = 0; i < length; i++) {
        const tokenId=Number(array[i]);
        console.log('i', tokenId)
        setEggsData((prev) => [...prev, tokenId]);
        setEggsData((prev) => [...new Set(prev)])
      }
    };
    fetchNFTs();
  }, []);

  return (
    <div>
      <h1>egg Component</h1>
      <div className="egg-container" style={{ width: '50%' }}>
        {EggsData.map((egg) => (
          <EggCard tokenId={egg}  />
        ))}
      </div>
    </div>
  );
};

export default MarketEgg;