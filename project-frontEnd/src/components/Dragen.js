import { useState, useEffect } from 'react';
import DragenCard from './DragenCard.js';
import {balanceOf,getAllNFTs,getMetadata,getMyNFTs, getWhoseLength} from '../utils/branding.js';
import { useNavigate } from 'react-router-dom';

const userAddress='0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';
const marketAddress='0xD631348E8915dbBc1F1D18FE6DCBFD6cd8514e6c'

const Dragen = () => {
  //调用getallNFt方法获取所有NFT

  const [DragensData, setDragensData] = useState([]);
  const navigate = useNavigate();


  

  useEffect(() => {
    
    const fetchNFTs = async () => {
      const length = await getWhoseLength(true,userAddress);
      console.log('length', length)
      const array = await getMyNFTs(true);
      console.log("array:",array)
      for (let i = 0; i < length; i++) {
        const tokenId=Number(array[i]);
        console.log('i', tokenId)
        setDragensData((prev) => [...prev, tokenId]);
        setDragensData((prev) => [...new Set(prev)])
      }
    };
    fetchNFTs();
  }, []);

  return (
    <div>
      <h1>Dradngen Component</h1>
      <div className="dradngen-container" style={{ width: '40%' }}>
        {DragensData.map((dradngen) => (
          <DragenCard tokenId={dradngen}  />
        ))}
      </div>
    </div>
  );
};

export default Dragen;