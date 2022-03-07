import {fromWei, getBswGame, getBswGameBuses, getBswGamePlayers, getWeb3} from "./eth_utils";
import {ModelBswBus} from "./model_bsw_bus";
import {ModelBswPlayer} from "./model_bsw_player";
import {currentTimestamp, timestampToDateStr} from "shared/functions/date";
import StorageLocal from "./storage_local";
import {globalLoading, globalLoadingHide} from "../../../shared/functions/common";
import {in_array} from "./utils";

export class ModelBswGame {
  constructor({
                bswBalance,
                stakedAmount,

                busBalance,
                allowedBusBalance,
                secToNextBus,
                firstBusTimestamp,
                allowedSeatsInBuses,
                buses,

                playerBalance,
                availableSEAmount,
                minContractEndTime,
                minNextPlayTime,
                players,

                currentFee,
                rewardBalance,

                games,
                playerContracts
              }) {
    this.secToNextBus = secToNextBus || 0;
    this.secToNextBus = secToNextBus || 0;
    this.games = games || [];
    this.playerContracts = playerContracts || [];
    this.rewardBalance = rewardBalance || {
      bsw: {
        usd: 0,
        amount: 0
      },
      bnb: {
        usd: 0,
        amount: 0
      }
    };
    this.stakedAmount = stakedAmount || 0;
    this.allowedSeatsInBuses = allowedSeatsInBuses || 0;
    this.availableSEAmount = availableSEAmount || 0;
    this.playerBalance = playerBalance || 0;
    this.bswBalance = bswBalance || 0;
    this.busBalance = busBalance || 0;
    this.currentFee = currentFee || 0;

    this.firstBusTimestamp = firstBusTimestamp;
    this.allowedBusBalance = allowedBusBalance;
    this.buses = buses || [];
    this.players = players || [];
    this.minContractEndTime = minContractEndTime || 0
    this.minNextPlayTime = minNextPlayTime || 0
  }

  static async getGame(web3, address) {
    const {userInfo, gameInfo, playerContracts} = await getBswGame(web3, address)
    const {
      rewardBalance, stakedAmount, secToNextBus, allowedBusBalance, allowedSeatsInBuses,
      availableSEAmount, bswBalance, busBalance, currentFee, playerBalance
    } = userInfo

    const rewardBalance_ = ModelBswGame.parseRewardToken(rewardBalance)
    const games = []
    gameInfo.forEach(({game, index, playerAndBusAmount, seAmount, bswStake}) => {
      const {chanceToWin, enable, minSeAmount, minStakeAmount, name, rewardTokens} = game
      games.push({
        level: parseInt(index) + 1,
        playerAndBusAmount,
        seAmount,
        bswStake,
        chanceToWin: parseInt(chanceToWin) / 10000,
        enable,
        name,
        rewardTokens: ModelBswGame.parseRewardToken(rewardTokens),
        minSeAmount: fromWei(minSeAmount),
        minStakeAmount: fromWei(minStakeAmount),
      })
    })
    let currentFee_ = parseFloat(currentFee)
    return {
      rewardBalance: rewardBalance_,
      games,
      playerContracts,
      stakedAmount: fromWei(stakedAmount),
      secToNextBus: parseInt(secToNextBus),
      allowedBusBalance: parseInt(allowedBusBalance),
      allowedSeatsInBuses: parseInt(allowedSeatsInBuses),
      availableSEAmount: fromWei(availableSEAmount),
      bswBalance: fromWei(bswBalance),
      busBalance: parseInt(busBalance),
      playerBalance: parseInt(playerBalance),
      currentFee: currentFee_ > 0 ? currentFee_ / 100 : 0,
    }
  }

  static parseRewardToken(rewardBalance) {
    let rewardBsw = 0
    let rewardBswUsd = 0
    let rewardBnb = 0
    let rewardBnbUsd = 0
    for (let i in rewardBalance) {
      const {rewardInToken, rewardInUSD, token} = rewardBalance[i]
      if (token === "0x965F527D9159dCe6288a2219DB51fc6Eef120dD1") {
        rewardBsw = fromWei(rewardInToken)
        rewardBswUsd = fromWei(rewardInUSD)
      } else {
        rewardBnb = fromWei(rewardInToken)
        rewardBnbUsd = fromWei(rewardInUSD)
      }
    }
    return {
      bsw: {
        amount: rewardBsw,
        usd: rewardBswUsd
      },
      bnb: {
        amount: rewardBnb,
        usd: rewardBnbUsd
      }
    }
  }

