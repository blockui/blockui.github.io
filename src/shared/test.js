import axios from "axios";
import BDServer from "./BD/BDServer";
import BDClient from "./BD/BDClient";
import BDAuth from "./BD/BDAuth";
import {handleRequest} from "./functions/network";

export async function initTest(){
  await BDServer.fetchPubKey()
  BDClient.initRsaKey()
  const passphrase = "passphrase"
  const password = BDAuth.getStrHash(passphrase, 16)
  const rsa_key = BDAuth.createRsaKey(passphrase)
  BDAuth.setGlobalUser({
    rsa_key,
    password,
    username:`wswww`
  })
}


axios.interceptors.request.use(request => {
  const {url} = request;
  if (url && (url.indexOf("http") === 0)) {
    request["url"] = `${url}`
  } else {
    const baseUrlApi = "http://127.0.0.1:8881/api";
    request["url"] = `${baseUrlApi}${url}`
  }
  return handleRequest(request)
}, error => {
  return Promise.reject(error);
})
