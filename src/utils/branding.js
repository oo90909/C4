import {  ethers } from 'ethers';
import ABI from '../contracts/Branding.json';
import axios from 'axios';

let provider = new ethers.BrowserProvider(window.ethereum)

//这里改一下，再把json换了
const userAddress="0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const marketAddress="0xD631348E8915dbBc1F1D18FE6DCBFD6cd8514e6c";

const contract = new ethers.Contract(contractAddress, ABI, await provider.getSigner());

export async function balanceOf() {
    const result = await contract.dinLength();
    return Number(result);
}

//返回owner
export async function tokenOfOwnerByIndex(isDin,index) {
    const result= await contract.getOwner(isDin,index);
    return result;
}

export async function tokenURI(isDin,tokenId) {
    const result= await getMetadata(isDin,tokenId,7)
    return result;
}

//第三个参数是几，就拿到这个结构体里面的第几个属性
export async function getMetadata(isDin,tokenId,choose) {
   
if(isDin==true){
    const result = await contract.getDinosaurValue(tokenId,choose);
    return result
}else{
    const result = await contract.getEggValue(tokenId,choose);
    return result
}
}

export async function buy(isDin,tokenId,value) {
    console.log("value:",value)
    console.log("isDin:",isDin)
    console.log("isDin:",tokenId)
    const tx = await contract.buy(isDin,tokenId,{value:value});
    const result = await tx.wait();
    return tx.hash
}

export async function upload(isDin ,tokenId,price){
    const tx = await contract.upload(isDin,tokenId,price);
    const result = await tx.wait();
   return result.hash;
}


export async function cancelOrder(isDin,tokenId) {
  const result =  await buy(isDin,tokenId);
}

//获取的是id
export async function getAllNFTs(isDin) {
    if(isDin===true){
        const result = await contract.getWhoseDinosaur(marketAddress,0);
        const length=result[1];
        console.log("result length is:",length)
var pop=new Array(length);
        for(let i=0;i<length;i++){
          console.log("i is:",i)
          let number = await contract.getWhoseDinosaur(marketAddress,i);
          console.log("number is:",Number(number[0]))
          pop[i]=Number(number[0]);
        }
        return pop;
    }else{
      const result = await contract.getWhoseEgg(marketAddress,0);
      const length=result[1];
      console.log("result length is:",length)
var lop=new Array(length);
      for(let i=0;i<length;i++){
        console.log("i is:",i)
        let number = await contract.getWhoseEgg(marketAddress,i);
        console.log("number is:",Number(number[0]))
        lop[i]=Number(number[0]);
      }
      return lop;
    } 
   
} 
 
//获取userAddress所有的恐龙
export async function getMyNFTs(isDin) { 
  if(isDin===true){
    const result = await contract.getWhoseDinosaur(userAddress,0);
    const length=result[1];
    console.log("result length is:",length)
var pop=new Array(length);
    for(let i=0;i<length;i++){
      console.log("i is:",i)
      let number = await contract.getWhoseDinosaur(userAddress,i);
      console.log("number is:",Number(number[0]))
      pop[i]=Number(number[0]);
    }
    return pop;
}else{
  const result = await contract.getWhoseEgg(userAddress,0);
  const length=result[1];
  console.log("result length is:",length)
var lop=new Array(length);
  for(let i=0;i<length;i++){
    console.log("i is:",i)
    let number = await contract.getWhoseEgg(userAddress,i);
    console.log("number is:",Number(number[0]))
    lop[i]=Number(number[0]);
  }
  return lop;
} 
}

//获取某个用户持有的恐龙/龙蛋数量
export async function getWhoseLength(isDin,address){
  if(isDin==true){
    const length=await contract.getWhoseDinosaur(address,0);
  return length[1]
  }else{
    const length=await contract.getWhoseEgg(address,0);
return length[1]
  }
}

export async function fuHua(index){
 
await contract.hatchEgg(index);

}

export async function pair(index1,index2){
  await contract.pairDinosaurs(index1,index2)
}

export async function getOffEgg(index){
  await contract.getOffEgg(index)
}
