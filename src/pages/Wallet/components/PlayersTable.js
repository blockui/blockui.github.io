import React, {Component} from "react"
import {
  Button,
  Checkbox,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  Select,
  Spinner,
  Stack,
  Tab,
  Table,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import {ModelBswPlayer} from "../shared/model_bsw_player";
import {fromWei, getTransaction, getWeb3, intToHex} from "../shared/eth_utils";
import {ModelWalletAccount} from "../shared/model_wallet_account";
import {formatRecentTime, timestampToDateStr} from "../../../shared/functions/date";
import axios from "axios";
import {Api} from "../shared/api";
import {bsw_player_contract_address} from "../shared/constant";
import StorageLocal from "../shared/storage_local";
import {ModelBswGame} from "../shared/model_bsw_game";
import {getWeui, globalLoading, globalLoadingHide} from "../../../shared/functions/common";
import {sendPlayerTransaction, startGameTransaction} from "../shared/bsw_utils";
import {in_array} from "../shared/utils";
import {requestAccounts} from "../shared/metamask";
import NotifyView from "../../../components/NotifyView";
import EstimateResult from "./EstimateResult";


class PlayersTable extends Component {
  constructor(props) {
    super(props);
    const {account} = props;
    this.state = {
      transfer_one_player_once_game_fee: 0.2,
      play_game_once_fee: 0.5,
      playGameIndex: null,
      is_transfer_player: true,
      select_game_level: null,
      select_contract_days: null,
      use_player_cost: true,
      player_cost: 0,
      connectedAddress: null,
      sortDesc: true,
      sortField: "busyTo",
      txList: [],
      gameRewards: [],
      accountElse: null,
      account,
      accountPlayers: {},
      currentTransferPlayer: null,
      transferLoading: false,
      estimateResult: [],
      selectedPlayers: [],
      games: [],
      playerContracts: []
    }

    this.viewGone = false
    this.playersTransferSelected = []
    this.web3 = getWeb3();
  }

  componentWillUnmount() {
    this.viewGone = true
  }

  getPlayers(account, statusKey, cb) {
    ModelBswGame.getPlayers(this.web3, account.address).then((bswGame) => {
      console.log({statusKey, bswGame})
      account.update({bswGame: {...account.bswGame, ...bswGame}})
      this.setState({
        [statusKey]: account
      }, () => {
        cb && cb()
      })
    }).catch(() => {
      cb && cb()
    })
  }

  getTxList() {
    const {account} = this.state;
    const {address} = account
    axios.get(Api("/api/tx/"), {
      params: {
        contract: bsw_player_contract_address,
        address,
        page: 1,
        offset: 20
      }
    }).then(({data}) => {
      const txList = []
      data.forEach(({
                      tokenSymbol,
                      tokenName,
                      tokenID,
                      blockNumber,
                      blockHash,
                      to,
                      timeStamp,
                      hash,
                      gasUsed,
                      gasPrice,
                      gas,
                      from,
                      confirmations,
                      cumulativeGasUsed
                    }) => {
        txList.push({
          tokenSymbol,
          tokenName,
          tokenID,
          blockNumber,
          blockHash,
          to,
          timeStamp,
          hash,
          transferFee: fromWei(String(parseInt(gasPrice) * parseInt(gasUsed)), "ether"),
          gasUsed: parseInt(gasUsed),
          gasPrice: fromWei(gasPrice, "gwei"),
          gasLimit: gas,
          from,
          confirmations,
          cumulativeGasUsed
        })
      })
      StorageLocal.set("tx_list_" + address, JSON.stringify(txList))
      this.setState({
        txList
      })
    })
  }

  getPlayGameList() {
    const {account} = this.state;
    const {address} = account
    axios.get(Api("/api/game-rewards/"), {
      params: {
        address
      }
    }).then(({data}) => {
      const gameRewards = []
      data.forEach(row => {
        gameRewards.push(row)
      })
      StorageLocal.set("play_game_rewards_" + address, JSON.stringify(gameRewards))

      this.setState({
        gameRewards
      })
    })
  }

  getAccountPlayersList() {
    const {account} = this.state;
    const {address} = account
    axios.get(Api("/api/account-players/"), {
      params: {
        address
      }
    }).then(({data}) => {
      const accountPlayers = {}
      data.forEach(({player_id, id, ...row}) => {
        accountPlayers[player_id] = row
      })
      StorageLocal.set("account_players_" + address, JSON.stringify(accountPlayers))
      this.setState({
        accountPlayers
      })
    })
  }

  estimateGame() {
    ModelBswGame.getGameInfo().then(({playerContracts, games}) => {
      this.setState({
        games, playerContracts
      })
      const {
        transfer_one_player_once_game_fee,
        play_game_once_fee,
        accountPlayers,
        is_transfer_player,
        select_game_level,
        use_player_cost,
        select_contract_days, selectedPlayers, account
      } = this.state;
      if (account.bswGame.players.length === 0) {
        return getWeui().alert("not account player")
      }
      const estimatePlayers = []
      account.bswGame.players.forEach((player) => {
        if (in_array(player.tokenId, selectedPlayers)) {
          estimatePlayers.push(player)
        }
      })

      if (estimatePlayers.length === 0) {
        return getWeui().alert("not select account player")
      }

      let constTotal = 0
      const squidEnergys = []
      estimatePlayers.forEach((player) => {
        squidEnergys.push(player.squidEnergy)
      })
      squidEnergys.sort((a, b) => a - b)

      Object.keys(accountPlayers).forEach((playerId) => {
        if (in_array(parseInt(playerId), selectedPlayers)) {
          constTotal += accountPlayers[playerId].cost
        }
      })

      const player_cost = use_player_cost ? constTotal : 0

      const max_se_one_player = squidEnergys[squidEnergys.length - 1]

      const game_levels = select_game_level !== null ? [select_game_level] : [1, 2, 3, 4, 5, 6, 7]
      const contract_days_list = select_contract_days !== null ? [select_contract_days] : [15, 30, 60]

      const player_nums_one_game_list = [estimatePlayers.length]

      const estimateResult = ModelBswGame.estimateProfit({
        games, playerContracts,
        is_transfer_player,
        transfer_one_player_once_game_fee,
        play_game_once_fee,
        player_cost,
        max_se_one_player,
        game_levels,
        contract_days_list,
        player_nums_one_game_list
      })
      this.setState({
        estimateResult,
        player_cost,
        is_transfer_player,
        select_game_level,
        select_contract_days,
      })
    })
  }

  componentDidMount() {
    const {account} = this.state
    const {address} = account
    ModelBswGame.getGameInfo().then(({games}) => {
      this.setState({
        games
      })
    })
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

    const accountPlayers = StorageLocal.get("account_players_" + address)
    if (accountPlayers) {
      this.setState({
        accountPlayers: JSON.parse(accountPlayers)
      })

    }
    const gameRewards = StorageLocal.get("play_game_rewards_" + address)
    if (gameRewards) {
      this.setState({
        gameRewards: JSON.parse(gameRewards)
      })
    }
    const tx_list = StorageLocal.get("tx_list_" + address)
    if (tx_list) {
      this.setState({
        tx_list: JSON.parse(tx_list)
      })
    }
    this.getPlayGameList()
    this.getTxList()
    this.getAccountPlayersList()
    this.getPlayers(account, "account")
  }

  playGameResult(isWin) {
    const {account} = this.state;
    const {address} = account
    getWeui().confirm(isWin ? "Win ?" : "Loss?", () => {
      globalLoading("Save...")
      axios.post(Api("/api/game-play/"), {
        address,
        is_win: isWin ? 1 : 0
      }).then(({data}) => {
        console.log(data)
        this.getPlayGameList()
      }).finally(() => globalLoadingHide())
    })
  }

  render() {
    let squidEnergy_total = 0;
    let cost_total = 0;
    const {accounts} = this.props;
    const {
      playGameIndex,
      currentTransferPlayer,
      is_transfer_player,
      select_game_level,
      select_contract_days,
      player_cost,
      use_player_cost,
      games, playerContracts,
      sortDesc,
      connectedAddress,
      selectedPlayers,
      estimateResult,
      accountPlayers,
      sortField,
      account,
      accountElse
    } = this.state;
    return (
      <DrawerContent>
        <DrawerCloseButton/>
        <DrawerHeader>{account.toString()} ({(connectedAddress && connectedAddress.toLowerCase() === account.address.toLowerCase()) ? "connected" : "not connected"})</DrawerHeader>
        <DrawerBody>
          <Tabs variant='enclosed'>
            <TabList>
              <Tab>Players</Tab>
              <Tab>Tx</Tab>
              <Tab>Rewards</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <Stack height={20} paddingLeft={10} spacing={4}
                       direction='row' justifyContent="flex-start"
                       align='center'>
                  <Button
                    variant='solid'
                    isDisabled={
                      selectedPlayers.length === 0 || !connectedAddress || connectedAddress.toLowerCase() !== account.address.toLowerCase()
                    } isLoading={this.state.transferLoading}
                    colorScheme='teal'
                    size='sm' onClick={() => this.doTransfer(false)}
                    loadingText='Transfer...'>
                    转出
                  </Button>
                  <Select onChange={({target}) => {
                    this.setState({
                      accountElse: ModelWalletAccount.get(target.value)
                    })
                  }} placeholder='Select Transfer To Account'>
                    {
                      accounts.filter(acc => acc.address.toLowerCase() !== account.address.toLowerCase()).map((acc, i) => {
                        return (
                          <option key={i} value={acc.address}>
                            {acc.toString()}
                            {
                              (accountElse && accountElse.address.toLowerCase() === acc.address.toLowerCase()) ?
                                ` (${accountElse.bswGame.players.length}名)` :
                                ` (${acc.bswGame.players.length}名)`
                            }
                            {
                              (connectedAddress && connectedAddress.toLowerCase() === acc.address.toLowerCase()) ?
                                " (connected)" : ""
                            }
                          </option>
                        )
                      })
                    }
                  </Select>
                </Stack>
                <Table size='sm'>
                  <Thead>
                    <Tr>
                      <Th>
                        <Checkbox onChange={(e) => {
                          this.setState({
                            selectedPlayers: selectedPlayers.length === 0 ? account.bswGame.players.map(player => player.tokenId) : []
                          })
                        }} isChecked={selectedPlayers.length === account.bswGame.players.length}/>
                      </Th>
                      <Th>Id</Th>
                      <Th>Hex</Th>
                      <Th onClick={() => {
                        this.setState({
                          sortField: "squidEnergy",
                          sortDesc: !sortDesc
                        })
                      }}>SE</Th>
                      <Th>Cost</Th>
                      <Th onClick={() => {
                        this.setState({
                          sortField: "busyTo",
                          sortDesc: !sortDesc
                        })
                      }}>PlayTime</Th>
                      <Th onClick={() => {
                        this.setState({
                          sortField: "contractEndTimestamp",
                          sortDesc: !sortDesc
                        })
                      }}>ContractEnd</Th>
                      <Th onClick={() => {
                        this.setState({
                          sortField: "createTimestamp",
                          sortDesc: !sortDesc
                        })
                      }}>CreateDate</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {
                      account.bswGame.players.sort((a, b) => {
                        if (sortDesc) {
                          return b[sortField] - a[sortField]
                        } else {
                          return a[sortField] - b[sortField]
                        }
                      }).map((row, i) => {
                        const player = new ModelBswPlayer(row)
                        let title = "# " + player.tokenId
                        cost_total += accountPlayers[player.tokenId] ? accountPlayers[player.tokenId].cost : 0
                        squidEnergy_total += parseInt(player.squidEnergy)
                        const isChecked = in_array(player.tokenId, selectedPlayers)
                        return (
                          <Tr key={i}>
                            <Td>
                              {
                                (this.state.transferLoading && currentTransferPlayer && currentTransferPlayer.tokenId === player.tokenId) ?
                                  <Spinner size='sm'/> :
                                  <Checkbox onChange={(e) => {
                                    let selectedPlayers_
                                    if (e.target.checked) {
                                      selectedPlayers_ = [...selectedPlayers, player.tokenId]
                                    } else {
                                      selectedPlayers_ = selectedPlayers.filter(id => player.tokenId !== id)
                                    }
                                    this.setState({
                                      selectedPlayers: selectedPlayers_
                                    })
                                  }} isChecked={isChecked}/>
                              }
                            </Td>
                            <Td>
                              {title}
                            </Td>
                            <Td>
                              {intToHex(player.tokenId)}
                            </Td>
                            <Td>
                              <b>{player.squidEnergy}</b>
                            </Td>
                            <Td>
                              {accountPlayers[player.tokenId] && accountPlayers[player.tokenId].cost}
                            </Td>
                            <Td>
                              {player.busyToDate()}
                            </Td>
                            <Td>
                              {
                                player.contractEndDate()
                              }
                            </Td>
                            <Td>
                              {
                                player.createDate()
                              }
                            </Td>
                          </Tr>
                        )
                      })
                    }
                  </Tbody>
                  <Tfoot>
                    <Tr>
                      <Th colSpan={2}>Total Num: {selectedPlayers.length} / {account.bswGame.players.length}</Th>
                      <Th>{squidEnergy_total} SE</Th>
                      <Th>{cost_total.toFixed(1)}</Th>
                    </Tr>
                  </Tfoot>
                </Table>
                {/*<Stack height={20} paddingLeft={10} spacing={4}*/}
                {/*       direction='row' justifyContent="flex-start"*/}
                {/*       align='center'>*/}

                {/*  <Button variant='solid'*/}
                {/*          isDisabled={selectedPlayers.length === 0}*/}
                {/*          colorScheme='teal'*/}
                {/*          size='sm'*/}
                {/*          onClick={() => {*/}
                {/*            this.startGame()*/}
                {/*          }}>*/}
                {/*    开始游戏*/}
                {/*  </Button>*/}
                {/*  <Select value={playGameIndex || ""} onChange={(e) => {*/}
                {/*    this.setState({*/}
                {/*      playGameIndex: e.target.value === "" ? null : parseInt(e.target.value)*/}
                {/*    })*/}
                {/*  }} size={"sm"} placeholder='全部游戏'>*/}
                {/*    {*/}
                {/*      games.map(({level, chanceToWin, minSeAmount, rewardTokens}) => {*/}
                {/*        return (*/}
                {/*          <option key={level} value={level}>{level}级*/}
                {/*            SE:{minSeAmount} 胜率:{chanceToWin} 奖励:{(rewardTokens.bnb.usd + rewardTokens.bsw.usd).toFixed(2)} U </option>*/}
                {/*        )*/}
                {/*      })*/}
                {/*    }*/}
                {/*  </Select>*/}
                {/*</Stack>*/}

                <Stack height={12} paddingLeft={4} spacing={4}
                       direction='row' justifyContent="flex-start"
                       align='center'>

                  <Button variant='solid'
                          isDisabled={selectedPlayers.length === 0}
                          colorScheme='teal'
                          size='sm'
                          onClick={() => {
                            this.estimateGame()
                          }}>
                    测算
                  </Button>
                </Stack>

                {
                  (selectedPlayers.length > 0) &&
                  <div className="mt_32">
                    <EstimateResult {...{
                      player_cost,
                      estimateGame: this.estimateGame.bind(this),
                      setState: this.setState.bind(this),
                      use_player_cost,
                      player_nums_one_game: selectedPlayers.length,
                      is_transfer_player,
                      select_game_level,
                      select_contract_days,
                      games, playerContracts,
                      disableChangePlayerNumber:true
                    }} estimateResult={estimateResult}/>
                  </div>
                }
              </TabPanel>
              <TabPanel>
                <div className="mt_16">
                  <Table size='sm'>
                    <Thead>
                      <Tr>
                        <Th>Hash</Th>
                        <Th>TokenId</Th>
                        <Th>From</Th>
                        <Th>To</Th>
                        <Th>TransferFee</Th>
                        <Th>GasLimit</Th>
                        <Th>Confirm</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {
                        this.state.txList.map((tx, i) => {
                          const txFromAccount = ModelWalletAccount.get(tx.from)
                          const txToAccount = ModelWalletAccount.get(tx.to)
                          return (
                            <Tr key={i}>
                              <Td>
                                <p className="user_select_text">{ModelWalletAccount.maskHash(tx.hash, 3, 2)}</p>
                                <p>{timestampToDateStr(tx.timeStamp, "MM-dd hh:mm")} ({formatRecentTime(tx.timeStamp)})</p>
                              </Td>
                              <Td>
                                # {tx.tokenID}
                              </Td>
                              <Td>
                            <span className="user_select_text"
                                  style={{fontWeight: tx.from.toLowerCase() === account.address.toLowerCase() ? "700" : "400"}}>
                              {txFromAccount ? txFromAccount.addressMask() : ModelWalletAccount.maskHash(tx.from)}
                            </span>
                              </Td>
                              <Td>
                            <span className="user_select_text"
                                  style={{fontWeight: tx.to.toLowerCase() === account.address.toLowerCase() ? "700" : "400"}}>
                              {txToAccount ? txToAccount.addressMask() : ModelWalletAccount.maskHash(tx.to)}
                            </span>
                              </Td>
                              <Td>
                                {tx.transferFee}
                              </Td>
                              <Td>
                                {tx.gasLimit}
                              </Td>
                              <Td>
                                {tx.confirmations}
                              </Td>
                            </Tr>
                          )
                        })
                      }
                    </Tbody>
                  </Table>
                </div>
              </TabPanel>
              <TabPanel>
                {/*<Stack height={20} paddingLeft={10} spacing={4} direction='row' justifyContent="flex-start"*/}
                {/*       align='center'>*/}
                {/*  <Button*/}
                {/*    variant='solid' isDisabled={false} colorScheme='teal' size='sm'*/}
                {/*    onClick={() => this.playGame(1)}>*/}
                {/*    Win Game*/}
                {/*  </Button>*/}
                {/*  <Button*/}
                {/*    variant='solid' isDisabled={false} colorScheme='pink' size='sm'*/}
                {/*    onClick={() => this.playGame(0)}>*/}
                {/*    Loss Game*/}
                {/*  </Button>*/}
                {/*</Stack>*/}
                <div className="mt_16">
                  <Table size='sm'>
                    <Thead>
                      <Tr>
                        <Th>Address</Th>
                        <Th>IsWin</Th>
                        <Th>GameLevel</Th>
                        <Th>Reward</Th>
                        <Th>Reward Usd</Th>
                        <Th>Balance</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {
                        this.state.gameRewards.map((reward, i) => {
                          const account = ModelWalletAccount.get(reward.address)
                          return (
                            <Tr key={i}>
                              <Td>
                                <p>{account.addressMask()}</p>
                                <p>
                                  {timestampToDateStr(reward.timeStamp, "MM-dd hh:mm")} ({formatRecentTime(reward.timeStamp)})
                                </p>
                              </Td>
                              <Td>
                                {reward.is_win ? "Win" : "Loss"}
                              </Td>
                              <Td>
                                {reward.game_level + 1}
                              </Td>
                              <Td>
                                {reward.bsw_reward.toFixed(1)} BSW / {reward.bnb_reward.toFixed(4)} BNB
                              </Td>
                              <Td>
                                {(reward.bsw_usd_reward + reward.bnb_usd_reward).toFixed(2)} U
                              </Td>
                              <Td>
                                {reward.bsw_reward_total.toFixed(1)} BSW / {reward.bnb_reward_total.toFixed(4)} BNB
                              </Td>
                            </Tr>
                          )
                        })
                      }
                    </Tbody>
                  </Table>
                </div>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </DrawerBody>
        <DrawerFooter/>
        <NotifyView namespace={"wallet_accounts.players"} id={account.address} onUpdate={({account}) => {
          this.getPlayers(account, "accountElse")
          this.setState({
            accountElse: account
          })
        }}/>
      </DrawerContent>

    )
  }

  async transfer(account, accountElse, player) {
    try {
      return await sendPlayerTransaction(
        account.address, accountElse.address, parseInt(player.tokenId)
      )
    } catch (e) {
      getWeui().alert(e.message)
      console.error(e)
      return null
    }
  }

  afterLoadTx() {
    this.getTxList()
    const {account, accountElse} = this.state
    this.getPlayers(account, "account")
    this.getPlayers(accountElse, "accountElse")
    const {playersTransferSelected} = this;
    if (playersTransferSelected.length === 0) {
      getWeui().alert("Done!")
      this.setLoading(false)
    } else {
      this.transferPlayers().catch((e) => {
        this.setLoading(false)
        console.error(e)
      })
    }

  }

  async checkHashStatus(hash) {
    setTimeout(async () => {
      if (this.viewGone) {
        return
      }
      const tx = await getTransaction(this.web3, hash)
      console.log(tx)
      if (tx['transactionIndex']) {
        console.log("tx ok!!")
        this.afterLoadTx()
      } else {
        await this.checkHashStatus(hash)
      }
    }, 300)
  }

  setLoading(transferLoading) {
    this.setState({
      transferLoading
    })
    this.props.setState({
      closeOnOverlayClick: !transferLoading
    })
  }

  async transferPlayers() {
    const {accountElse, account} = this.state;
    if (account.address.toLowerCase() === accountElse.address.toLowerCase()) {
      this.setLoading(false)
      getWeui().alert("can not transfer to self")
      return
    }
    const {playersTransferSelected} = this;
    const t = playersTransferSelected.sort((a, b) => a.squidEnergy - b.squidEnergy)
    const player = t.shift()
    this.setState({
      currentTransferPlayer: player
    })

    console.log("transferPlayer: ", player, playersTransferSelected)
    const hash = await this.transfer(account, accountElse, player)
    if (hash) {
      await this.checkHashStatus(hash)
    } else {
      this.setLoading(false)
    }
  }

  doTransfer() {
    const {accountElse, account, selectedPlayers} = this.state;
    if (selectedPlayers.length === 0) {
      return getWeui().alert("no selectedPlayers")
    }
    if (!accountElse) {
      return getWeui().alert("no account select")
    }

    requestAccounts({}).then((accountAddress) => {
      if (account.address.toLowerCase() === accountAddress.toLowerCase()) {
        this.playersTransferSelected = []
        selectedPlayers.forEach(playerTokenId => {
          const player = new ModelBswGame(account.bswGame).getPlayerByTokenId(playerTokenId)
          if (player) {
            this.playersTransferSelected.push(player)
          }
        })
        this.setLoading(true)
        this.transferPlayers().catch((e) => {
            this.setLoading(false)
            getWeui().alert(e.message)
            console.error(e)
          }
        )
      } else {
        return getWeui().alert("Current wallet account is not right!")
      }
    })
  }

  startGame() {
    const {selectedPlayers, account, playGameIndex} = this.state;
    if (selectedPlayers.length === 0) {
      return getWeui().alert("selectedPlayers is null!")
    }
    if (playGameIndex === null) {
      return getWeui().alert("playGameIndex is null!")
    }
    const players = []
    selectedPlayers.forEach(playerTokenId => {
      const player = new ModelBswGame(account.bswGame).getPlayerByTokenId(playerTokenId)
      if (player) {
        players.push(player)
      }
    })
    requestAccounts({}).then((accountAddress) => {
      if (account.address.toLowerCase() === accountAddress.toLowerCase()) {
        this.setLoading(true)
        this._startGame(selectedPlayers, parseInt(playGameIndex) - 1).catch((e) => {
            this.setLoading(false)
            getWeui().alert(e.message)
            console.error(e)
          }
        )
      } else {
        return getWeui().alert("Current wallet account is not right!")
      }
    })
  }

  async _startGame(playerIds, playGameIndex) {
    const {account} = this.state;
    const hash = await startGameTransaction(
      account.address, playGameIndex, playerIds
    )
    if (hash) {
      await this.checkHashStatus(hash)
    } else {
      this.setLoading(false)
    }
  }

}

PlayersTable.propTypes = {}


export default PlayersTable
