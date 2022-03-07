import React, {Component} from "react";
import {connect} from "react-redux";
import BasePage from "components/core/BasePage";
import {ModelWalletAccount} from "./shared/model_wallet_account";
import StorageLocal from "./shared/storage_local";
import "./style.scss"
import WeSearchBar from "../../shared/weui/WeSearchBar";
import {Drawer, DrawerOverlay, Link, Table, Tbody, Td, Th, Thead, Tr} from "@chakra-ui/react";
import AccountsFilterDrawer from "./components/AccountsFilterDrawer";
import {todayStartTimestamp} from "../../shared/functions/date";
import {ModelBswGame} from "./shared/model_bsw_game";
import PlayersTable from "./components/PlayersTable";
import BusesTable from './components/BusesTable'
import {requestAccounts} from "./shared/metamask";

export default connect(({global}) => {
  return {
    global
  }
})(class extends Component {
    constructor(props) {
      super(props);
      this.state = {
        connectedAddress: null,
        closeOnOverlayClick: true,
        drawerType: null,
        accountDrawer: null,
        hoverAccount: null,
        accounts: [],
        showSearch: false,
        searchValue: "",
        isOpen: false,
        sortField: StorageLocal.get("accounts_sortField", "minNextPlayTime"),
        sortType: StorageLocal.get("accounts_sortType", "asc"),
        filterPlaytime: StorageLocal.get("accounts_filterPlaytime", "Today")
      }
    }

    componentDidMount() {
      this.updateAccounts(false)
      requestAccounts({
        accountsChanged: (connectedAddress) => {
          this.setState({
            connectedAddress
          })
        }
      }).then((connectedAddress) => {
        console.log("metamask connectedAddress", connectedAddress)
        this.setState({
          connectedAddress
        })
      })
    }

    updateAccounts(syncDetail) {
      ModelWalletAccount.getAccounts(syncDetail).then((accounts) => {
        this.setState({
          accounts
        })
      })
    }

    render() {
      const {
        connectedAddress,
        drawerType,
        closeOnOverlayClick,
        accounts,
        accountDrawer,
        hoverAccount,
        searchValue, showSearch, filterPlaytime, sortType, sortField, isOpen
      } = this.state;

      const sortItems = [
        {
          sortKey: "bswGameBusBalance",
          title: "车数量"
        },
        {
          sortKey: "minNextPlayTime",
          title: "游戏时间"
        },
        {
          sortKey: "minContractEndTime",
          title: "合约时间"
        },
        {
          sortKey: "secToNextBus",
          title: "下一辆车"
        },
        {
          sortKey: "availableSEAmount",
          title: "SE能量"
        },
        {
          sortKey: "stakedAmount",
          title: "BSW质押"
        },
        {
          sortKey: "bswGameCurrentFee",
          title: "提现费率"
        },
        {
          sortKey: "bswGameReward",
          title: "游戏奖励"
        },
        {
          sortKey: "bnb",
          title: "BNB"
        }
      ]
      const sortFunc = (a, b) => {
        switch (sortField) {
          case "bswGameReward":
            if (sortType === 'desc') {
              return b['bswGame']["rewardBalance"].bnb.amount - a['bswGame']["rewardBalance"].bnb.amount
            } else {
              return a['bswGame']["rewardBalance"].bnb.amount - b['bswGame']["rewardBalance"].bnb.amount
            }
          case "availableSEAmount":
            if (sortType === 'desc') {
              return b['bswGame']["availableSEAmount"] - a['bswGame']["availableSEAmount"]
            } else {
              return a['bswGame']["availableSEAmount"] - b['bswGame']["availableSEAmount"]
            }
          case "stakedAmount":
            if (sortType === 'desc') {
              return b['bswGame']["stakedAmount"] - a['bswGame']["stakedAmount"]
            } else {
              return a['bswGame']["stakedAmount"] - b['bswGame']["stakedAmount"]
            }
          case "bswGameCurrentFee":
            if (sortType === 'desc') {
              return b['bswGame']["currentFee"] - a['bswGame']["currentFee"]
            } else {
              return a['bswGame']["currentFee"] - b['bswGame']["currentFee"]
            }
          case "secToNextBus":
            if (sortType === 'desc') {
              return b['bswGame']["secToNextBus"] - a['bswGame']["secToNextBus"]
            } else {
              return a['bswGame']["secToNextBus"] - b['bswGame']["secToNextBus"]
            }
          case "bswGameBusBalance":
            if (sortType === 'desc') {
              return b['bswGame']["busBalance"] - a['bswGame']["busBalance"]
            } else {
              return a['bswGame']["busBalance"] - b['bswGame']["busBalance"]
            }
          case "minContractEndTime":
          case "minNextPlayTime":
            if (sortType === 'desc') {
              return b['bswGame'][sortField] - a['bswGame'][sortField]
            } else {
              return a['bswGame'][sortField] - b['bswGame'][sortField]
            }
          case "bnb":
          default:
            if (sortType === 'desc') {
              return b[sortField] - a[sortField]
            } else {
              return a[sortField] - b[sortField]
            }
        }
      }

      return (
        <BasePage back={true} useScroll header={{
          title: showSearch ? (
            <div style={{flex: 1}}>
              <WeSearchBar
                placeholder={"Search Account"}
                onCancelSearch={() => {
                  this.setState({
                    showSearch: false,
                    searchValue: ""
                  })
                }}
                searchFocused={true}
                onChangeSearchValue={(searchValue) => {
                  this.setState({
                    searchValue: searchValue
                  })
                }}/>
            </div>
          ) : "Wallet Accounts",
          right: [
            {
              icon: "search",
              hide: showSearch,
              onClick: () => {
                this.setState({showSearch: true})
              }
            },
            {
              icon: "refresh",
              hide: showSearch,
              onClick: () => {
                this.updateAccounts(true)
              }
            },
            {
              icon: "menu",
              hide: showSearch,
              onClick: () => {
                this.setState({isOpen: true})
              }
            }
          ]
        }}>
          <div className="pt_8">
            <AccountsFilterDrawer {...{
              isOpen,
              sortItems,
              setState: this.setState.bind(this),
              sortType,
              filterPlaytime,
              searchValue,
              sortField
            }}/>
            <Drawer
              closeOnOverlayClick={closeOnOverlayClick}
              size={"xl"}
              isOpen={accountDrawer}
              placement='right'
              onClose={() => {
                this.setState({accountDrawer: null, closeOnOverlayClick: true})
              }}
            >
              <DrawerOverlay/>
              {
                (accountDrawer && drawerType === "bus") &&
                <BusesTable {...{accounts, account: accountDrawer, setState: this.setState.bind(this)}}/>
              }
              {
                (accountDrawer && drawerType === "player") &&
                <PlayersTable {...{accounts, account: accountDrawer, setState: this.setState.bind(this)}}/>
              }
            </Drawer>

            <Table size='sm'>
              <Thead>
                <Tr>
                  <Th>Name</Th>
                  <Th isNumeric>BNB</Th>
                  <Th>PlayTime</Th>
                  <Th>Players</Th>
                  <Th>Address</Th>
                  <Th>Buses</Th>
                  <Th isNumeric>BSW</Th>
                  <Th isNumeric>BSW Staked</Th>
                  <Th isNumeric>BSW Reward</Th>
                  <Th isNumeric>BNB Reward</Th>
                  <Th isNumeric>WithdrawFee</Th>
                  <Th>ContractEnd</Th>
                  <Th/>
                </Tr>
              </Thead>
              <Tbody>
                {
                  accounts.filter((account) => {
                    if (filterPlaytime === "Today") {
                      return account.bswGame.minNextPlayTime > todayStartTimestamp() && account.bswGame.minNextPlayTime < todayStartTimestamp() + 3600 * 24;
                    } else if (filterPlaytime === "Tomorrow") {
                      return account.bswGame.minNextPlayTime > todayStartTimestamp() + 3600 * 24 && account.bswGame.minNextPlayTime < todayStartTimestamp() + 3600 * 24 * 2;
                    } else if (filterPlaytime === "Yesterday") {
                      return account.bswGame.minNextPlayTime < todayStartTimestamp();
                    } else {
                      return true
                    }
                  }).filter((account) => {
                    if (searchValue.length > 0) {
                      return account.name.toLowerCase().indexOf(searchValue.toLowerCase()) > -1;
                    } else {
                      return true
                    }
                  }).sort(sortFunc).map((account, i) => {
                    account.bswGame = new ModelBswGame(account.bswGame)
                    let backgroundColor
                    if (connectedAddress && connectedAddress.toLowerCase() === account.address.toLowerCase()) {
                      backgroundColor = "green.100"
                    } else {
                      if (accountDrawer && account.address === accountDrawer.address) {
                        backgroundColor = "green.200"
                      } else {
                        if (hoverAccount && account.address.toLowerCase() === hoverAccount.address.toLowerCase()) {
                          backgroundColor = "blue.200"
                        }
                      }
                    }

                    return (
                      <Tr
                        onClick={() => {
                          this.setState({
                            hoverAccount: account
                          })
                        }}
                        key={i}
                        backgroundColor={backgroundColor}>
                        <Td>
                          {account.name}
                        </Td>
                        <Td>{account.bnb.toFixed(4)}</Td>
                        <Td>{account.bswGame.minNextPlayTimeStr()}</Td>
                        <Td>
                          <Link
                            color='blue'
                            onClick={() => {
                              this.showDrawer(account, "player")
                            }}>
                            ({account.bswGame.players.length}) {account.bswGame.totalSe()}
                          </Link>
                        </Td>
                        <Td><span className={"user_select_text"}>{account.address}</span></Td>
                        <Td>
                          <Link
                            color='teal.500'
                            onClick={() => {
                              this.showDrawer(account, "bus")
                            }}>
                            {account.bswGame.busSeatList()} ({account.bswGame.buses.length} / {account.bswGame.allowedBusBalance})
                          </Link>
                        </Td>
                        <Td>{account.bsw.toFixed(1)}</Td>
                        <Td>{account.bswGame.stakedAmount.toFixed(1)}</Td>
                        <Td>{account.bswGame.rewardBalance.bsw.amount.toFixed(1)}</Td>
                        <Td>{account.bswGame.rewardBalance.bnb.amount.toFixed(4)}</Td>
                        <Td>{account.bswGame.currentFee} %</Td>
                        <Td>{account.bswGame.minContractEndTimeStr()}</Td>

                        <Td>
                          {/*<Button size={"sm"} colorScheme='teal'*/}
                          {/*          onClick={() => this.setState({isOpen: true})}>open</Button>*/}
                        </Td>
                      </Tr>
                    )
                  })
                }
              </Tbody>
              {/*<Tfoot>*/}
              {/*  <Tr>*/}
              {/*    <Th>total</Th>*/}
              {/*  </Tr>*/}
              {/*</Tfoot>*/}
            </Table>
          </div>
        </BasePage>
      )
    }

    showDrawer(accountDrawer, drawerType) {
      this.setState({
        accountDrawer,
        drawerType
      })
    }
  }
)
