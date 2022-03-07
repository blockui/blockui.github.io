import {clearBodyOverflowHidden, disableHistoryBackAction, globalLoadingHide} from "../functions/common";
import React from "react";
import {Icons} from "components/Icons";
import {onResetStatusBarBgColor} from "shared/BD/IApp";
import {setStoreState} from "../../components/core/App";
import VideoView from "../../components/VideoView";

const {$} = window;

const WeVideoGallery = ({showVideoPreview, onClose, closeIcon}) => {
  if (!showVideoPreview) return null
  return (
    <div className="weui-gallery gallery" style={{display: "block"}}>
      <div className="page-top">
        {
          closeIcon &&
          <div className="action-left color_w" onClick={() => {
            globalLoadingHide()
            onResetStatusBarBgColor();
            clearBodyOverflowHidden();
            $(".weui-gallery").fadeOut(100);
            disableHistoryBackAction(false)
            if (showVideoPreview) {
              setStoreState("global", {
                showVideoPreview: false
              })
            } else {
              onClose && onClose()
            }
          }}>{Icons[closeIcon || 'back']}</div>
        }
      </div>
      <VideoView hidePoster={true} controls={true} autoPlay src={showVideoPreview}/>
    </div>
  )
}
export default WeVideoGallery
