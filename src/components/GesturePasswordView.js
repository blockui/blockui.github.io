import React from 'react';
import PortalView from "./PortalView";
import {getAppConfig, globalLoading, globalLoadingHide, showToast} from "shared/functions/common";
import GesturesUnlockView from "./GesturesUnlockView";
import {checkSeedPwd} from "shared/functions/auth-utils";
import {setStoreState} from "./core/App";

class GesturePasswordView extends React.PureComponent {
  onResult(passphrase) {
    if (passphrase.length < 6) {
      return showToast("至少连接6个点")
    }
    const {passwordInputHandler} = this.props;
    let {callback} = passwordInputHandler
    if (!callback) {
      return false;
    }
    globalLoading("验证中...")
    setTimeout(()=>{
      const {password} = checkSeedPwd(passphrase)
      globalLoadingHide()
      if (!password) {
        return false
      }
      callback({password})
      setStoreState("global", {
        passwordInputHandler: false
      })
    },300)
  }

  render() {
    const {passwordInputHandler} = this.props;
    if (!passwordInputHandler) return null;
    return (
      <PortalView selector={getAppConfig().common.portalViewSelector}>
        <GesturesUnlockView title={"请输入手势密码"}
                            onResult={this.onResult.bind(this)}/>
      </PortalView>
    );
  }
}


export default GesturePasswordView
