import React from "react"
import BasePage from "components/core/BasePage"
import {PIC_ARTICLE} from "components/DataImages";

class GalleryPage extends React.Component {
  render() {
    return (
      <BasePage back title={"Gallery"}>

        <div className="weui-gallery display_block">
          <span className="weui-gallery__img" style={{backgroundImage: `url(${PIC_ARTICLE})`}}/>
          <div className="weui-gallery__opr">
            <div className="weui-gallery__del">
              <i className="weui-icon-delete weui-icon_gallery-delete"/>
            </div>
          </div>
        </div>
      </BasePage>
    )
  }
}

export default GalleryPage
