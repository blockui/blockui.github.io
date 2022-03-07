import React from "react"
import PropTypes from 'prop-types'
import cls from 'classnames'
import {
  _debug,
  blobToObjectUrl,
  checkPdbMedia,
  getMediaSrcFromPdb,
  getMediaTypeFromPdbId,
  globalLoading,
  globalLoadingHide,
  saveMediaToPdb
} from "shared/functions/common";
import {getImagePDb, getVideosPDb} from "shared/functions/pdb";
import {getMediaSrcFromServer} from "shared/functions/upload";
import {Icons} from "./Icons";
import ImageBox from "./ImageBox";
import WeLoading from "../shared/weui/WeLoading";


class VideoView extends React.Component {
  constructor(props) {
    super(props);
    this.db = getVideosPDb()
    this.video = React.createRef()
    this.state = {
      videoPath: "",
      objectFit: "contain",
      poster: null,
      posterLoadError:false,
      playing: false,
      pause: false
    }

    this.retry = 0;
    this.maxRetry = 2
    this.timeSpace = 500
    this.events = [
      "abort", "canplay", "canplaythrough", "durationchange",
      "emptied", "ended", "error", "loadeddata", "loadedmetadata",
      "loadstart", "pause", "play", "playing", "progress", "ratechange",
      "seeked", "seeking", "stalled", "suspend",
      "timeupdate", "volumechange", "waiting"
    ];
  }

  videoEvent(e) {
    const {type, target} = e;
    const video = target
    switch (type) {
      case "durationchange":
        console.log("event type=>", type, video.duration)
        break;
      case "seeked":
        console.log("event type=>", type, video.currentTime)
        break
      case "timeupdate":
        break
      case "loadedmetadata":
        console.log("event type=>", type, e)
        break
      case "volumechange":
        console.log("event type=>", type, "muted=>", video.muted, "volume=>", video.volume)
        break
      case "end":
        this.setState({
          pause: true,
          playing: false
        })
        break
      case "pause":
        this.setState({
          pause: true,
          playing: false
        })
        break
      case "playing":
        setTimeout(() => {
          this.setState({
            playing: true,
            pause: false,
          })
        }, 1000)
        break
      default:
        console.log("event type=>", type)
        break
    }
  }

  componentWillUnmount() {
    this.setState = () => {
    }
  }

  shouldComponentUpdate(nextProps, nextState, nextContext) {
    if (nextProps.src !== this.props.src) {
      this.setState({
        videoPath: null,
        poster: null
      }, () => {
        this.init()
      })
      return false;
    }
    return true;
  }

  componentDidMount() {
    this.init()
  }

  init() {
    const {src, autoPlay} = this.props;
    if (autoPlay) {
      this.loadVideo(src)
    } else {
      this.loadPoster(src)
    }
  }

  finishLoadMediaPoster({src}) {
    globalLoadingHide()
    this.setState({
      poster: src
    })
    if (this.props.autoPlay) {
      this.loadVideo(src)
    }
  }

  loadPoster(src) {
    if (src.indexOf("|") === -1) {
      this.loadVideo(src)
      return;
    }
    if (this.state.poster) {
      return;
    }
    const db = getImagePDb()
    const _id = src.split("|")[1]
    this.setState({
      posterLoadError:false
    })
    getMediaSrcFromPdb(db, _id, (src) => {
      this.finishLoadMediaPoster({src})
    }, () => {
      //console.log("getMediaSrcFromPdb err", _id,e)
      getMediaSrcFromServer(_id, (blob) => {
        const type = getMediaTypeFromPdbId(_id);
        const src = blobToObjectUrl(blob)
        this.finishLoadMediaPoster({src})
        saveMediaToPdb(db, _id, blob, type).catch(console.error)
      }, () => {
        globalLoadingHide()
        _debug("video view download error:", _id)
          this.setState({
            posterLoadError:true
          })
      })
    })

  }

