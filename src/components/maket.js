//应该有个恐龙/龙蛋的链接
import { Link } from 'react-router-dom';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {Dragen} from './Dragen.js'


const userAddress='0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';
const marketAddress='0xD631348E8915dbBc1F1D18FE6DCBFD6cd8514e6c'

const MarketComponent=()=>{

    return( <div id="container">
     <Link to="/MarketDragen">恐龙商城</Link> 

<Link to="/MarketEgg">龙蛋商城</Link> 
  </div>)
   
}

export default MarketComponent

