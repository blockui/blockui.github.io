import bsw_player_impl_contract_abi from "./abi/bsw_player_impl.json";
import bsw_game_impl_contract_abi from "./abi/bsw_game_impl.json";
import bsw_bus_impl_contract_abi from "./abi/bsw_bus_impl.json";
import {bsw_bus_contract_address, bsw_game_contract_address, bsw_player_contract_address} from "./constant";
import {sendTransaction} from "./metamask";
import {getWeb3, intToHex} from "./eth_utils";

export const sendPlayerTransaction = async (formAddress, toAddress, tokenId) => {
  const web3 = getWeb3();
  // debugger
  const contract = new web3.eth.Contract(bsw_player_impl_contract_abi, bsw_player_contract_address);
  const gasLimit = await contract.methods.safeTransferFrom(formAddress, toAddress, tokenId).estimateGas({gas: 5000000})
  const data = await contract.methods.safeTransferFrom(formAddress, toAddress, tokenId).encodeABI()
  const tx = {
    'from': formAddress,
    "to": bsw_player_contract_address,
    gas: intToHex(gasLimit),
    data
  };
  console.log("sendTransaction", tx)
  const txHash = await sendTransaction(web3, [tx])
  console.log({txHash})
  return txHash;
}

export const sendBusTransaction = async (formAddress, toAddress, tokenId) => {
  const web3 = getWeb3();
  // debugger
  const contract = new web3.eth.Contract(bsw_bus_impl_contract_abi, bsw_bus_contract_address);
  debugger
  const gasLimit = await contract.methods.safeTransferFrom(formAddress, toAddress, tokenId).estimateGas({gas: 5000000})
  const data = await contract.methods.safeTransferFrom(formAddress, toAddress, tokenId).encodeABI()
  const tx = {
    'from': formAddress,
    "to": bsw_bus_contract_address,
    gas: intToHex(gasLimit),
    data
  };
  console.log("sendTransaction", tx)
  const txHash = await sendTransaction(web3, [tx])
  console.log({txHash})
  return txHash;
}


export const startGameTransaction = async (formAddress, gameIndex, playerIds) => {
  const web3 = getWeb3();
  const contract = new web3.eth.Contract(bsw_game_impl_contract_abi, bsw_game_contract_address);
  debugger

  const gasLimit = await contract.methods.playGame(gameIndex, playerIds).estimateGas({
    gas: 5000000,
    from: formAddress
  })
  const data = await contract.methods.playGame(gameIndex, playerIds).encodeABI()

  const tx = {
    'from': formAddress,
    "to": bsw_game_contract_address,
    gas: intToHex(gasLimit),
    data
  };
  console.log("sendTransaction", tx)
  const txHash = await sendTransaction(web3, [tx])
  console.log({txHash})
  return txHash;
}
