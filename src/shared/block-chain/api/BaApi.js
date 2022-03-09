import axios from "axios";
import {Api} from "../../../pages/Wallet/shared/api";
import {timestampToDateStr} from "../../functions/date";

export class KLine {
  constructor({time, open, high, low, close}) {
    this.time = time //unixtimestamp
    this.open = open
    this.high = high
    this.low = low
    this.close = close
    this.dateStr = timestampToDateStr(this.time,"MM-dd hh:mm:ss")
  }
}

export class Ticker24hr {
  constructor({
                symbol, priceChange, priceChangePercent, weightedAvgPrice,
                prevClosePrice,
                lastPrice, lastQty, bidPrice, bidQty, askPrice, askQty,
                openPrice, highPrice, lowPrice, volume, quoteVolume, openTime,
                closeTime, firstId, lastId, count
              }) {
    this.symbol = symbol
    this.priceChange = Number(priceChange)
    this.priceChangePercent = Number(priceChangePercent)
    this.weightedAvgPrice = Number(weightedAvgPrice)
    this.prevClosePrice = Number(prevClosePrice)
    this.lastPrice = Number(lastPrice)
    this.lastQty = Number(lastQty)
    this.bidPrice = Number(bidPrice)
    this.bidQty = Number(bidQty)
    this.askPrice = Number(askPrice)
    this.askQty = Number(askQty)
    this.openPrice = Number(openPrice)
    this.highPrice = Number(highPrice)
    this.lowPrice = Number(lowPrice)
    this.volume = Number(volume)
    this.quoteVolume = Number(quoteVolume)
    this.openTime = openTime
    this.closeTime = closeTime
    this.firstId = firstId
    this.lastId = lastId
    this.count = count
  }
}

export class BaApi {
  static async fetchKLineData({symbol,startTimeSec,endTimeSec,limit, interval}) {
    const {data} = await axios.get(Api("/ba-api/"), {
      params: {
        path: "v3/klines",
        symbol,
        interval,
        startTime:startTimeSec ? startTimeSec * 1000 : undefined,
        endTime:endTimeSec ? endTimeSec * 1000 : undefined,
        limit // 默认 500; 最大 1000.
      }
    });
    // [
    // [
    //   1499040000000,      // 开盘时间
    //   "0.01634790",       // 开盘价
    //   "0.80000000",       // 最高价
    //   "0.01575800",       // 最低价
    //   "0.01577100",       // 收盘价(当前K线未结束的即为最新价)
    //   "148976.11427815",  // 成交量
    //   1499644799999,      // 收盘时间
    //   "2434.19055334",    // 成交额
    //   308,                // 成交笔数
    //   "1756.87402397",    // 主动买入成交量
    //   "28.46694368",      // 主动买入成交额
    //   "17928899.62484339" // 请忽略该参数
    // ]
    // ]
    const rows = data[0]
    return rows.length > 0 ? rows.map(row => {
      return new KLine({
        time: Number(row[0]) / 1000,
        open: Number(row[1]),
        high: Number(row[2]),
        low: Number(row[3]),
        close: Number(row[4]),
      })
    }) : []
  }

  static async fetchTicker24hr({symbol}) {
    const {data} = await axios.get(Api("/ba-api/"), {
      params: {
        path: "v3/ticker/24hr",
        symbol,
      }
    });

    const {openTime,closeTime,...row} = data[0]
    return new Ticker24hr({
      ...row,
      openTime: Number(openTime) / 1000,
      closeTime: Number(closeTime) / 1000,
    })
  }
  static parseIntervalSec(interval){
    const t = interval.substring(interval.length - 1)
    const n = parseInt(interval.substring(0,interval.length - 1))
    switch (t){
      case "m":
        return 60 * n
      case "h":
        return 60 * 60 * n
      case "d":
        return 24 * 60 * 60 * n
      case "w":
        return 7 * 24 * 60 * 60 * n
      case "M":
        return 30 * 7 * 24 * 60 * 60 * n
    }

  }
}

// K线间隔:
// m -> 分钟; h -> 小时; d -> 天; w -> 周; M -> 月
BaApi.intervalTyps = [
  "1m", "3m", "5m", "15m", "30m", "1h", "2h", "4h", "6h", "8h", "12h", "1d", "3d", "1w", "1M"
]

