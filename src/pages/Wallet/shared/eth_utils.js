import Web3 from "web3";
import bsw_player_impl_contract_abi from "./abi/bsw_player_impl.json";
import bsw_bus_impl_contract_abi from "./abi/bsw_bus_impl.json";
import bsw_game_impl_contract_abi from "./abi/bsw_game_impl.json";
import {
  bsw_bus_contract_address,
  bsw_contract_address,
  bsw_game_contract_address,
  bsw_player_contract_address,
  usdt_contract_address,
  wbnb_contract_address
} from "./constant"
import bsw_contract_abi from "./abi/bsw.json"

export const intToHex = (int) => {
  return Web3.utils.toHex(int)
}

export const fromWei = (wei, BN = "ether") => {
  return parseFloat(Web3.utils.fromWei(wei, BN))
}

export const isAddress = (address) => {
  return Web3.utils.isAddress(address)
}

export const checkAddressChecksum = (address) => {
  return Web3.utils.checkAddressChecksum(address)
}


export const getWeb3 = () => {
  if (window.web3) {
    return new Web3(window.web3.currentProvider);
  } else {
    throw Error("not found web3")
  }
}
export const getContractAbi = (web3, abi, address) => {
  return new web3.eth.Contract(abi, address);
}

export const getBswGamePlayers = async (web3, address) => {
  const bsp_contract = getContractAbi(web3, bsw_player_impl_contract_abi, bsw_player_contract_address);
  return await bsp_contract.methods.arrayUserPlayers(address).call()
}


export const getBswGameBuses = async (web3, address) => {
  const bsp_contract = getContractAbi(web3, bsw_bus_impl_contract_abi, bsw_bus_contract_address);
  const balance = parseInt(await bsp_contract.methods.balanceOf(address).call())
  const buses = []
  for (let i = 0; i < balance; i++) {
    const tokenId = await bsp_contract.methods.tokenOfOwnerByIndex(address, i).call();
    const token = await bsp_contract.methods.getToken(tokenId).call();
    buses.push({
      tokenId: parseInt(tokenId),
      createTimestamp: token['createTimestamp'],
      capacity: token['level'],
      level: token['level'],
      uri: token['uri']
    })
  }
  return {
    balance, buses
  }
}


export const getBswGame = async (web3, address) => {
  const contract = getContractAbi(web3, bsw_game_impl_contract_abi, bsw_game_contract_address);
  const playerContracts15Day = await contract.methods.playerContracts(0).call()
  const playerContracts30Day = await contract.methods.playerContracts(1).call()
  const playerContracts60Day = await contract.methods.playerContracts(2).call()
  const gameInfo = await contract.methods.getGameInfo(address).call()
  const userInfo = await contract.methods.userInfo(address).call()
  return {
    userInfo, gameInfo,
    playerContracts:[
      {
        duration:parseInt(playerContracts15Day.duration)/(3600*24),
        enable:playerContracts15Day.enable,
        priceInUSD:fromWei(playerContracts15Day.priceInUSD)
      },
      {
        duration:parseInt(playerContracts30Day.duration)/(3600*24),
        enable:playerContracts30Day.enable,
        priceInUSD:fromWei(playerContracts30Day.priceInUSD)
      },
      {
        duration:parseInt(playerContracts60Day.duration)/(3600*24),
        enable:playerContracts60Day.enable,
        priceInUSD:fromWei(playerContracts60Day.priceInUSD)
      },
    ]
  }
}

export const getGasLimit = async (web3) => {
  const {gasLimit} = await web3.eth.getBlock("latest")
  return gasLimit;
}

export const getNonce = async (web3, address) => {
  const nonce = await web3.eth.getTransactionCount(address, "latest")
  return parseInt(nonce);
}

export const getTokenBalance = async (web3, address, token) => {
  let contract;
  switch (token.toUpperCase()) {
    case "BSW":
      contract = getContractAbi(web3, bsw_contract_abi, bsw_contract_address);
      break
    case "USDT":
      contract = getContractAbi(web3, bsw_contract_abi, usdt_contract_address);
      break
    case "WBNB":
      contract = getContractAbi(web3, bsw_contract_abi, wbnb_contract_address);
      break
    default:
      return 0;
  }
  const balance = await contract.methods.balanceOf(address).call();
  return parseFloat(Web3.utils.fromWei(balance, "ether"));
}

export const getBalance = async (web3, address) => {
  const balance = await web3.eth.getBalance(address)
  return parseFloat(Web3.utils.fromWei(balance, "ether"))
}



const getBalance1 = async (web3, address) => {
  const contract = new web3.eth.Contract(bsw_player_impl_contract_abi, bsw_player_contract_address);
  // const players = await contract.methods.transferFrom(address, "0x0580E3223CBBC05169F2b02472e8E661250f9821", 88763).call();

  // const tx = {
  //     'from': PUBLIC_KEY,
  //     'to': contractAddress,
  //     'nonce': nonce,
  //     'gas': 500000,
  //     'data': nftContract.methods.mintNFT(PUBLIC_KEY, tokenURI).encodeABI()
  //   };

  const nonce = await web3.eth.getTransactionCount(address, 'latest'); //get latest nonce
  debugger
  const data = await contract.methods.transferFrom(address, "0x0580E3223CBBC05169F2b02472e8E661250f9821", 9028).encodeABI()
  debugger
}

export const getTransaction = async (web3, address) => {
  return await web3.eth.getTransaction(address)
}