  totalSe() {
    let t = 0
    this.players.forEach(player => {
      if (player.contractEndTimestamp > currentTimestamp()) {
        t += player.squidEnergy
      }
    })
    return t
  }

  busSeatList() {
    const t = []
    this.buses.forEach(bus => {
      t.push(bus.capacity + "")
    })
    return t.join("-")
  }

  minNextPlayTimeStr(format = "MM-dd hh:mm") {
    return this.minNextPlayTime > 0 ? timestampToDateStr(this.minNextPlayTime, format) : ""
  }

  minContractEndTimeStr(format = "MM-dd hh:mm") {
    return this.minContractEndTime > 0 ? timestampToDateStr(this.minContractEndTime, format) : ""
  }

  firstBusTimestampStr(format = "MM-dd hh:mm") {
    return this.firstBusTimestamp > 0 ? timestampToDateStr(this.firstBusTimestamp, format) : ""
  }

  secToNextBusStr(format = "MM-dd hh:mm") {
    return this.secToNextBus > 0 ? timestampToDateStr(this.secToNextBus, format) : ""
  }


  static calcMinNextPlayTime(players) {
    const busyToList = []
    players.forEach(({busyTo, contractEndTimestamp}) => {
      if (busyTo > 0 && currentTimestamp() - 3600 * 12 < busyTo && contractEndTimestamp > currentTimestamp()) {
        busyToList.push(busyTo)
      }
    })
    if (busyToList.length > 0) {
      const busyToListSort = busyToList.sort()
      return busyToListSort[0]
    } else {
      return 0
    }
  }

  static calcMinContractEndTime(players) {
    const contractEndTimestampList = []
    players.forEach(({contractEndTimestamp}) => {
      if (contractEndTimestamp > 0 && contractEndTimestamp > currentTimestamp()) {
        contractEndTimestampList.push(contractEndTimestamp)
      }
    })
    if (contractEndTimestampList.length > 0) {
      const contractEndTimestampListSort = contractEndTimestampList.sort()
      return contractEndTimestampListSort[0]
    } else {
      return 0
    }
  }

  static async getPlayers(web3, address) {
    const players = await getBswGamePlayers(web3, address)
    const rows = []
    players.forEach((player) => {
      rows.push(new ModelBswPlayer({
        rarity: parseInt(player['rarity']),
        tokenId: parseInt(player['tokenId']),
        stakeFreeze: player['stakeFreeze'],
        busyTo: parseInt(player['busyTo']),
        createTimestamp: parseInt(player['createTimestamp']),
        contractEndTimestamp: parseInt(player['contractEndTimestamp']),
        squidEnergy: parseInt(web3.utils.fromWei(player['squidEnergy'])),
        maxSquidEnergy: parseInt(web3.utils.fromWei(player['maxSquidEnergy'])),
      }))
    })

    return {
      players: rows,
      minContractEndTime: ModelBswGame.calcMinContractEndTime(rows),
      minNextPlayTime: ModelBswGame.calcMinNextPlayTime(rows)
    }
  }

  static async getBuses(web3, address) {
    const {balance, buses} = await getBswGameBuses(web3, address)
    const rows = []
    buses.forEach((bus) => {
      rows.push(new ModelBswBus({
        tokenId: parseInt(bus['tokenId']),
        capacity: parseInt(bus['capacity']),
        level: parseInt(bus['level']),
        uri: parseInt(bus['uri']),
        createTimestamp: parseInt(bus['createTimestamp']),
      }))
    })
    return {
      buses: rows,
    }
  }

  static async loadingGameInfo(address) {
    const web3 = getWeb3()
    const res = await ModelBswGame.getGame(web3, address|| "0x62f380ead62fbf2710fa25f9eac51e57e7c16cfe")
    globalLoadingHide()
    StorageLocal.set("game_info_v211", JSON.stringify(res))
    return res
  }

  static async getGameInfo(address) {
    const gameInfo = StorageLocal.get("game_info_v211")
    if (!gameInfo || address) {
      globalLoading("Loading...")
      return ModelBswGame.loadingGameInfo(address)
    } else {
      return JSON.parse(gameInfo)
    }
  }

