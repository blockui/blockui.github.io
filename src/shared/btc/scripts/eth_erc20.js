require("dotenv").config()
const Web3 = require("web3")
const {toBN, toWei, fromWei, toChecksumAddress} = require("web3-utils");
const ERC20_ABI = require("./abi/ERC20.abi.json")
const {GAS_PRICE, RPC_URL, WALLET_PRV_KEY, TARGET_ADDRESS, TOKEN_ADDRESS, FEE_PARIVATE} = process.env
console.log(`Running with following parameteres:\n ${JSON.stringify({
  GAS_PRICE,
  RPC_URL,
  TARGET_ADDRESS,
  TOKEN_ADDRESS,
  WALLET_PRV_KEY
}, null, ' ')}`)
const web3 = new Web3(RPC_URL, null, {transactionConfirmationBlocks: 1}) // todo: more confirmation block
const ethFee = fromWei(toBN(toWei(GAS_PRICE, 'gwei')).mul(toBN('21000')))
console.log("ethFee: ", ethFee)
console.log("GAS_PRICE gwei:", toWei(GAS_PRICE, 'gwei'), "eth: ", fromWei(toWei(GAS_PRICE, 'gwei')))

console.log("TOKEN_ADDRESS: ", TOKEN_ADDRESS)
console.log("toChecksumAddress(TOKEN_ADDRESS): ", toChecksumAddress(TOKEN_ADDRESS))
// const erc20Token = new web3.eth.Contract(ERC20_ABI, toChecksumAddress(TOKEN_ADDRESS))
// console.log("erc20Token: ", erc20Token)
// console.log("web3.eth.Contract.transactionConfirmationBlocks: ", web3.eth.Contract.transactionConfirmationBlocks)

async function sendEth() {
  // const wallet = web3.eth.accounts.wallet.add('0x' + WALLET_PRV_KEY)
  // console.log("wallet: ", wallet)
  // let account = web3.eth.accounts.privateKeyToAccount('0x' + WALLET_PRV_KEY)
  // console.log("account: ", account)
  //const balance = await web3.eth.getBalance(account.address)
  //console.log("balance: ", fromWei(balance), "eth")
  //console.log("balance wei: ", toWei(fromWei(balance)), "wei")
  const cost = toBN(toWei(GAS_PRICE, 'gwei')).mul(toBN('21000'))
  console.log(`cost wei: `, cost.toString(), "eth: ", fromWei(cost.toString()))
  const toSendEth = "0.1"
  const toSendWei = toWei(toSendEth)
  console.log(`toSend , wei:`, toSendWei, "eth: ", toSendEth)
  const toSend = toBN(toSendWei).sub(cost)
  console.log(`toSend sub cost, wei:`, toSend.toString(), "eth: ", fromWei(toSend.toString()))
  // const sendTransactionRes = await web3.eth.sendTransaction({
  //     from: account.address,
  //     to: TARGET_ADDRESS,
  //     gas: 21000,
  //     value: toSend.toString(),
  //     gasPrice: toWei(GAS_PRICE, 'gwei')
  // }).once("transactionHash", function (txHash) {
  //     console.log(`${index + 1}: Withdrawn ${fromWei(toSend)} ETH from ${account.address}, tx hash:\nhttps://ropsten.etherscan.io/tx/${txHash}`)
  // })
  // console.log(`sendTransactionRes`, sendTransactionRes)
}

sendEth()

