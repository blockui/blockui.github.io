import React, {useRef} from 'react';
import {connect} from "react-redux";
import Swiper from 'react-id-swiper';
import 'swiper/swiper-bundle.css';

export const onShowRouter = (target) => {
  return weui.topTips("研发中...");
  // const {lat,lng} = target;
  // const start = window.current_marker.getLatLng()
  // window.current_dispatch(fetchRouter({
  //     "from":`${start['lat']},${start['lng']}`,
  //     to:`${lat},${lng}`},({code,msg,body})=>{
  //
  //     window.current_polyline && window.current_polyline.remove()
  //     if(code !== 200){
  //         weui.topTips(msg)
  //     }else{
  //         window.current_polyline = window.L.polyline(body.router, {color: 'red'})
  //             .addTo(window.current_map);
  //     }
  // }))
}

export default connect(({map, user}) => {
  return {
    me: user.me,
    locations: map.locations,
    searchBoxActive: map.searchBoxActive
  }
})(({locations, showCatListLayer, dispatch}) => {
  if (locations.length === 0 || showCatListLayer) {
    window.set_layer_control_position(0)
    window.current_polyline && window.current_polyline.remove()
    return null
  } else {
    window.set_layer_control_position(window.globalObject.constant.homeBottomCardHeight)
  }
  const catRef = useRef(null);
  //catRef.current.swiper.slideTo(4)

  const params = {
    slidesPerView: "auto",
    spaceBetween: 0,
    centeredSlides: true,
    on: {
      slideChange: (slider) => {
        const marker = window.markers[slider.activeIndex];
        const {title, lat, lng} = locations[slider.activeIndex]
        dispatch({
          type: "map/setState",
          payload: {
            searchInputValue: title
          }
        })

        window.markers.map(marker => {
          marker.closeTooltip()
        })
        window.flyToMap({lat, lng})
        marker.openTooltip()
      },
      init: () => {
        window.current_bottom_card_list = catRef.current.swiper
      }
    }
  }

  const clientHeight = window.document_body_clientHeight
  const height = window.globalObject.constant.homeBottomCardHeight;
  return (
    <MainBox showClose={false} hideTop
             id={"bottom"}
             top={clientHeight - height} style={{backgroundColor: "transparent"}}>
      <div id={"cardList"}>
        <Swiper {...params} ref={catRef}>
          {
            locations.map((item, i) => {
              return (
                <div key={i} style={{width: locations.length === 1 ? "98%" : undefined}}>
                  <div className="cardItem" onClick={() => {
                    window.markers[i].openTooltip()
                    dispatch({
                      type: "map/setState",
                      payload: {
                        currentLocationInfo: item,
                        isChangeLocation: false,
                      }
                    })
                  }}>
                    <div className="info">
                      <h3>{item.title}</h3>
                      <p className="cat">
                        {item.cat}
                      </p>
                    </div>
                    <div className="action display_none">
                      <div className="item" onClick={() => onShowRouter(item)}>
                        <div className={"span"}>路线</div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })
          }
        </Swiper>
      </div>
    </MainBox>
  )
})
