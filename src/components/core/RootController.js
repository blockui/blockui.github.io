import React, {Component} from "react";
import {connect} from 'react-redux'
import {PageManager, PageRoute} from "./PageManager"
import weui from "shared/weui-js";
import {regOnWindowResize, unRegOnWindowResize} from "shared/functions/common";
import MainController from "components/core/MainController"
import BDApp from "shared/BD/BDApp";
import {onResetStatusBarBgColor} from 'shared/BD/IApp';
import Routers from "../../_routes"

const RootController = connect(({call, constant, auth, global}) => {
  return {
    foldSidebar: global.foldSidebar,
    clientWidth: global.clientWidth,
    constant,
    authUser: auth.user,
  }
})(class extends Component {
  constructor(props) {
    super(props);
    window.weui = weui;
    this.state = {loading: true}
  }

  componentWillUnmount() {
    onResetStatusBarBgColor()
    unRegOnWindowResize()
  }

  componentDidMount() {
    regOnWindowResize()
    this.loadAppConstant()
  }

  loadAppConstant() {
    BDApp.loadApp(() => {
      BDApp.afterLoadApp()
      this.setState({loading: false})
    })
  }

  checkLoading() {
    // const {constant} = this.props;
    // return this.state.loading || Object.keys(constant).length === 0;
    return this.state.loading
  }

  render() {
    const loading = this.checkLoading()
    const {foldSidebar, clientWidth} = this.props;
    return (
      <MainController loading={loading}>
        {
          !loading &&
          <PageManager foldSidebar={foldSidebar} clientWidth={clientWidth}>
            {
              Routers.map((props, index) => (
                <PageRoute key={index} {...props}/>
              ))
            }
          </PageManager>
        }
      </MainController>
    );
  }
});

export default RootController
