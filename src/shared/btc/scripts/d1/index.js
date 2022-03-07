/**
 * Important:
 * You MUST read and understand web3 API documentation on transaction available
 * on this link https://web3js.readthedocs.io/en/v1.3.0/web3-eth.html#sendtransaction
 *
 * You MUST get an ETH provider API token, e.g Infura
 * Get infura token here https://infura.io/
 */


/**ENVIRONMENT */
require('dotenv').config();

/**Ethereum Library */
var Tx = require('ethereumjs-tx').Transaction;

/**Web3 */
var Web3 = require('web3');

/**Set ETH provider */
var ethProvider = "https://mainnet.infura.io/v3/" + process.env.INFURA_TOKEN
var web3 = new Web3(ethProvider)

/**Express */
var express = require('express');

//initialise express
var app = express();


//Browser testing using express

app.get('/send-erc20/:token/:amount/:destination', function (req, res) {

  sendErc20(req.params.token, req.params.amount, req.params.destination)

  res.send("REQUEST COMPLETED, Check console for the result");

})


//------------------SEND ERC20 TOKEN FROM ONE ADDRESS TO ANOTHER ADDRESS-------------------//
//-----------------------------------------------------------------------------------------//
//Send ERC20 token from one address to another address

/**
 *
 * @param {String} token name of the token you want to send
 * @param {Number} amount amount to withdraw in ETH value
 * @param {String} destination address that you are sending to
 */

function sendErc20(token, amount, destination) {

  //get token info from token file
  var tokenData = require('./tokens/' + token);

  //process.env.ORIGIN_ADDRESS is the address you are sending from
  var from = process.env.ORIGIN_ADDRESS;

  //process.env.ORIGIN_ADDRESS_PRIVATE_KEY is the Private Key of the origin address
  var privateKey = process.env.ORIGIN_ADDRESS_PRIVATE_KEY;

  //Some ETH private key may have 0x appended to them making the length 66, we must remove the 0x
  //the if statement below deals with that

  //the plane private key with lenght 64 is needed here.
  if (privateKey.startsWith("0x") && privateKey.length == 66) {
    //remove the 0x
    privateKey = privateKey.substring(2);
  }

  //get the binary value of the private key
  var privateKeyBinary = Buffer.from(privateKey, 'hex');

  //use the token ABI and address obtained from tokenData to call the token contract
  //Doc on calling a contract https://web3js.readthedocs.io/en/v1.3.0/web3-eth-contract.html#new-contract
  var contract = new web3.eth.Contract(tokenData.abi, tokenData.address);

  //to get the nounce i.e the number of total transactions by the sender (ORIGIN_ADDRESS)
  web3.eth.getTransactionCount(from, (err, txCount) => {
    if (err) {
      console.log(err);
    }

    //Get the normal gas price required... So we don't guess just any gas price or do it manually
    web3.eth.getGasPrice().then(function (result) {

      //build transaction object
      var txObject = {
        nonce: web3.utils.toHex(txCount),//gotten from first web3 call getTransactionCount()
        gasLimit: web3.utils.toHex(200000), //calling contracts require more gasLimit than the normal 21000
        gasPrice: web3.utils.toHex(result),//gotten from second web3 call getGasPrice()
        to: tokenData.address,//send the data to contract address //we get the address fron the token data

        //data to send to the contract is that it should call the contract transfer method
        //and send the amount to the destination address
        //add the decimal number of zeros to amount using the token data
        data: contract.methods.transfer(destination, web3.utils.toWei(amount, tokenData.decimal_rept)).encodeABI(),

        chainID: web3.utils.toHex(1)//using mainnet
      }


      //Sign the transaction with Origin Address private key

      //create new object of ethereumjs-tx
      var tx = new Tx(txObject, {'chain': 'mainnet'});

      tx.sign(privateKeyBinary);

      var serializedTx = tx.serialize();
      var raw = '0x' + serializedTx.toString('hex');

      // Broadcast the transaction
      web3.eth.sendSignedTransaction(raw, (err, txHash) => {//result is the Tx Hash
        if (err) {
          console.log(err);
        } else {

          //////////////////////
          //      RESULT      //
          //////////////////////

          console.log(txHash);

        }
      });

    }).catch(function (err) {
      console.log(err);
    })
  });


}

//-----------------------------------------------------------------------------------------//


var PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
  console.log('App Started !!!');
});
