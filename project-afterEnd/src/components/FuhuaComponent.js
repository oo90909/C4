import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { balanceOf, getMetadata, pair, tokenURI } from '../utils/branding';

const FuhuaComponent = () => {
  const [p1, setp1] = useState('');
  const [p2, setp2] = useState('');

  const handleUpload= async()=>{
  console.log("p1",p1)
  console.log("p2",p2) 

await pair(p1,p2)

  }
 
  
  return (

    <form className="upload-form" onSubmit={handleUpload}>

    <div className="Fuhua">
      <input 
          type="text" 
          id="title" 
          placeholder="Enter parent1" 
          value={p1} 
          onChange={(e) => setp1(e.target.value)}
          required 
        />

      <input 
          type="text" 
          id="title" 
          placeholder="Enter parent2" 
          value={p2} 
          onChange={(w) => setp2(w.target.value)}
          required 
        />
<button onClick={handleUpload} className="upload-button">start hei hei hei....</button>
     
    </div>
    </form>
  );
};

export default FuhuaComponent;