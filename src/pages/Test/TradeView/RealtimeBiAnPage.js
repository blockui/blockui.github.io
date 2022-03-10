import React from 'react';
import BasePage from "components/core/BasePage";
import ChartCandleView from "../../../shared/block-chain/chart/ChartCandleView";


class RealtimeBiAnPage extends React.PureComponent {
  render() {
    return (
      <BasePage title={"BiAn"} useScroll={true} useHeader back>
        <ChartCandleView symbol={"BTCUSDT"}/>
        <ChartCandleView symbol={"ETHUSDT"}/>
        <ChartCandleView symbol={"BNBUSDT"}/>
        <ChartCandleView symbol={"SFPUSDT"}/>
      </BasePage>
    );
  }
}

export default RealtimeBiAnPage
