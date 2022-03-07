import React from 'react'
import 'swiper/swiper-bundle.css';
import ImageBox from "components/ImageBox";
import WeScrollSwiperView from "./WeScrollSwiperView";

class View extends React.Component {
  render() {
    const {items, onClick, ...props} = this.props;
    const rows = []
    items.forEach((item) => rows.push(
      <ImageBox style={{width: `100%`}}
                onClick={() => {
                  onClick && onClick(item)
                }}
                src={item.imgPath}
                alt={item.label}/>)
    )
    return (
      <WeScrollSwiperView rows={rows} {...props} />
    );
  }
}

export default View;
