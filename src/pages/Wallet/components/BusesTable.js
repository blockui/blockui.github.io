import React, {Component} from "react"
import {
  Button,
  Checkbox,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  Select,
  Spinner,
  Stack,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr
} from "@chakra-ui/react";
import {getTransaction, getWeb3, intToHex} from "../shared/eth_utils";
import {ModelBswBus} from "../shared/model_bsw_bus";
import {ModelBswGame} from "../shared/model_bsw_game";
import {ModelWalletAccount} from "../shared/model_wallet_account";
import {getWeui} from "../../../shared/functions/common";
import {requestAccounts} from "../shared/metamask";
import {sendBusTransaction} from "../shared/bsw_utils";
import {in_array} from "../shared/utils";

class BusesTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      connectedAddress: null,
      currentTransferBus: null,
      transferLoading: false,
      selectedBuses: [],
      sortDesc: true,
      sortField: "capacity"
    }
    this.busesTransferSelected = []
    this.web3 = getWeb3();
  }


  componentWillUnmount() {
    this.viewGone = true
  }

  getBuses(account, statusKey, cb) {
    ModelBswGame.getBuses(this.web3, account.address).then((bswGame) => {
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

  componentDidMount() {
    const {account} = this.props;
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
    this.getBuses(account, "account")
  }

  render() {
    const {account, accounts, accountElse} = this.props;
    const {sortDesc, selectedBuses, connectedAddress, currentTransferBus, transferLoading, sortField} = this.state;
    console.log("===>>",{selectedBuses,connectedAddress,address:account.address})
    return (
      <DrawerContent>
        <DrawerCloseButton/>
        <DrawerHeader>{account.toString()} ({(connectedAddress && connectedAddress.toLowerCase() === account.address.toLowerCase()) ? "connected" : "not connected"})</DrawerHeader>
        <DrawerBody>
          <Stack height={20} paddingLeft={10} spacing={4}
                 direction='row' justifyContent="flex-start"
                 align='center'>

            <Button
              variant='solid'
              isDisabled={
                selectedBuses.length === 0 || !connectedAddress || connectedAddress.toLowerCase() !== account.address.toLowerCase()
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
                          ` (${accountElse.bswGame.buses.length}车)` :
                          ` (${acc.bswGame.buses.length}车)`
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
                      selectedBuses: selectedBuses.length === 0 ? account.bswGame.buses.map(bus => bus.tokenId) : []
                    })
                  }} isChecked={selectedBuses.length === account.bswGame.buses.length}/>
                </Th>
                <Th>Id</Th>
                <Th>Hex</Th>
                <Th onClick={() => {
                  this.setState({
                    sortField: "capacity",
                    sortDesc: !sortDesc
                  })
                }}>capacity</Th>
              </Tr>
            </Thead>
            <Tbody>
              {
                account.bswGame.buses.sort((a, b) => {
                  if (sortDesc) {
                    return -a[sortField] + b[sortField]
                  } else {
                    return a[sortField] - b[sortField]
                  }
                }).map((row, i) => {
                  const bus = new ModelBswBus(row)
                  let title = "# " + bus.tokenId
                  const isChecked = in_array(bus.tokenId, selectedBuses)
                  return (
                    <Tr key={i}>
                      <Td>
                        {
                          (this.state.transferLoading && currentTransferBus && currentTransferBus.tokenId === bus.tokenId) ?
                            <Spinner size='sm'/> :
                            <Checkbox onChange={(e) => {
                              let selectedBuses_
                              if (e.target.checked) {
                                selectedBuses_ = [...selectedBuses, bus.tokenId]
                              } else {
                                selectedBuses_ = selectedBuses.filter(id => bus.tokenId !== id)
                              }
                              this.setState({
                                selectedBuses: selectedBuses_
                              })
                            }} isChecked={isChecked}/>
                        }
                      </Td>
                      <Td>
                        {title}
                      </Td>
                      <Td>
                        {intToHex(bus.tokenId)}
                      </Td>
                      <Td>
                        {bus.capacity}
                      </Td>
                    </Tr>
                  )
                })
              }
            </Tbody>
          </Table>
        </DrawerBody>
      </DrawerContent>

    )
  }

  doTransfer() {
    const {accountElse, account, selectedBuses} = this.state;
    if (selectedBuses.length === 0) {
      return getWeui().alert("no selectedBuses")
    }

    if (!accountElse) {
      return getWeui().alert("no account select")
    }

    requestAccounts({}).then((accountAddress) => {
      if (account.address.toLowerCase() === accountAddress.toLowerCase()) {
        this.busesTransferSelected = []
        selectedBuses.forEach(tokenId => {
          const bus = new ModelBswGame(account.bswGame).getBusByTokenId(tokenId)
          if (bus) {
            this.busesTransferSelected.push(bus)
          }
        })
        this.setLoading(true)
        this.transferBuses().catch((e) => {
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

  setLoading(transferLoading) {
    this.setState({
      transferLoading
    })
    this.props.setState({
      closeOnOverlayClick: !transferLoading
    })
  }


  async transferBuses() {
    const {accountElse, account} = this.state;
    if (account.address.toLowerCase() === accountElse.address.toLowerCase()) {
      this.setLoading(false)
      getWeui().alert("can not transfer to self")
      return
    }
    const {busesTransferSelected} = this;
    const t = busesTransferSelected.sort((a, b) => a.capacity - b.capacity)
    const bus = t.shift()
    this.setState({
      currentTransferBus: bus
    })

    console.log("transferBuses: ", bus, busesTransferSelected)
    const hash = await this.transfer(account, accountElse, bus)
    if (hash) {
      await this.checkHashStatus(hash)
    } else {
      this.setLoading(false)
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

  afterLoadTx() {
    const {account, accountElse} = this.state
    this.getBuses(account, "account")
    this.getBuses(accountElse, "accountElse")
    const {busesTransferSelected} = this;
    if (busesTransferSelected.length === 0) {
      getWeui().alert("Done!")
      this.setLoading(false)
    } else {
      this.transferBuses().catch((e) => {
        this.setLoading(false)
        console.error(e)
      })
    }
  }

  async transfer(account, accountElse, bus) {
    try {
      return await sendBusTransaction(
        account.address, accountElse.address, parseInt(bus.tokenId)
      )
    } catch (e) {
      getWeui().alert(e.message)
      console.error(e)
      return null
    }
  }
}

BusesTable.propTypes = {}


export default BusesTable
