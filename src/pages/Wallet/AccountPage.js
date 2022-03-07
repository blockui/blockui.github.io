import React, {Component} from "react";
import {connect} from "react-redux";
import BasePage from "components/core/BasePage";
import "./style.scss"
import {WeCell, WeFormGroup} from "shared/weui";
import {ModelWalletAccount} from "./shared/model_wallet_account";
import {getWeui, globalLoading, globalLoadingHide, pageJump} from "shared/functions/common";
import NotifyView from "components/NotifyView";
import WeSearchBar from "../../shared/weui/WeSearchBar";
import {ModelBswGame} from "./shared/model_bsw_game";
import {Button, Stack} from "@chakra-ui/react";

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
        searchValue: "",
      }
    }

    updateInfoFromRemote() {
      const {account} = this.state;
      if (!account) return
      account.updateInfoFromRemote().then((account) => {
        this.setState({account})
      }).catch(console.error)
    }

    componentDidMount() {
      this.updateInfoFromRemote()
    }

    render() {
      const {account, searchValue} = this.state;
      let header = {}
      if (!account) {
        header.title = (
          <div style={{flex: 1}}>
            <WeSearchBar
              placeholder={"Search Account"}
              searchFocused={true}
              hideCancelBtn={true}
              showSearchBtn={true}
              onSearchConfirmed={() => {
                const account = new ModelWalletAccount({address: searchValue})
                globalLoading("Searching...")
                account.updateInfoFromRemote().then((account) => {
                  this.setState({
                    account
                  })

                }).catch((e) => {
                  getWeui().alert(e.message)
                }).finally(globalLoadingHide)
              }}
              onCancelSearch={() => {
                this.setState({
                  showSearch: false,
                  searchValue: ""
                })
              }}
              onChangeSearchValue={(searchValue) => {
                this.setState({
                  searchValue
                })
              }}/>
          </div>
        )
        return (
          <BasePage back header={header}>

          </BasePage>
        )
      } else {
        header.title = account ? account.toString() : ""
        header.right = [
          {
            icon: "refresh",
            onClick: () => {
              this.updateInfoFromRemote()
            }
          }
        ]
      }
      const bswGame = new ModelBswGame(account.bswGame)
      return (
        <BasePage
          useScroll={true}
          back header={header}>
          <div className="pt_8">
            <WeFormGroup title={"Balance"}>
              <WeCell title={"BNB"} foot={account.bnb + " BNB"} active/>
            </WeFormGroup>
            <WeFormGroup title={"Assets(ERC20)"}>
              <WeCell title={"WBNB"} foot={account.wbnb + " BNB"} active/>
              <WeCell title={"BSW"} foot={account.bsw + " BSW"} active/>
              <WeCell title={"USDT"} foot={account.usdt + " U"} active/>
            </WeFormGroup>
            <WeFormGroup title={"BswGame"}>
              <WeCell onClick={() => {
                pageJump("Wallet/BswGame", {
                  params: {
                    address: account.address
                  },
                  style: {
                    marginLeft: 800
                  }
                })
              }} title={"Game"} access active/>
              <WeCell title={"stakedAmount"} foot={bswGame.stakedAmount + ""}/>
            </WeFormGroup>

            <WeFormGroup title={"Rewards"}>
              <WeCell title={"rewardBalance BNB"} foot={bswGame.rewardBalance.bnb.amount + ""}/>
              <WeCell title={"rewardBalance BSW"} foot={bswGame.rewardBalance.bsw.amount + ""}/>
            </WeFormGroup>
            <WeFormGroup title={"Players"}>
              <WeCell title={"playerBalance"} foot={bswGame.playerBalance + ""}/>
              <WeCell title={"availableSEAmount"} foot={bswGame.availableSEAmount + ""}/>
              <WeCell title={"minNextPlayTime"} foot={bswGame.minNextPlayTimeStr() + ""}/>
              <WeCell title={"minContractEndTime"} foot={bswGame.minContractEndTimeStr() + ""}/>
              <Stack height={12} paddingLeft={10} spacing={4} direction='row' justifyContent="flex-start" align='center'>
                <Button variant='solid' isDisabled={false} colorScheme='teal' size='sm'
                        onClick={() => {
                          pageJump("Wallet/Players", {
                            params: {
                              address: account.address
                            },
                            style: {
                              marginLeft: 800
                            }
                          })
                        }}>
                  Detail
                </Button>
              </Stack>
            </WeFormGroup>

            <WeFormGroup title={"Buses"}>
              <WeCell title={"busBalance"} foot={bswGame.busBalance + ""}/>
              <WeCell title={"secToNextBus"} foot={bswGame.secToNextBusStr() + ""}/>
              <WeCell title={"firstBusTimestamp"} foot={bswGame.firstBusTimestampStr() + ""}/>
              <WeCell title={"allowedSeatsInBuses"} foot={bswGame.allowedSeatsInBuses + ""}/>
              <WeCell title={"allowedBusBalance"} foot={bswGame.allowedBusBalance + ""}/>
              <Stack height={12} paddingLeft={10} spacing={4} direction='row' justifyContent="flex-start" align='center'>
                <Button variant='solid' isDisabled={false} colorScheme='teal' size='sm'
                        onClick={() => {
                          pageJump("Wallet/Buses", {
                            params: {
                              address: account.address
                            },
                            style: {
                              marginLeft: 800
                            }
                          })
                        }}>
                  Detail
                </Button>
              </Stack>
            </WeFormGroup>

            <WeFormGroup>
              <WeCell title={"UpdatedAt"} foot={account.__updatedAt.Format("hh:mm:ss")} active/>
            </WeFormGroup>
          </div>


          <NotifyView namespace={"wallet_account"} id={account.address} onUpdate={(account) => {
            this.setState({
              account
            })
          }}/>
        </BasePage>
      )
    }
  }
)
