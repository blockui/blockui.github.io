import React from 'react'
import SwiperCore, {Autoplay, Mousewheel, Navigation, Pagination} from 'swiper';
import {Swiper, SwiperSlide} from 'swiper/react';
import 'swiper/swiper-bundle.css';

SwiperCore.use([Navigation, Mousewheel, Autoplay, Pagination]);

class View extends React.Component {
  constructor(props) {
    super(props);
    this.swiper = null;
    this.dom = React.createRef()
  }

  componentWillUnmount() {
    if (this.swiper) {
      this.swiper.destroy()
    }
  }

  shouldComponentUpdate(nextProps, nextState, nextContext) {
    const {options} = this.props;
    if (options && options.autoplay) {
      if (nextProps.stopAutoPlay) {
        this.swiper.autoplay.stop()
      } else {
        this.swiper.autoplay.start()
      }
    }
    return true;
  }

  render() {
    const {onReady, options, className, onChange, style, sliderStyle, rows} = this.props;
    return (
      <Swiper
        ref={this.dom}
        className={className}
        onSlideChange={({activeIndex}) => {
          onChange && onChange(activeIndex)
        }}
        onSwiper={(swiper) => {
          this.swiper = swiper;
          onReady && onReady(swiper)
        }}
        mousewheel={true}
        style={style}
        {...options}>
        {rows.map((row, index) => (
          <SwiperSlide key={index} style={{width: "100%", ...sliderStyle}}>
            {row}
          </SwiperSlide>
        ))}
      </Swiper>
    );
  }
}

export default View;