  getVideoUrl(src) {
    if (src.indexOf("|") > 0) {
      return src.split("|")[0]
    } else {
      return src;
    }
  }

  loadVideo(src) {
    _debug("load video", src)
    if (src.indexOf("http") === 0) {
      this.finishLoadVideo({src})
    } else if (checkPdbMedia(src)) {
      const _id = this.getVideoUrl(src)
      globalLoading()
      getMediaSrcFromPdb(this.db, _id, (src) => {
        this.finishLoadVideo({_id, src})
      }, () => {
        getMediaSrcFromServer(_id, (blob) => {
          const type = _id.split("_").reverse()[0];
          const src = blobToObjectUrl(blob)
          this.finishLoadVideo({_id, src})
          saveMediaToPdb(this.db, _id, blob, type).catch(console.error)
        }, (error) => {
          console.error(error)
          globalLoadingHide()
          setTimeout(() => {
            if (this.retry < this.maxRetry) {
              _debug("retry", src, this.retry)
              this.retry += 1
              this.loadVideo(src)
            }
          }, this.timeSpace * (this.retry + 1))
        })
      })
    } else {
      this.finishLoadVideo({src})
    }
  }

  finishLoadVideo({src}) {
    globalLoadingHide()
    this.setState({
      videoPath: src
    }, () => {
      if (this.props.autoPlay || this.playClicked) {
        const dom = this.video.current;
        if (dom && !this.eventInited) {
          this.eventInited = true;
          this.events.forEach((item) => {
            dom.addEventListener(item, this.videoEvent.bind(this), false);
          })
        }
        this.onPlay()
      }
    })
  }

  onPlay() {
    if (this.state.videoPath) {
      const video = this.video.current
      if (video.paused) {
        this.setState({
          playing: true
        }, () => {
          video.play()
        })
      } else {
        this.setState({
          playing: false
        }, () => {
          video.pause()
        })
      }
    } else {
      this.playClicked = true
      this.loadVideo(this.getVideoUrl(this.props.src))
    }
  }

  render() {
    const {onClick, className, controls,src, hidePoster, width, height, autoPlay} = this.props;
    const {objectFit, poster, videoPath} = this.state;
    if (autoPlay) {
      if (!videoPath) return null;
    } else {
      if(this.state.posterLoadError){
        return (
          <ImageBox onClick={()=>this.loadPoster(src)} showLoading showErrorWarn defaultImage={Icons['GrVideo']}/>
        )
      }
      if(!poster){
        return (
          <WeLoading primary brand/>
        )
      }
    }
    const props = {
      style: {
        objectFit
      },
      onClick: (e) => {
        if (onClick) {
          onClick(e)
        } else {
          this.onPlay()
        }
      },
      poster: "no-poster",
      preload: "metadata",
      playsInline: "playsInline",
      className: cls(className, {
        "video-box": true
      })
    }

    if (videoPath && videoPath.length > 0) {
      props['src'] = videoPath
    }
    if (controls) {
      props['controls'] = "controls"
    }
    if (autoPlay) {
      props['autoPlay'] = "autoPlay"
    }
    if (poster) {
      props['poster'] = poster
    }
    return (
      <div className={"video-view"} style={{width, height}}>
        <video controlsList="nodownload" ref={this.video} {...props}/>
        {
          (!this.state.playing && !hidePoster) &&
          <div className={"poster"} onClick={(e) => {
            props.onClick(e);
          }}>
            <div className={"play-icon"}>
              {Icons['PlayCircleOutline']}
            </div>
          </div>
        }
      </div>
    )
  }
}


VideoView.propTypes = {
  onClick: PropTypes.func,
  autoPlay: PropTypes.bool,
  width: PropTypes.any,
  height: PropTypes.any,
  poster: PropTypes.string,
  src: PropTypes.string,
  controls: PropTypes.bool,
  hidePoster: PropTypes.bool
}

export default VideoView
