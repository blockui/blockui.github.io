import React, {Fragment} from "react"
import weui from "shared/weui-js";
import {getAudiosPDb, getImagePDb, getVideosPDb} from "shared/functions/pdb";
import {

  beforeUploadFile,
  clearBodyOverflowHidden,
  getConstant,
  getUploadOptions,
  globalLoading,
  globalLoadingHide,
  setBodyOverflowHidden,
  showToastText
} from "shared/functions/common";
import WeUploadBox from "shared/weui/WeUploadBox";
import UploadViewItem from "./UploadViewItem"
import {onUploadFile} from "shared/functions/upload";
import {onChangeStatusBarBgColor, onResetStatusBarBgColor} from 'shared/BD/IApp';
import PropTypes from "prop-types";
import {getDefaultUploadOptions} from "./UploadFileView";
import BDUtils from "../shared/BD/BDUtils";
import BDAuth from "../shared/BD/BDAuth";

const {$} = window;

class UploadView extends React.Component {
  constructor(props) {
    super(props);
    const constant = getConstant()
    const {maxUploadLengthM, maxUploadFile, allowTypes} = constant.common.upload
    this.maxUploadLengthM = maxUploadLengthM;
    this.maxUploadFile = maxUploadFile;
    this.allowTypes = allowTypes;
    this.state = {
      ...getDefaultUploadOptions(props),
      accept:"image/*",
      uploadId: props.uploadId || undefined,
    }
    this.galleryRef = React.createRef()
    this.galleryImgRef = React.createRef()
  }

  getUploadId() {
    return `upload_media_${+(new Date())}`;
  }

  shouldComponentUpdate(nextProps, nextState, nextContext) {
    if (nextProps.uploadId !== this.props.uploadId) {
      this.setState({
        ...getDefaultUploadOptions(nextProps),
        accept:"image/*",
      }, () => {
        this.resetUploader()
      })
      return false
    }
    return true;
  }

  resetUploader() {
    const {accept} = this.state;
    BDUtils.checkUploadPermission(accept)
    this.setState({
      uploadId: this.getUploadId()
    }, () => {
      this.setUploader()
    })
  }

  setUploader() {
    let db
    switch (this.state.accept.split("/")[0]) {
      case "image":
        db = getImagePDb()
        break
      case "video":
        db = getVideosPDb()
        break
      case "audio":
      default:
        db = getAudiosPDb()
        break
    }
    const selector = "#" + this.state.uploadId
    this.props.onReady && this.props.onReady($("#" + this.state.uploadId))
    const options = getUploadOptions(this.state.accept)
    beforeUploadFile({
      selector,
      db,
      options: {
        ...options,
        fileUploadedNum: this.getFileUploadedNum.bind(this),
      }
    }).then(({doc_id, file, thumb_doc_id}) => {
      if (file.type.split("/")[0] !== this.state.accept.split("/")[0]) {
        globalLoadingHide()
        return showToastText("不支持上传类型")
      }
      let synced = false
      if (!this.props.ignoreUploadServer) {
        globalLoading("正在上传...")
        onUploadFile({
          compress: true,
          params: {
            doc_id,
            user_id: BDAuth.getGlobalAuthUserId()
          },
          files: [file]
        }).then(() => {
          synced = true;
        }).catch((err) => {
          // showToastText("上传失败", {debug: err['message']})
          console.error(err)
        }).finally(() => {
          this.finishUpload(doc_id, thumb_doc_id, synced)
        })
      } else {
        this.finishUpload(doc_id, thumb_doc_id, synced)
      }
    })
  }

  finishUpload(doc_id, thumb_doc_id, synced) {
    let _id = doc_id;
    if (thumb_doc_id) {
      _id = `${doc_id}|${thumb_doc_id}`
    }
    globalLoadingHide()
    // _debugToast("upload ok")
    const {files, onChange} = this.props;
    const res = [...files || [],
      {_id, synced}
    ]
    onChange && onChange(JSON.stringify(res))
    this.resetUploader()
  }

  componentDidMount() {
    this.resetUploader()
    if (this.props.autoOpen) {
      setTimeout(() => {
        $("#" + this.state.uploadId).click()
      }, 200)
    }
  }

  getFileUploadedNum() {
    const {files} = this.props;
    // console.log("getFileUploadedNum", pics)
    return files ? files.length : 0;
  }

  onImageClick(selectFileIndex, e) {
    this.setState({
      selectFileIndex
    })
    $(this.galleryImgRef.current).attr(
      "style",
      $(e.target)[0].getAttribute("style")
    );
    onChangeStatusBarBgColor();
    setBodyOverflowHidden()
    $(this.galleryRef.current).fadeIn(100);
  }

  onGalleryImgClick() {
    onResetStatusBarBgColor();
    clearBodyOverflowHidden();
    $(this.galleryRef.current).fadeOut(100);
  }

  render() {
    const {files, title, hide} = this.props;
    return (
      <Fragment>
        <div
          style={{display: hide ? "none" : undefined}} className="weui-gallery gallery"
          ref={this.galleryRef}>
          <span ref={this.galleryImgRef} className="weui-gallery__img galleryImg"
                onClick={this.onGalleryImgClick.bind(this)}/>
            <div className="weui-gallery__opr">
                <span className="weui-gallery__del" onClick={(e) => {
                  weui.confirm("确定要删除么? ", () => {
                    const {selectFileIndex} = this.state;
                    const {files, onChange} = this.props;
                    onChange && onChange(JSON.stringify(files.filter((file, i) => i !== selectFileIndex)))
                    clearBodyOverflowHidden()
                    $(".gallery").fadeOut(100);
                  })
                }}>
                    <i className="weui-icon-delete weui-icon_gallery-delete"/>
                </span>
          </div>
        </div>
        <div className="weui-cells weui-cells_form mt_0" style={{display: hide ? "none" : undefined}}>
          <div className="weui-cell  weui-cell_uploader">
            <div className="weui-cell__bd">
              <div className="weui-uploader">
                <div className="weui-uploader__hd">
                  <p className="weui-uploader__title font_16 color_2">
                    {title || ""}
                  </p>
                  <div className="weui-uploader__info">
                    {files ? files.length : 0}/{this.maxUploadFile}
                  </div>
                </div>
                <div className="weui-uploader__bd">
                  <ul className="weui-uploader__files uploaderFiles">
                    {
                      files && files.map((file, i) => {
                        return (
                          <UploadViewItem
                            onClick={this.onImageClick.bind(this, i)}
                            key={file._id + i}
                            file={file}/>
                        )
                      })
                    }
                  </ul>
                  <WeUploadBox
                    hide={files && files.length >= this.maxUploadFile}
                    multiple={false}
                    capture={this.state.capture}
                    accept={this.state.accept}
                    id={this.state.uploadId}/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Fragment>
    )
  }
}

UploadView.propTypes = {
  accept: PropTypes.string,
  autoOpen: PropTypes.bool,
  onReady: PropTypes.func,
  onChange: PropTypes.func,
  capture: PropTypes.bool,
  uploadId: PropTypes.string
}

export default UploadView
