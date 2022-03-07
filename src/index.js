import React from "react";
import {render} from 'react-dom'
import App from "components/core/App";
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import "./bootstrap"
import constant from 'config/constant.json'
import { extendTheme, ChakraProvider } from '@chakra-ui/react'
const colors = {
  brand: {
    900: '#1a365d',
    800: '#153e75',
    700: '#2a69ac',
  },
}
const theme = extendTheme({ colors })

const renderApp = () => {
  console.log(constant)
  render(
    <ChakraProvider theme={theme}>
      <App/>
    </ChakraProvider>,
    document.getElementById("root")
  )
}
if (process.env.NODE_ENV !== 'production' && module.hot) {
  module.hot.accept('./components/core/App', renderApp)
}

renderApp()

if (window.BD.platform === "WEB") {
  serviceWorkerRegistration.register();
}