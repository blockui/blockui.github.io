import {getIsFirstLogin, getLastLoginUserName, getUsersHistory} from "shared/functions/auth-utils";
import BDAuth from "shared/BD/BDAuth";
import {setItemFromLocalStorage} from "shared/functions/cache";
import {base64Encode} from "../../shared/functions/base64";

export const namespace = "auth";

const initialState = {
  user: BDAuth.getGlobalUser(),
  lastLoginUserName: getLastLoginUserName(),
  isFirstLogin: getIsFirstLogin(),
  usersHistory: getUsersHistory(),
};

export default function defaultReducer(
  state = initialState,
  action
) {
  switch (action.type) {
    case `${namespace}/setState`:
      let tmp = {}
      let isFirstLogin = state.isFirstLogin
      if (action.payload.user !== undefined) {
        const {user, clearLoginFingerprint} = action.payload
        const authUsersHistoryLocal = getUsersHistory();
        let usersHistory = authUsersHistoryLocal
        if (user) {
          if (isFirstLogin) {
            isFirstLogin = false
            setItemFromLocalStorage("auth.isFirstLogin", false)
          }
          let t = false;
          usersHistory = authUsersHistoryLocal.map(row => {
            if (user && row.fingerprint === user.fingerprint) {
              t = true;
              return {...user, password: "", api_token: ""};
            } else return row
          })
          if (!t && user && user.fingerprint) {
            usersHistory.push(user)
          }
          BDAuth.setGlobalUser(user)
        } else {
          if (clearLoginFingerprint) {
            usersHistory = authUsersHistoryLocal.filter(row => {
              if (clearLoginFingerprint) {
                return row.fingerprint !== clearLoginFingerprint
              } else {
                return true
              }
            })
          }
        }
        setItemFromLocalStorage("auth.h", "^"+base64Encode(JSON.stringify(usersHistory)));
        tmp["usersHistory"] = usersHistory
      }
      return {
        ...state,
        ...action.payload,
        isFirstLogin,
        ...tmp,
      };
    default:
      return state;
  }
}
