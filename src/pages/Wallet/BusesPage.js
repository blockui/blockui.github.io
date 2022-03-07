import React, {Component, Fragment} from "react";
import {connect} from "react-redux";
import BasePage from "components/core/BasePage";
import {getWeb3, intToHex} from "./shared/eth_utils"
import "./style.scss"
import {WeCell, WeFormGroup} from "shared/weui";
import {ModelWalletAccount} from "./shared/model_wallet_account";
import WeButton from "shared/weui/WeButton";
import {ModelBswGame} from "./shared/model_bsw_game";
import {getWeui, globalLoading, globalLoadingHide, locationHash} from "../../shared/functions/common";
import NotifyView from "../../components/NotifyView";
import {WeFlex, WeFlexItem} from "../../shared/weui";
import {sendPlayerTransaction} from "./shared/bsw_utils";
import {requestAccounts} from "./shared/metamask";
import {ModelBswBus} from "./shared/model_bsw_bus";

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
        accountTo: null,
        playersTransferSelected: []
      }
    }

    componentWillUnmount() {
      if (this.account_timer_id) {
        clearTimeout(this.account_timer_id)
      }

      if (this.account_to_timer_id) {
        clearTimeout(this.account_to_timer_id)
      }
    }

    getBuses(web3, account, statusKey, cb) {
      ModelBswGame.getBuses(web3, account.address).then((bswGame) => {
        console.log({statusKey, bswGame})
        account.update({bswGame:{...account.bswGame,...bswGame}})
        this.setState({
          [statusKey]: account
        }, () => {
          cb && cb()
        })
      }).catch(() => {
        cb && cb()
      })
    }

    componentDidMount() {
      // const web3 = getWeb3();
      // const {account} = this.state;
      // this.getBuses(web3, account, "account")
    }

    render() {
      const {account, accountTo} = this.state;
      return (
        <BasePage useScroll back header={{
          title: account.toString()
        }}>
          <div className="pt_8">
            <WeFormGroup title={"Buses (" + account.bswGame.buses.length + ")"}>
              {
                account.bswGame.buses.map((row, i) => {
                  console.log(row)
                  const bus = new ModelBswBus(row)
                  let title = "# " + bus.tokenId
                  if (accountTo) {
                    title += " : " + intToHex(bus.tokenId)
                  }
                  return (
                    <WeCell key={i} onClick={() => {
                    }} title={title} foot={"" + bus.level} access active/>
                  )
                })
              }
            </WeFormGroup>
          </div>
          <NotifyView namespace={"wallet_accounts.buses"} id={account.address} onUpdate={(accountTo) => {
            this.setState({
              accountTo
            })
          }}/>
        </BasePage>
      )
    }
  }
)
