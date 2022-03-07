require("dotenv").config()
const {GAS_PRICE, RPC_URL, WALLET_PRV_KEY, TARGET_ADDRESS, TOKEN_ADDRESS} = process.env
console.log(`Running with following parameteres:\n ${JSON.stringify({
  GAS_PRICE,
  RPC_URL,
  TARGET_ADDRESS,
  TOKEN_ADDRESS,
  WALLET_PRV_KEY
}, null, ' ')}`)

export const web3 = new Web3(RPC_URL, null, {transactionConfirmationBlocks: 1})
