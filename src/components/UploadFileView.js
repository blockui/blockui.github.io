import React from "react"
import {beforeUploadRawFile, getWeui} from "shared/functions/common";
import WeUploadBox from "shared/weui/WeUploadBox";
import PropTypes from "prop-types";
import BDUtils from "../shared/BD/BDUtils";
import {getCurrentTimeStamp} from "../shared/functions/utils";
import BDApp from "../shared/BD/BDApp";

const {$} = window;

export function getDefaultUploadOptions(props) {
  const accept = props.accept || "*/*"
  const multiple = props.multiple || false
  const capture = props.capture || false
  return {
    accept,
    multiple,
    capture,
  }
}

class UploadFileView extends React.Component {
  getDefaultUploadOptions(props) {
    const accept = props.accept || "*/*"
    const uploadId = props.uploadId || "upload_" + getCurrentTimeStamp()
    const multiple = props.multiple || false
    const capture = props.capture || false
    return {
      uploadId,
      accept,
      multiple,
      capture,
    }
  }

  upload() {
    const {uploadId, accept} = this.getDefaultUploadOptions(this.props)
    const {onChange} = this.props;
    BDUtils.checkUploadPermission(accept)
    const selector = "#" + uploadId
    beforeUploadRawFile({
      selector
    }).then((files) => {
      onChange && onChange(files)
    })
    const fileCat = accept.split("/")[0]
    if (
      !BDApp.isAdrPlatform() &&
      navigator.userAgent.toLowerCase().indexOf("mobile") > -1 && window.location.protocol.indexOf("http") === 0
      && ['audio', "video", "image"].indexOf(fileCat) > -1
    ) {
      const fileName = {
        image: "相册",
        video: "媒体库",
        audio: "媒体库",
      }[fileCat]

      const fileCaptureName = {
        image: "拍照",
        video: "拍摄",
        audio: "录音",
      }[fileCat]

      getWeui().actionSheet([
        {
          label: fileName,
          onClick: () => {
            $(selector).removeAttr("capture").click()
          }
        },
        {
          label: fileCaptureName,
          onClick: () => {
            $(selector).attr("capture", "capture").click()
          }
        }
      ], [], {})
    } else {
      $(selector).click()
    }
  }

  render() {
    const {hide} = this.props;
    const {multiple, capture, accept, uploadId} = this.getDefaultUploadOptions(this.props);
    return (
      <WeUploadBox
        hide={hide || true}
        multiple={multiple}
        capture={capture}
        accept={accept}
        id={uploadId}/>
    )
  }
}

UploadFileView.propTypes = {
  hide: PropTypes.bool,
  accept: PropTypes.string,
  capture: PropTypes.bool,
  multiple: PropTypes.bool,
  onReady: PropTypes.func,
  onChange: PropTypes.func,
  uploadId: PropTypes.string
}

export default UploadFileView
