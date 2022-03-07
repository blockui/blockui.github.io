import React from "react"
import PropTypes from 'prop-types'
import {
  blobToObjectUrl,
  checkPdbMedia,
  getMediaSrcFromPdb,
  getMediaTypeFromPdbId,
  saveMediaToPdb,
  showToastText
} from "shared/functions/common";
import {getAudiosPDb} from "shared/functions/pdb";
import IApp from 'shared/BD/IApp'
import {getMediaSrcFromServer} from "shared/functions/upload";
import cls from "classnames";
import WeIcon from "../shared/weui/WeIcon";
import WeLoading from "../shared/weui/WeLoading";

class AudioPlayer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      audioPath: null,
      errorLoading: false,
    }
    this.db = getAudiosPDb()
    this.retry = 0;
    this.maxRetry = 1
  }

  shouldComponentUpdate(nextProps, nextState, nextContext) {
    if (nextProps.src !== this.props.src) {
      this.loadAudio()
    }
    return true;
  }

  componentDidMount() {
    this.loadAudio()
  }

  finishLoadMedia({audioPath}) {
    this.setState({
      audioPath
    })
  }

  loadAudio() {
    let {src} = this.props;
    if (src) {
      if (src.indexOf("/storage") === 0 && IApp.checkIApp()) {
        IApp.call("getFileBase64Content", {path: src}, (src) => {
          this.finishLoadMedia({audioPath: `data:audio/aac;base64,${src}`})
        })
      } else {
        if (checkPdbMedia(src)) {
          this.setState({
            errorLoading: false
          })
          const _id = src;
          getMediaSrcFromPdb(this.db, _id, (audioPath) => {
            this.finishLoadMedia({_id, audioPath})
          }, () => {
            getMediaSrcFromServer(_id, (blob) => {
              const type = getMediaTypeFromPdbId(_id);
              const src = blobToObjectUrl(blob)
              this.finishLoadMedia({_id, audioPath: src})
              saveMediaToPdb(this.db, _id, blob, type).catch(console.error)
            }, () => {
              this.setState({
                errorLoading: true
              })
            })
          })
        } else {
          this.finishLoadMedia({audioPath: src})
        }
      }
    } else {
      showToastText("not found audio")
    }
  }

  render() {
    let {width, showTimeRemaining} = this.props;
    const {audioPath, errorLoading} = this.state;
    width = width || document.body.clientWidth * 0.6
    const classNames = cls("audio-speaker audio-speaker-native", {
      "time-remaining-display-hide": !showTimeRemaining
    })
    return (
      <div className={classNames} style={{width}}>
        {
          audioPath &&
          <audio
            onContextMenu={() => {
              return false
            }}
            controlsList="nodownload"
            controls
            src={audioPath}/>
        }
        {
          (!audioPath && !errorLoading) &&
          <div className={"audio-loading"}>
            <WeLoading primary brand/>
          </div>
        }
        {
          errorLoading &&
          <div className={"audio-loading"}>
            <WeIcon onClick={() => this.loadAudio} warn/>
          </div>
        }
      </div>
    )
  }
}

AudioPlayer.propTypes = {
  src: PropTypes.string,
  showTimeRemaining: PropTypes.bool
}

export default AudioPlayer
