import React from 'react'
import {Swiper, SwiperSlide} from 'swiper/react';
import 'swiper/swiper-bundle.css';
import StorageHelper from "shared/BD/helper/StorageHelper";
import {getAppMaxWidth} from "../shared/functions/common";

class SwiperMapMarksView extends React.Component {
  constructor(props) {
    super(props);
    this.swiper = null;
    this.state = {
      showSwiper: false
    }
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({
        showSwiper: true
      })
    }, 100)
  }

  shouldComponentUpdate({activeIndex}, nextState, nextContext) {
    if (activeIndex !== this.props.activeIndex) {
      this.slideTo(activeIndex)
    }
    return true
  }

  componentWillUnmount() {
    if (this.swiper) {
      this.swiper.destroy()
    }
  }

  slideTo(index) {
    this.swiper && this.swiper.slideTo(index)
  }

  render() {
    const {
      clientWidth,
      onChange,
      items,
      activeIndex,
      height,
      onSwiperReady
    } = this.props;
    const slideWidth = clientWidth > getAppMaxWidth() ? getAppMaxWidth() - 30 : clientWidth - 30
    const height_ = height || 80
    return (
      <div className={"swiper-marks-view"} style={{height: height_}}>
        <Swiper slidesPerView={1}
                spaceBetween={0}
                mousewheel={true}
                initialSlide={activeIndex}
                width={slideWidth}
                centeredSlides={true}
                onSlideChange={({activeIndex}) => {
                  onChange && onChange(activeIndex)
                }}
                onSwiper={(swiper) => {
                  onSwiperReady && onSwiperReady(swiper)
                  this.swiper = swiper;
                }}>
          {items.map((row, index) => (
            <SwiperSlide key={index}>
              <div className={"swiper-slide-inner"}>
                {
                  ((activeIndex || 0) + 2 > index && (activeIndex || 0) - 2 < index) &&
                  <div className="swiper-slide-main" style={{height: height_ - 10}}>
                    {row}
                  </div>
                }
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    );
  }
}

export default StorageHelper.reduxConnect(({global}) => {
  return {
    clientWidth: global.clientWidth
  }
}, SwiperMapMarksView);
