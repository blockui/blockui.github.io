import {clearBodyOverflowHidden, disableHistoryBackAction} from "../functions/common";
import React from "react";
import {Icons} from "components/Icons";
import weui from "../weui-js";
import {onResetStatusBarBgColor} from "shared/BD/IApp";
import {setStoreState} from "../../components/core/App";

const {$} = window;

const WeGallery = ({onDelete, showImagePreview, onClose, closeIcon}) => {
  const style = {}
  const styleGallery = {}
  if (showImagePreview) {
    style["backgroundImage"] = `url('${showImagePreview}')`
    styleGallery['display'] = "block";
  }
  return (
    <div className="weui-gallery gallery" style={styleGallery}>
      <div className="page-top">
        {
          closeIcon &&
          <div className="action-left color_w" onClick={() => {
            $(".galleryImg").attr("style", "");
            onResetStatusBarBgColor();
            clearBodyOverflowHidden();
            $(".weui-gallery").fadeOut(100);
            disableHistoryBackAction(false)
            if (showImagePreview) {
              setStoreState("global", {
                showImagePreview: false
              })
            } else {
              onClose && onClose()
            }
          }}>{Icons[closeIcon || 'back']}</div>
        }
      </div>
      <span className="weui-gallery__img galleryImg" style={style}/>
      <div className="weui-gallery__opr">
        {
          onDelete &&
          <span className="weui-gallery__del"
                onClick={(e) => {
                  weui.confirm("delete ? ", () => {
                    onDelete();
                    clearBodyOverflowHidden()
                    $(".gallery").fadeOut(100);
                  })
                }}>
                        <i className="weui-icon-delete weui-icon_gallery-delete"/>
                    </span>
        }
      </div>
    </div>
  )
}
export default WeGallery
