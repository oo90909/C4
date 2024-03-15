import { Link } from 'react-router-dom';
 

const userAddress='0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';
const marketAddress='0xD631348E8915dbBc1F1D18FE6DCBFD6cd8514e6c'


const Navbar = ({ onConnectWallet, address }) => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">恐龙NFT</div>
      <Link to="/egg">我的龙蛋</Link>
      <Link to="/Dragen">我的恐龙</Link> 
      <Link to="/fuhua">孵化仓❤</Link>
      <Link to="/market">商城</Link>
      <div className="navbar-menu">
        <button className="connect-wallet-button" onClick={onConnectWallet}>
          {address.slice(0, 6) || "Connect Wallet"}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