  static estimateProfit(data) {
    console.log("estimateProfit", data)
    let {
      games,
      contract_days_list,
      playerContracts,
      is_transfer_player,
      play_game_once_fee,
      transfer_one_player_once_game_fee,
      player_cost,
      max_se_one_player,
      game_levels,
      player_nums_one_game_list
    } = data
    const estimateResult = []
    transfer_one_player_once_game_fee = transfer_one_player_once_game_fee || 0.2
    is_transfer_player = is_transfer_player || false;
    play_game_once_fee = play_game_once_fee || 0.5

    game_levels.forEach(game_level => {
      player_nums_one_game_list.forEach((player_nums_one_game) => {
        const game = games[parseInt(game_level) - 1]
        playerContracts.forEach(({duration, priceInUSD}) => {
          if (!in_array(duration, contract_days_list)) return
          const result = ModelBswGame.compute_result({
            player_nums_one_game: parseInt(player_nums_one_game),
            contract_fee: priceInUSD,
            days: duration,
            game,
            play_game_once_fee,
            transfer_one_player_once_game_fee,
            is_transfer_player,
            player_cost,
            max_se_one_player
          })
          if (result) {
            estimateResult.push(result)
          }
        })
      })
    })
    return estimateResult
  }

  static compute_result({
                          max_se_one_player,
                          player_cost,
                          contract_fee,
                          player_nums_one_game,
                          game,
                          days,
                          play_game_once_fee,
                          transfer_one_player_once_game_fee,
                          is_transfer_player
                        }) {
    const {rewardTokens, minSeAmount, minStakeAmount, chanceToWin} = game
    console.log("compute_result ===>>>", days, game.level, {max_se_one_player, player_nums_one_game, minSeAmount})

    if (max_se_one_player * player_nums_one_game < minSeAmount || minSeAmount / player_nums_one_game < 300 || minSeAmount / player_nums_one_game > 4000) {
      return null
    }
    const contract_price_usd_per_player = contract_fee
    const play_game_once_reward_usd = rewardTokens.bnb.usd + rewardTokens.bsw.usd
    const play_times = parseInt((days + 1) / 2)

    const once_game_transfer_player_fee = is_transfer_player ? transfer_one_player_once_game_fee * 2 : 0
    const final_transfer_player_fee = play_times * once_game_transfer_player_fee

    const final_play_time_fee = play_game_once_fee * play_times

    const player_contract_cost = player_nums_one_game * contract_price_usd_per_player

    const final_cost = player_contract_cost + final_play_time_fee + final_transfer_player_fee + player_cost
    const final_total_reward_usd = play_game_once_reward_usd * chanceToWin * play_times
    const referral_reward = final_total_reward_usd * 0.03
    const profit = final_total_reward_usd + referral_reward - final_cost

    const profitability = profit / final_cost

    let back_cost_play_time = play_times
    let back_cost_days = days
    let profit_45 = 0;
    let profitability_45 = 0;
    for (let i = 1; i <= play_times; i++) {
      const final_total_reward_usd_1 = play_game_once_reward_usd * chanceToWin * i
      const final_play_time_fee_1 = play_game_once_fee * i
      const final_transfer_player_fee_1 = i * once_game_transfer_player_fee
      const referral_reward_1 = final_total_reward_usd_1 * 0.03
      const final_cost_1 = player_contract_cost + player_cost + final_play_time_fee_1 + final_transfer_player_fee_1

      if (final_total_reward_usd_1 + referral_reward_1 - final_cost_1 >= 0) {
        console.log("back cost", days, i, (i - 1) * 2, final_total_reward_usd_1 + referral_reward_1, final_cost_1)
        if (back_cost_play_time === play_times) {
          back_cost_play_time = i;
          back_cost_days = (i - 1) * 2
        }
        if (days > 30 && i === 23) {
          profit_45 = final_total_reward_usd_1 + referral_reward_1 - final_cost_1;
          profitability_45 = profit_45 / final_cost_1
        }
      }
    }
    return {
      back_cost_play_time,
      back_cost_days,
      days,
      game,
      profit_45,
      profitability_45,
      profitability,
      profit,
      player_cost,
      referral_reward,
      final_total_reward_usd,
      final_cost,
      player_contract_cost,
      final_play_time_fee,
      player_nums_one_game,
      final_transfer_player_fee,
      once_game_transfer_player_fee,
      play_times,
      play_game_once_reward_usd,
      contract_price_usd_per_player
    }
  }

  getPlayerByTokenId(tokenId) {
    let player = null;
    this.players.forEach((row) => {
      if (row.tokenId === tokenId) {
        player = row
      }
    })
    return player;
  }

  getBusByTokenId(tokenId) {
    let bus = null;
    this.buses.forEach((row) => {
      if (row.tokenId === tokenId) {
        bus = row
      }
    })
    return bus;
  }
}

