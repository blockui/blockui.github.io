require("dotenv").config()
const Web3 = require("web3");
const ERC20_ABI = require("./abi/ERC20.abi.json")
const {toWei} = require("web3-utils");
const {toBN} = require("web3-utils");
const {fromWei} = require("web3-utils");
const {toChecksumAddress} = require("ethereumjs-util");
const {GAS_PRICE, RPC_URL, WALLET_PRV_KEY, TARGET_ADDRESS, TOKEN_ADDRESS} = process.env
console.log(`Running with following parameteres:\n ${JSON.stringify({
  GAS_PRICE,
  RPC_URL,
  TARGET_ADDRESS,
  TOKEN_ADDRESS,
  WALLET_PRV_KEY
}, null, ' ')}`)


//
// ETH转账时建议 Gas限制设置为30000，Gas价格设置为50 等于0.0015eth
//
// ERC20代币转账时建议 Gas限制设置为70000，Gas价格设置为50，等于0.0035eth

async function main() {
  const web3 = new Web3(RPC_URL, null, {transactionConfirmationBlocks: 1})
  const erc20Token = new web3.eth.Contract(ERC20_ABI, toChecksumAddress(TOKEN_ADDRESS))
  const account = web3.eth.accounts.privateKeyToAccount('0x' + WALLET_PRV_KEY)
  const eth_balance = await web3.eth.getBalance(account.address)
  console.log("eth balance", fromWei(eth_balance))
  console.log("account address: ", account.address)
  const balance = await erc20Token.methods.balanceOf(account.address).call()
  console.log("from balance", balance)

  const sendUsd = 34
  let gas = await erc20Token.methods.transfer(TARGET_ADDRESS, sendUsd).estimateGas({from: account.address})
  console.log(gas)

  // let receipt = await erc20Token.methods.transfer(TARGET_ADDRESS, sendUsd).send({
  //     from: account.address,
  //     gas,
  //     gasPrice: toWei(GAS_PRICE, 'gwei')
  // }).once("transactionHash", function (txHash) {
  //     console.log(` Withdrawn ${sendUsd} usdt from ${account.address}, tx hash:\nhttps://etherscan.io/tx/${txHash}`)
  // })
  // console.log("receipt",receipt)

  const balanceTo = await erc20Token.methods.balanceOf(TARGET_ADDRESS).call()
  console.log("to balance", balanceTo)
}

main()
