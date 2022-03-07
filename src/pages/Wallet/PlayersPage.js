import React, {Component} from "react";
import {connect} from "react-redux";
import BasePage from "components/core/BasePage";
import {getWeb3} from "./shared/eth_utils"
import "./style.scss"
import {ModelWalletAccount} from "./shared/model_wallet_account";

export default connect(({global}) => {
  return {
    global
  }
})(class extends Component {
    constructor(props) {
      super(props);
      const {address} = props.location.params;
      const account = ModelWalletAccount.get(address)
      this.state = {
        account,
        gameRewards: [],
        sortField: "squidEnergy",
        sortDesc: true,
        txList: [],
        accountTo: null,
        loading: false
      }
      this.stopTxTimer = false
      this.playersTransferSelected = []
      this.web3 = getWeb3();
    }


    render() {
      let squidEnergy_total = 0, to_squidEnergy_total = 0;
      const {account, sortField, sortDesc, accountTo} = this.state;
      // const field = "squidEnergy"
      return (
        <BasePage useScroll back header={{
          title: account.toString()
        }}>
          <div className="pt_8">

          </div>
        </BasePage>
      )
    }

  }
)
