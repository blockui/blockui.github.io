import React from "react";
import {Provider} from 'react-redux'
import {configureStore} from '../../redux'
import RootController from "./RootController";
import 'assets/style/app.less';
import 'assets/style/app.scss';
import 'swiper/swiper.min.css';

const __store = configureStore()

export function getGlobalStore() {
  return __store
}

export function setStoreState(store, payload) {
  __store.dispatch({
    type: `${store}/setState`, payload
  })
}

export function dispatchAction(action) {
  __store.dispatch(action)
}

export function dispatchStore(store, action, payload) {
  __store.dispatch({
    type: `${store}/${action}`, payload
  })
}

const App = () => {
  return (
    <Provider store={__store}>
      <RootController/>
    </Provider>
  )
}

export default App
