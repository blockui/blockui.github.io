import React, {Component} from "react";
import {connect} from "react-redux";
import BasePage from "components/core/BasePage";
import "./style.scss"
import {WeCell, WeFormGroup} from "shared/weui";
import {ModelWalletAccount} from "./shared/model_wallet_account";
import NotifyView from "../../components/NotifyView";
import {getWeb3} from "./shared/eth_utils";
import {ModelBswGame} from "./shared/model_bsw_game";

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
      }
    }

    getGame(web3, account) {
      ModelBswGame.getGame(web3, account.address).then((bswGame) => {
        this.setState({
          account: new ModelWalletAccount({
            ...account,
            bswGame: new ModelBswGame({
              ...account.bswGame,
              ...bswGame
            })
          })
        }, () => {
          account.update(this.state.account)
        })
      })
    }

    componentDidMount() {
      const web3 = getWeb3();
      const {account} = this.state;
      this.getGame(web3, account)
    }

    render() {
      const {account} = this.state;
      const bswGame = new ModelBswGame(account.bswGame)
      return (
        <BasePage useScroll back header={{
          title: account.toString()
        }}>
          <div className="pt_8">
            <WeFormGroup title={"Balance"}>
              <WeCell title={"bswBalance"} foot={bswGame.bswBalance + " BSW"}/>
              <WeCell title={"stakedAmount"} foot={bswGame.stakedAmount + ""}/>
            </WeFormGroup>
            <WeFormGroup title={"Bus"}>
              <WeCell title={"busBalance"} foot={bswGame.busBalance + ""}/>
              <WeCell title={"secToNextBus"} foot={bswGame.secToNextBusStr() + ""}/>
              <WeCell title={"firstBusTimestamp"} foot={bswGame.firstBusTimestampStr() + ""}/>
              <WeCell title={"allowedSeatsInBuses"} foot={bswGame.allowedSeatsInBuses + ""}/>
              <WeCell title={"allowedBusBalance"} foot={bswGame.allowedBusBalance + ""}/>
            </WeFormGroup>
            <WeFormGroup title={"Player"}>
              <WeCell title={"playerBalance"} foot={bswGame.playerBalance + ""}/>
              <WeCell title={"availableSEAmount"} foot={bswGame.availableSEAmount + ""}/>
              <WeCell title={"minNextPlayTime"} foot={bswGame.minNextPlayTimeStr() + ""}/>
              <WeCell title={"minContractEndTime"} foot={bswGame.minContractEndTimeStr() + ""}/>
            </WeFormGroup>

            <WeFormGroup title={"PlayerContractFee"}>
              {
                bswGame.playerContracts.map((playerContract, i) => {
                  return (
                    <WeCell key={i} title={playerContract.duration} foot={playerContract.priceInUSD + " U"}/>
                  )
                })
              }

            </WeFormGroup>
            {
              bswGame.rewardBalance &&
              <WeFormGroup title={"Reward"}>
                <WeCell title={"currentFee"} foot={bswGame.currentFee + " %"}/>
                <WeCell title={"bsw"} foot={bswGame.rewardBalance.bsw.amount + " BSW"}/>
                <WeCell title={"bnb"} foot={bswGame.rewardBalance.bnb.amount + " BNB"}/>
              </WeFormGroup>
            }
            <WeFormGroup title={"Game"}>
              {
                bswGame.games && bswGame.games.map((game, i) => {
                  const {
                    level,
                    chanceToWin,
                    enable,
                    playerAndBusAmount,
                    minStakeAmount,
                    minSeAmount,
                    bswStake,
                    rewardTokens,
                    name
                  } = game
                  return (
                    <WeCell
                      subCell={(
                        <div className={"pl_16"}>
                          <p>chanceToWin: {chanceToWin}</p>
                          <p>bswStake: {bswStake}</p>
                          <p>enable: {enable}</p>
                          <p>minSeAmount: {minSeAmount}</p>
                          <p>minStakeAmount: {minStakeAmount}</p>
                          <p>playerAndBusAmount: {playerAndBusAmount}</p>
                          <p>rewardTokens</p>
                          <p>bnb: {rewardTokens.bnb.amount} / {rewardTokens.bnb.usd}</p>
                          <p>bsw: {rewardTokens.bsw.amount} / {rewardTokens.bsw.usd}</p>
                          <p>total USD: {rewardTokens.bnb.usd + rewardTokens.bsw.usd} U</p>
                        </div>
                      )}
                      key={i} title={"[ " + level + " ] " + name} foot={""}/>
                  )
                })
              }
            </WeFormGroup>
          </div>
          <NotifyView namespace={"wallet_accounts"} id={account.address} onUpdate={(account) => {
            this.setState({
              account
            })
          }}/>
        </BasePage>
      )
    }
  }
)
