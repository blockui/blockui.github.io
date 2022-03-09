import React from "react";
import * as LightweightCharts from "lightweight-charts";
import BaWebSocket from "../api/BaWebSocket";
import {BaApi, KLine} from "../api/BaApi";
import PdbHelper from "../../BD/helper/PdbHelper";
import {getCurrentTimeStamp} from "../../functions/utils";
import PropTypes from "prop-types";

class ChartCandleView extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      data: [],
      symbol: props.symbol,
      interval: props.interval || "15m"
    };
    this.streamHanlderId = props.symbol+getCurrentTimeStamp()
    this.refChart = React.createRef();
    this.refWrap = React.createRef();
    this.viewGone = false;
    this.pdb = new PdbHelper("kline_v11")
  }

  componentWillUnmount() {
    BaWebSocket.regStreamHandler(this.streamHanlderId, null)
    const {symbol, interval} = this.state;
    const streamSubscribed = `${symbol}@kline_${interval}`.toLowerCase()
    if(BaWebSocket.getInstance()){
      BaWebSocket.getInstance().unSubscribe([streamSubscribed])
    }
    this.viewGone = true;
    window.removeEventListener('resize', this.handleResize.bind(this));
    this.chart && this.chart.remove();
  }

  handleResize() {
    this.chart && this.chart.applyOptions({width: this.refChart.current.clientWidth});
  }

  loadChart({height}) {
    var chart = LightweightCharts.createChart(this.refChart.current, {
      width: this.refChart.current.clientWidth,
      height,
      crosshair: {
        mode: LightweightCharts.CrosshairMode.Normal,
      },
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
      },
    });

    var candleSeries = chart.addCandlestickSeries();
    const {data} = this.state;
    if (data.length > 0) {
      candleSeries.setData(data);
      this.currentBar = data[data.length - 1]
    }

    const {symbol, interval} = this.state;
    const streamSubscribed = `${symbol}@kline_${interval}`.toLowerCase()
    if(BaWebSocket.getInstance()){
      BaWebSocket.getInstance().subscribe([streamSubscribed])
    }
    this.updatePrice()
    // chart.timeScale().fitContent();
    this.chart = chart;
    this.candleSeries = candleSeries
    window.addEventListener('resize', this.handleResize.bind(this));
  }

  componentDidMount() {
    this.init().catch(console.error)
  }

  updatePrice() {
    BaWebSocket.regStreamHandler(this.streamHanlderId, ({data, stream}) => {
      const {symbol, interval} = this.state;
      const streamSubscribed = `${symbol}@kline_${interval}`.toLowerCase()
      if (stream === streamSubscribed) {
        const {k} = data
        const time = Math.floor(Number(k.t) / 1000)
        const high = Number(k.h)
        const low = Number(k.l)
        const close = Number(k.c)
        const open = Number(k.o)

        if (!this.viewGone && this.chart && this.candleSeries) {
          const currentBar = new KLine({time, high, low, close, open})
          console.log(streamSubscribed, currentBar.dateStr, currentBar.close)
          this.candleSeries.update(currentBar);
        }
      }
    })
  }

  async init() {
    const {symbol, interval} = this.state;
    const pdb = this.pdb
    let res = await pdb.get(`${symbol}_${interval}`)
    let rows;
    if (res && res.rows.length > 0) {
      rows = res.rows.map(row => new KLine(row))
      const currentTime = getCurrentTimeStamp(true)
      let {time} = rows[rows.length - 1];
      const intervalSec = BaApi.parseIntervalSec(interval)
      if (time + intervalSec < currentTime) {
        const rows_1 = await BaApi.fetchKLineData({symbol, interval, startTimeSec: time, endTimeSec: currentTime})
        rows = [
          ...rows.slice(0, rows.length - 1), ...rows_1
        ]
        await pdb.updateOrAdd({
          doc_id: `${symbol}_${interval}`,
          rows
        })
      }
    } else {
      rows = await BaApi.fetchKLineData({symbol, interval})
      await pdb.updateOrAdd({
        doc_id: `${symbol}_${interval}`,
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

  render() {
    return (
      <div ref={this.refWrap} style={{width: "100%", height: this.props.height || 300}}>
        <div ref={this.refChart}/>
      </div>
    );
  }
}

ChartCandleView.propTypes = {
  height: PropTypes.number,
  symbol: PropTypes.string.isRequired,
  interval: PropTypes.number
};
export default ChartCandleView
