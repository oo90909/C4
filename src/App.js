import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';


import Navbar from './components/Navbar.js';

import NFTGrid from './components/NFTGrid.js';
import FuhuaComponent from './components/FuhuaComponent.js';
import Egg from './components/Egg.js';
import MarketEgg from './components/marketEgg.js';

import Dragen from './components/Dragen.js';
import MarketDragen from './components/marketDragen.js';

import MarketComponent from './components/maket.js';
import EggCard from './components/EggCard.js';
function App() {
  const [walletAddress, setWallet] = useState("");

  useEffect(() => {
    addWalletListener();
  }, []);

  function addWalletListener() {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          setWallet(accounts[0]);
        } else {
          setWallet("");
        }
      });
    }
  }

  const getWalletAddress = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setWallet(accounts[0]); // Set the first account as the connected account
      } catch (error) {
        console.error('Error connecting to wallet:', error);
      }
    }
  };

  return (
    <div id="container">
      <Router>
        <Navbar onConnectWallet={getWalletAddress} address={walletAddress} />

        <Routes>
          <Route path="/egg" element={<Egg />} />
          <Route path="/" element={<Dragen />} />
          
          <Route path="/Dragen" element={<Dragen />} />
          <Route path="/MarketDragen" element={<MarketDragen />} />
          <Route path="/MarketEgg" element={<MarketEgg />} />


          <Route path="/fuhua" element={<FuhuaComponent />} />
          <Route path="/market" element={<MarketComponent />} />
          <Route path="/eggcard" element={<EggCard />} />
        </Routes>
      </Router>
    </div>
  );


};

export default App;
