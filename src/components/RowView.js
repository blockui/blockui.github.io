import React from "react"
import ImageBox from "components/ImageBox";
import {Icons} from "./Icons";

class RowView extends React.Component {
  render() {
    const {title, avatar, onSelectRow, onClick, onClose, desc} = this.props;
    return (
      <div className="weui-media-box weui-media-box_appmsg" onClick={() => {
        onClick && onClick()
      }}>
        {
          avatar &&
          <div className="weui-media-box__hd" onClick={() => {
            onSelectRow && onSelectRow()
          }}>
            <ImageBox style={{borderRadius: 8, height: "100%", width: "100%"}} src={avatar}
                      className="weui-media-box__thumb"/>
          </div>
        }
        <div className="weui-media-box__bd">
          <h4 className="weui-media-box__title" onClick={() => {
            onSelectRow && onSelectRow()
          }}>{title}</h4>
          <p className="weui-media-box__desc">
            {desc}
          </p>
        </div>
        {
          onClose &&
          <div onClick={onClose} className={"icon_20 position_absolute"} style={{right: 4, top: 4}}>
            {Icons['close']}
          </div>
        }

      </div>
    )
  }
}

export default RowView
