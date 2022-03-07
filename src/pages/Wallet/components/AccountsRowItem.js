import React, {Component, Fragment} from "react";
import {connect} from "react-redux";
import {WeCell} from "shared/weui";
import {locationHash} from "shared/functions/common";
import NotifyView from "components/NotifyView";
import {ModelBswGame} from "../shared/model_bsw_game";

export default connect(({global}) => {
  return {
    global
  }
})(class extends Component {
    constructor(props) {
      super(props);
      const {account} = this.props;
      this.state = {
        ...account
      }
    }

    render() {
      const {account, sortField, onClick} = this.props;
      const bswGame = new ModelBswGame({...account.bswGame})
      let foot = bswGame.minNextPlayTimeStr()
      if (sortField === "bswGameCurrentFee") {
        foot = bswGame.currentFee + " %"
      }
      if (sortField === "minNextPlayTime") {
        foot += " " + bswGame.players.length
      }
      if (sortField === "bswGameBusBalance") {
        foot = ""
        if (bswGame.busBalance > 0) {
          foot = bswGame.busSeatList() + " | "
        }
        foot += bswGame.busBalance + " / " + bswGame.allowedBusBalance
      }

      if (sortField === "secToNextBus") {
        foot = bswGame.secToNextBusStr() + " | " + bswGame.allowedBusBalance
      }

      if (sortField === "availableSEAmount") {
        foot = bswGame.availableSEAmount + " / " + bswGame.totalSe() + " SE | " +  bswGame.players.length
      }

      if (sortField === "stakedAmount") {
        foot = bswGame.stakedAmount.toFixed(1) + " BSW "
      }
      if (sortField === "bswGameReward") {
        foot = bswGame.rewardBalance.bsw.amount.toFixed(1) + " BSW /" + bswGame.rewardBalance.bnb.amount.toFixed(4) + " BNB"
      }

      return (
        <Fragment>
          <WeCell
            onClick={() => {
              if (onClick) {
                onClick()
              } else {
                locationHash("Wallet/Account", {address: account.address})
              }
            }} title={account.toString()} foot={foot} access active
          />
          <NotifyView namespace={"wallet_account"} id={account.address} onUpdate={(account) => {
            this.setState({
              account
            })
          }}/>
        </Fragment>
      )
    }
  }
)
