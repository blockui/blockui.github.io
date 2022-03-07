import React from 'react';
import {connect} from 'react-redux';
import {setStoreState} from "components/core/App";
import {TopAction} from "./index";
import IApp from 'shared/BD/IApp';
import QrScanner from "shared/qr-scanner";
import {_debug, globalLoading, globalLoadingHide} from "shared/functions/common";


class QrCodeScanner extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      ready: false
    }
  }

  onClose() {
    setStoreState("global", {
      qrCodeScanner: false,
    })
  }

  componentWillUnmount() {
    this.onDestroy()
  }

  onDestroy() {
    if (this.qrScanner) {
      this.qrScanner.destroy();
      this.qrScanner = null
    }
  }

  componentDidMount() {
    this.init()
  }

  init() {
    const {qrCodeScanner} = this.props;
    const useBarCodeDetect = IApp.checkNotIApp()
    const qrScanner = new QrScanner(
      document.querySelector(".video-qr-scanner"),
      useBarCodeDetect,
      result => {
        qrCodeScanner && qrCodeScanner(result)
        setStoreState("global", {
          qrCodeScanner: false,
        })
      }
    );
    globalLoading()
    qrScanner.start().then(() => {
      setTimeout(() => {
        this.setState({
          ready: true
        })
      }, 300)
    }).finally(() => {
      setTimeout(() => {
        globalLoadingHide()
      }, 100)
    })
    this.qrScanner = qrScanner;
  }

  toggleFlight() {
    if (this.qrScanner) {
      this.qrScanner.hasFlash().then(() => {
        this.qrScanner.toggleFlash().then(() => {
          _debug("isFlashOn", this.qrScanner.isFlashOn())
        })
      })
    }
  }

  render() {
    return (
      <div className="qr-code-scanner-view">
        <TopAction
          icon={"back"}
          iconWhite={true}
          onClick={() => {
            this.onClose()
          }}
          left top/>
        <div className="qr-scanner">
          {
            this.state['ready'] &&
            <div className="shape-qr"/>
          }

          <div className="videobox__inner">
            <video poster={"no-poster"} className="video-qr-scanner" autoPlay playsInline/>
          </div>
        </div>

      </div>
    );
  }
}


class QrCodeScannerView extends React.PureComponent {
  render() {
    const {qrCodeScanner} = this.props;
    if (!qrCodeScanner) {
      return null;
    }
    return (
      <QrCodeScanner qrCodeScanner={qrCodeScanner}/>
    );
  }
}


export default connect(({global}) => {
  return {
    qrCodeScanner: global.qrCodeScanner
  }
})(QrCodeScannerView)
