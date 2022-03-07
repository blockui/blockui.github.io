import {dispatchStore} from "components/core/App";
import {getItemFromSessionStorage, setItemFromSessionStorage} from "shared/functions/common";
import BDAuth from "shared/BD/BDAuth";

const currentTabBarItemIndex = parseInt(getItemFromSessionStorage("home.currentTabBarItemIndex", false)) || 0

export const namespace = "global";

const initialState = {
  currentTabBarItemIndex,
  foldSidebar:false,
  showQrCodeScanner: false,
  qrCodeScannerRes: null,
  photoSwiperHandler:false,
  loading: true,
  searchFocused: false,
  showGlobalPanel: false,
  isPad: false,//document.body.clientWidth >= getAppMaxWidth(),
  input: {
    field: "",
    label: "",
    value: "",
    desc: ""
  },
  currentPosition: null,
  snackbarsMaxNum: 8,
  snackbars: [],
  clientHeight: window.innerHeight,
  clientWidth: document.body.clientWidth,
  showLoginView:!BDAuth.getGlobalUser(),
  notify: {},
};

export default function defaultReducer(
  state = initialState,
  action
) {
  switch (action.type) {
    case `${namespace}/setState`:
      if (action.payload['currentTabBarItemIndex'] !== undefined) {
        setItemFromSessionStorage("home.currentTabBarItemIndex", action.payload['currentTabBarItemIndex'])
      }
      return {
        ...state,
        ...action.payload
      };

    case `${namespace}/removeSnackbar`:
      return {
        ...state,
        snackbars: state.snackbars.filter(({id}, i) => {
          return id !== action.payload.id;
        })
      };
    case `${namespace}/addSnackbar`:
      const snackbars = [
        {
          ...action.payload,
          open: true,
          id: +(new Date()),
        },
        ...state.snackbars,
      ]
      setTimeout(() => {
        dispatchStore("global", "removeSnackbar", {
          id: snackbars[0].id
        })
      }, action.payload.duration || 5000)
      return {
        ...state,
        snackbars
      };
    default:
      return state;
  }
}
