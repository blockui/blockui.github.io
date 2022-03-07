// import constant from 'config/constant.json'
import {checkIsLocalDev} from "shared/functions/common";
// import {getConstantKey} from "shared/functions/common";
import IApp from 'shared/BD/IApp';

export const namespace = "constant";

if (checkIsLocalDev() && IApp.checkNotIApp()) {
  //setItemFromLocalStorage(getConstantKey(),JSON.stringify(constant))
}

const initialState = {
  ...{}
};

export default function defaultReducer(
  state = initialState,
  action
) {
  switch (action.type) {
    case `${namespace}/setState`:
      return {
        ...state,
        ...action.payload
      };
    default:
      return state;
  }
}
