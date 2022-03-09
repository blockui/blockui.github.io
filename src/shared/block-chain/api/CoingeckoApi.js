import axios from "axios";
import {Api} from "../../../pages/Wallet/shared/api";

export class CoingeckoApi {
  static async getCurrentPrice({ids, vs_currencies}) {
    const {data} = await axios.get(Api("/coin-api/"), {
      params: {
        path: "v3/simple/price",
        vs_currencies,
        ids,
      }
    });
    return data[0]
  }

  static async fetchContractMarketChart({contract_address, asset_platform_id, vs_currency, days}) {
    const {data} = await axios.get(Api("/coin-api/"), {
      params: {
        path: "v3/coins/" + asset_platform_id + "/contract/" + contract_address + "/market_chart",
        vs_currency,
        days,
      }
    });
    return CoingeckoApi.handleContractMarketData(data[0])
  }

  static async fetchContractMarketChartRange({contract_address, asset_platform_id, vs_currency, from, to}) {
    const {data} = await axios.get(Api("/coin-api/"), {
      params: {
        path: "v3/coins/" + asset_platform_id + "/contract/" + contract_address + "/market_chart/range",
        vs_currency,
        from, to
      }
    });
    return CoingeckoApi.handleContractMarketData(data[0])
  }

  static handleContractMarketData({market_caps, prices, total_volumes}) {
    return {
      market_caps,
      prices,
      total_volumes
    }
  }
}

CoingeckoApi.asset_platforms = {
  BSC: {
    "id": "binance-smart-chain",
    "chain_identifier": 56,
    "name": "BNB Smart Chain",
    "shortname": "BSC"
  }
}
CoingeckoApi.coins = {
  BNB: {
    id: "binancecoin",
  },
  BSW: {
    id: "biswap",
    price_toFixed: 3,
    asset_platform_id:"binance-smart-chain",
    contract_address: "0x965f527d9159dce6288a2219db51fc6eef120dd1"
  },
  BFG: {
    id: "bfg-token",
    price_toFixed: 4,
    asset_platform_id:"binance-smart-chain",
    contract_address: "0xbb46693ebbea1ac2070e59b4d043b47e2e095f86"
  },
  RGLOD: {
    id: "royal-gold",
    price_toFixed: 2,
    asset_platform_id:"binance-smart-chain",
    contract_address: "0x0496ccd13c9848f9c7d1507d1dd86a360b51b596"
  }
}

