import React from "react";
import PdbHelper from "../../BD/helper/PdbHelper";
import * as LightweightCharts from "lightweight-charts";
import {timestampToDateStr} from "../../functions/date";
import {getCurrentTimeStamp} from "../../functions/utils";
import {CoingeckoApi} from "../api/CoingeckoApi";
import PropTypes from "prop-types";
import ChartLine from "./ChartLine";

class ChartContractView extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      coin_id: props.coin_id,
      price_toFixed: props.price_toFixed || 3,
      contract_address: props.contract_address ,
      asset_platform_id: props.asset_platform_id,
      vs_currency: props.vs_currency || "usd",
      days: props.days || 14,
      loading: false,
      data: []
    };
    this.viewGone = false;

    this.refChart = React.createRef();
    this.refWrap = React.createRef();
    this.pdb = new PdbHelper("market_chart_v13")
  }

  componentWillUnmount() {
    this.viewGone = true;
    window.removeEventListener('resize', this.handleResize.bind(this));
    this.chart && this.chart.remove();
    this.areaSeries = null
    this.chart = null
  }

  handleResize() {
    this.chart && this.chart.applyOptions({width: this.refChart.current.clientWidth});
  }

  loadChart({height}) {
    const chart = LightweightCharts.createChart(this.refChart.current, {
      width: this.refChart.current.clientWidth,
      height,
      layout: {
        backgroundColor: "#000000",
        textColor: "#d1d4dc"
      },
      grid: {
        vertLines: {
          visible: false
        },
        horzLines: {
          color: "rgba(42, 46, 57, 0.5)"
        }
      },
      rightPriceScale: {
        borderVisible: false
      },
      localization: {
        priceFormatter: (price) => {
          return price.toFixed(this.state['price_toFixed']);
        },
        timeFormatter: (t) => {
          return timestampToDateStr(t, "MM-dd hh:mm")
        },
      },
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
        borderVisible: false
      },
      crosshair: {
        horzLine: {
          visible: false
        }
      }
    });
    this.chart = chart;
    chart.timeScale().fitContent();

    window.addEventListener('resize', this.handleResize.bind(this));

    var seriesesData = new Map([
      ["1D", this.state.data],
    ]);
    // debugger
    var areaSeries = null;
    var intervals = ["1D", "15m"];

    const interval = intervals[0]

    // chart.removeSeries(areaSeries);
    // areaSeries = null;

    areaSeries = chart.addAreaSeries({
      topColor: "rgba(76, 175, 80, 0.56)",
      bottomColor: "rgba(76, 175, 80, 0.04)",
      lineColor: "rgba(76, 175, 80, 1)",
      lineWidth: 2
    });

    const rows = seriesesData.get(interval)
    this.currentBar = rows[rows.length - 1]
    areaSeries.setData(rows);
    this.areaSeries = areaSeries
    this.updatePrice()
  }

  updatePrice() {
    setTimeout(async () => {
      if (this.viewGone) {
        return;
      }
      const currentTime = getCurrentTimeStamp(true)
      let {currentBar} = this;

      if (currentBar.time < currentTime) {
        const {coin_id, vs_currency} = this.state;
        const res = await CoingeckoApi.getCurrentPrice({
          ids: coin_id,
          vs_currencies: vs_currency,
        })
        if (this.chart && this.areaSeries && res) {
          const t = currentTime - currentTime % 60
          const bar = new ChartLine({
            time: t < currentBar.time ? currentBar.time : t,
            value: res[coin_id][vs_currency]
          })
          this.areaSeries.update(bar)
          console.log(coin_id,bar.dateStr, bar.value)
          this.currentBar = bar
        }
      }
      this.updatePrice()
    }, 800);
  }

  async init() {
    const {contract_address, asset_platform_id, vs_currency, days} = this.state;
    const pdb = this.pdb
    const doc_id = `${contract_address}_${asset_platform_id}_${vs_currency}`
    let res = await pdb.get(doc_id)
    let rows;
    if (res && res.rows.length > 0) {
      rows = res.rows.map(row => new ChartLine(row))
      const currentTime = getCurrentTimeStamp(true)
      let {time} = rows[rows.length - 1];
      if (time < currentTime) {
        const resRange = await CoingeckoApi.fetchContractMarketChartRange({
          contract_address,
          asset_platform_id,
          vs_currency,
          from: time + 1,
          to: currentTime
        })
        rows = [
          ...rows, ...resRange.prices.map(row => new ChartLine({
            time: Math.floor(row[0] / 1000),
            value: row[1]
          }))
        ]
        await pdb.updateOrAdd({
          doc_id,
          rows
        })
      }
    } else {
      const res = await CoingeckoApi.fetchContractMarketChart({
        contract_address,
        asset_platform_id,
        vs_currency,
        days
      })
      rows = res.prices.map(row => new ChartLine({
        time: Math.floor(row[0] / 1000),
        value: row[1]
      }))
      await pdb.updateOrAdd({
        doc_id,
        rows
      })
    }

    this.setState({
      data: rows
    }, () => {
      const {clientHeight} = this.refWrap.current;
      this.loadChart({height: clientHeight});
    })
  }

  componentDidMount() {
    this.init().catch(console.error)
  }

  render() {
    return (
      <div ref={this.refWrap} style={{width: "100%", height: this.props.height || 300}}>
        <div ref={this.refChart}/>
      </div>
    );
  }
}


ChartContractView.propTypes = {
  height: PropTypes.number,
  price_toFixed: PropTypes.number,
  coin_id: PropTypes.string.isRequired,
  contract_address: PropTypes.string.isRequired,
  asset_platform_id: PropTypes.string.isRequired,
  vs_currency: PropTypes.string,
  days: PropTypes.number
};
export default ChartContractView
