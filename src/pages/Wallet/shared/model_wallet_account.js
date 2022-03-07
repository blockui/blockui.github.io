import axios from "axios";
import {Api} from "./api";
import StorageLocal from "./storage_local";
import StorageHelper from "shared/BD/helper/StorageHelper";
import {ModelBswGame} from "./model_bsw_game";
import {getBalance, getTokenBalance, getWeb3} from "./eth_utils";

export class ModelWalletAccount {
  constructor({
                id,
                name,
                address,
                bsw_staking,
                note,
                bnb,
                bsw,
                bswGame,
                wbnb,
                usdt
              }) {

    this.id = id
    this.address = address
    this.bswGame = new ModelBswGame(bswGame || {})
    this.name = name
    this.note = note
    this.bsw_staking = bsw_staking || 0
    this.bnb = bnb || 0
    this.bsw = bsw || 0
    this.wbnb = wbnb || 0
    this.usdt = usdt || 0
    this.__updatedAt = new Date()
  }

  update(account) {
    Object.assign(this, account)
    this.save()
  }

  static get(address) {
    let account = ModelWalletAccount.records[address.toLowerCase()]
    if (!account) {
      const res = StorageLocal.get("wallet_account_" + address.toLowerCase())
      if (res) {
        account = new ModelWalletAccount(JSON.parse(res))
        ModelWalletAccount.records[address.toLowerCase()] = account
      }
    }

    return account ? account : null
  }

  save() {
    const {address} = this;
    this.__updatedAt = new Date()
    ModelWalletAccount.records[address.toLowerCase()] = this;
    StorageLocal.set("wallet_account_" + address.toLowerCase(), JSON.stringify(this))
    StorageHelper.notify("wallet_account", address, this)
  }

  static maskHash(hash, head = 4, foot = 6) {
    return hash.substring(0, 4).toLowerCase() + "**" + hash.substring(hash.length - foot).toLowerCase()
  }

  addressMask() {
    return ModelWalletAccount.maskHash(this.address)
  }
  toString() {
    let str = ModelWalletAccount.maskHash(this.address)
    if (this.name && this.id) {
      str = " <" + (this.name ? this.name : this.id) + "> " + str
    }
    return str
  }

  static async getAccounts(syncDetail) {
    const {data} = await axios.get(Api("/api/accounts/"))
    const accounts = []
    for (let i in data) {
      const {address} = data[i];
      let account = ModelWalletAccount.get(address)
      if (account) {
        account.update(data[i])
      } else {
        account = new ModelWalletAccount({...data[i]})
        account.save()
      }
      if (syncDetail) {
        account.updateInfoFromRemote().catch(console.error)
      }
      accounts.push(account)
    }
    return accounts
  }

  async updateInfoFromRemote() {
    const web3 = getWeb3()
    const {address} = this
    console.log("updating... ", this.toString())
    try {
      const bnb = await getBalance(web3, address)
      const bsw = await getTokenBalance(web3, address, "bsw")
      const usdt = await getTokenBalance(web3, address, "usdt")
      const wbnb = await getTokenBalance(web3, address, "wbnb")
      const {players, minContractEndTime, minNextPlayTime} = await ModelBswGame.getPlayers(web3, address)
      const {buses} = await ModelBswGame.getBuses(web3, address)
      const bswGame = await ModelBswGame.getGame(web3, address)
      console.log("updating finished", this.toString(), {
        bnb,
        bsw,
        usdt,
        wbnb
      }, "players.length: ", players.length, players, "buses.length: ", buses.length, buses)

      this.update({
        bnb,
        bsw,
        usdt,
        wbnb,
        bswGame: {...this.bswGame, ...bswGame, minContractEndTime, minNextPlayTime, players, buses}
      })
      return this
    } catch (e) {
      console.error(e)
      throw new Error("update account error: " + e.message)
    }
  }
}

ModelWalletAccount.records = {}
