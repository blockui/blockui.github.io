import React from 'react';
import BasePage from "components/core/BasePage";
import {CoingeckoApi} from "../../../shared/block-chain/api/CoingeckoApi";
import ChartContractView from "../../../shared/block-chain/chart/ChartContractView";


class CandlestickPage extends React.PureComponent {
  render() {
    return (
      <BasePage title={"TradeView"} useHeader back>
        <div className="height_100p">
          <ChartContractView
            coin_id={CoingeckoApi.coins.BSW.id}
            price_toFixed={CoingeckoApi.coins.BSW.price_toFixed}
            asset_platform_id={CoingeckoApi.coins.BSW.asset_platform_id}
            contract_address={CoingeckoApi.coins.BSW.contract_address}/>
          <ChartContractView
            coin_id={CoingeckoApi.coins.BFG.id}
            price_toFixed={CoingeckoApi.coins.BFG.price_toFixed}
            asset_platform_id={CoingeckoApi.coins.BFG.asset_platform_id}
            contract_address={CoingeckoApi.coins.BFG.contract_address}/>
          <ChartContractView
            coin_id={CoingeckoApi.coins.RGLOD.id}
            price_toFixed={CoingeckoApi.coins.RGLOD.price_toFixed}
            asset_platform_id={CoingeckoApi.coins.RGLOD.asset_platform_id}
            contract_address={CoingeckoApi.coins.RGLOD.contract_address}/>
        </div>
      </BasePage>
    );
  }
}

export default CandlestickPage
