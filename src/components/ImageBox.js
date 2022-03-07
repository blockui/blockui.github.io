import React from "react"
import {connect} from "react-redux"
import cls from "classnames";
import PropTypes from "prop-types"
import {getImagePDb} from "shared/functions/pdb";
import {
  blobToObjectUrl,
  checkPdbMedia,
  getMediaSrcFromPdb,
  getMediaTypeFromPdbId,
  saveMediaToPdb
} from "shared/functions/common";
import {setStoreState} from "components/core/App";
import {getMediaSrcFromServer} from "shared/functions/upload";
import {Icons} from "./Icons";
import WeIcon from "../shared/weui/WeIcon";
import WeLoading from "../shared/weui/WeLoading";

class ImageBox extends React.Component {
  constructor(props) {
    super(props);
    this.retry = 0;
    this.maxRetry = 1
    this.db = getImagePDb()
    this.state = {
      errorLoadImage: false,
    }
    this.defaultImage = props.defaultImage ? props.defaultImage : Icons['GrImage']
  }

  shouldComponentUpdate({src}, nextState, nextContext) {
    if (src !== this.props.src && src) {
      this.loadImage(src)
    }
    return true;
  }

  loadImage(src) {
    if (!src) {
      this.setState({
        errorLoadImage: true
      })
    }else{
      this.setState({
        errorLoadImage: false
      })
    }
    // _debug("loadImage", src)
    if (!window.__pics) window.__pics = {}
    if (checkPdbMedia(src)) {
      const _id = src;
      if (!window.__pics[_id]) {
        window.__pics[_id] = {url: "", loaded: false}
        getMediaSrcFromPdb(this.db, _id, (imgSrc) => {
          this.finishLoadImg(_id, imgSrc)
        }, () => {
          getMediaSrcFromServer(_id, (blob) => {
            const type = getMediaTypeFromPdbId(_id);
            const src = blobToObjectUrl(blob)
            this.finishLoadImg(_id, src)
            saveMediaToPdb(this.db, _id, blob, type).catch(console.error)
          }, (error) => {
            window.__pics[_id] = null
            console.error(error)
            this.setState({
              errorLoadImage: true
            })
          })
        })
      }
    } else {
      this.setState({imgSrc: src})
    }
  }

  finishLoadImg(_id, imgSrc) {
    window.__pics[_id] = {
      url: imgSrc,
      loaded: true
    }
    const {counter} = this.props;
    setStoreState("img", {
      counter: (counter ? counter : 0) + 1
    })
  }

  componentDidMount() {
    const {src} = this.props;
    this.loadImage(src)
  }

  render() {
    const {className, showErrorWarn, showLoading,useImage, imgStyle, style, onClick, src, counter} = this.props;
    let imgSrc;
    if (checkPdbMedia(src)) {
      if (!window.__pics) {
        window.__pics = {}
      }
      if (window.__pics[src]) {
        imgSrc = window.__pics[src].url
      }
    } else {
      imgSrc = src;
    }
    const classNames = cls(
      className,
      {
        "image-box": true
      }
    )
    if (this.state.errorLoadImage) {
      return (
        <div style={style} onClick={() => {
          this.loadImage(src)
        }} className={classNames}>
          {
            showErrorWarn &&
            <WeIcon warn/>
          }
          {this.defaultImage}
        </div>
      )
    }
    if (!this.state.errorLoadImage && !imgSrc && showLoading) {
      return (
        <div style={style} className={classNames}>
          <WeLoading primary brand/>
          {this.defaultImage}
        </div>
      )
    }
    if (!this.state.errorLoadImage && !imgSrc) {
      return (
        <div style={style} className={classNames}>
          {this.defaultImage}
        </div>
      )
    }
    if (!(imgStyle || useImage)) {
      return (
        <div onClick={onClick && onClick.bind(this, imgSrc)} key={counter + imgSrc} className={classNames}
             style={{...style, backgroundImage: imgSrc ? `url(${imgSrc})` : undefined}}>
          {!imgSrc && this.defaultIcon}
        </div>
      )
    } else {
      return (
        <div onClick={onClick && onClick.bind(this, imgSrc)} key={counter + imgSrc} ref={this.dom}
             className={classNames} style={style}>
          {
            imgSrc ?
              <img draggable={false} style={imgStyle} src={imgSrc} alt=""/> :
              this.defaultIcon
          }
        </div>
      )
    }

  }
}

ImageBox.propTypes = {
  showErrorWarn:PropTypes.bool,
  showLoading:PropTypes.bool,
  defaultImage: PropTypes.any,
  className: PropTypes.string,
  src: PropTypes.string,
  useImage: PropTypes.bool,
  imgStyle: PropTypes.object,
  style: PropTypes.object,
  onClick: PropTypes.func,
  counter: PropTypes.number
}

export default connect(({img}) => {
  return {counter: parseInt(img.counter)}
})(ImageBox);
