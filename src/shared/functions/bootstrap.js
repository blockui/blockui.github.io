import axios from 'axios';
import {globalLoadingHide} from "./common";
import BDApp from "../BD/BDApp";
import {handleRequest} from "./network";
import BDAuth from "../BD/BDAuth";

axios.defaults.timeout = 120000;

axios.interceptors.request.use(request => {
  const {url} = request;
  if (url && (url.indexOf("http") === 0)) {
    request["url"] = `${url}`
  } else {
    const authUser = BDAuth.getGlobalUser()
    if (authUser && authUser.api_token && url.indexOf("/public/") === -1) {
      const token = BDAuth.encryptApiToken()
      if(token){
        request.headers.common.Authorization = `JWT ${token}`;
      }
    }

    const baseUrlApi = BDApp.baseApi;
    request["url"] = `${baseUrlApi}/api${url}`
  }
  return handleRequest(request)
}, error => {
  globalLoadingHide()
  console.error("request err", error);
  return Promise.reject(error);
})

axios.interceptors.response.use((response) => {
  return response;
}, error => {
  console.error(error);
  globalLoadingHide()
  let message = "网络请求出现错误"
  let code = 500
  if (error.message.indexOf("401") > 0 || (error.response && error.response.status === 401)) {
    message = "登录过期，请重新登录"
    code = 401
  }
  // if(!getCache("err_toast")){
  //   if(code === 401){
  //     setStoreState("auth",{
  //       user:null
  //     })
  //     setStoreState("global",{
  //       showLoginView:true
  //     })
  //     removeGlobalAuthUser()
  //   }
  //   setCache("err_toast",1,3)
  //   showTopTips(message)
  // }
  return Promise.reject({code, message});
});
