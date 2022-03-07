import React, {Component} from "react";
import {connect} from 'react-redux'
import WeSwiperView from "shared/weui/WeSwiperView";
import config from 'config'

class View extends Component {
  render() {
    const {items, isCurrentPage, showBanner} = this.props;
    if (!showBanner) return null;
    const {HomeSwiperBannerHeight} = config.ui
    return (
      <div className={"home-banners"} style={{height: HomeSwiperBannerHeight}}>
        <WeSwiperView
          options={{
            autoplay: {
              delay: 2000
            },
            loop: true,
            centeredSlides: true
          }}
          style={{height: HomeSwiperBannerHeight}}
          stopAutoPlay={!isCurrentPage}
          items={items}/>
      </div>
    );
  }
}

export default connect(({constant}) => {
  return {
    showBanner: constant.index.showBanner,
    items: constant.index.banners
  }
})(View);
