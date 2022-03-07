import React, {Fragment} from 'react'
import {Icons} from "components/Icons";
import classNames from "classnames"
import {setStoreState} from "components/core/App";
import {getAppBarHeight, getSwiperSubCatsViewHeight, setBodyOverflowHidden} from "shared/functions/common";
import {Swiper, SwiperSlide} from 'swiper/react';

class MarkCatsView extends React.Component {
  constructor(props) {
    super(props);
    this.swiper = null;
  }

  componentWillUnmount() {
    if (this.swiper) {
      this.swiper.destroy()
    }
  }

  shouldComponentUpdate({subCat, cat}, nextState, nextContext) {
    if (cat && cat !== this.props.cat && this.swiper) {
      //this.slideToSubCat(cat.children, subCat, this.swiper)
    }
    return true;
  }

  getSubCatIndex(items, subCat) {
    if (subCat) {
      items.forEach((item, i) => {
        if (item === subCat) {
          return i
        }
      })
    }
    return 0
  }

  slideToSubCat(items, subCat, swiper) {
    swiper.slideTo(this.getSubCatIndex(items, subCat))
  }

  render() {
    const {
      namespace,
      showConditionPanel,
      subCat,
      cat
    } = this.props;
    if (!cat) return null;
    const allClassNames = classNames(
      "action action-left",
      {
        "action-active": !subCat
      }
    )
    return (
      <Fragment>
        <div className={"swiper-sub-cats-view"} style={{
          top: getAppBarHeight(),
          height: getSwiperSubCatsViewHeight()
        }}>
          <div className={allClassNames} onClick={() => {
            setStoreState(namespace, {
              cat: cat.label,
              subCat: null,
            })
            this.swiper.slideTo(0)
          }}>
            <span className={"title"}>全部</span>
          </div>

          <Swiper
            width={64}
            spaceBetween={0}
            initialSlide={this.getSubCatIndex(cat.children, subCat)}
            onSlideChange={() => console.log('slide change')}
            onSwiper={(swiper) => {
              this.swiper = swiper;
            }}>
            {cat.children.map((item, index) => {
              const subCatClassNames = classNames(
                "swiper-slide-main",
                {
                  "action-active": subCat === item
                }
              )
              return (
                <SwiperSlide key={index}>
                  <div className={"swiper-slide-inner"}>
                    <div className={subCatClassNames}
                         onClick={() => {
                           this.swiper.slideTo(index)
                           setStoreState(namespace, {
                             subCat: item
                           })
                         }}>
                      <span className={"title"}>{item}</span>
                    </div>
                  </div>
                </SwiperSlide>
              )
            })}
          </Swiper>

          <div className={"action action-right btn_active"}
               onClick={() => {
                 setStoreState(namespace, {
                   showConditionPanel: !showConditionPanel
                 })
                 setBodyOverflowHidden()
               }}>
            {Icons[showConditionPanel ? "arrowUp" : "arrowDown"]}
          </div>
        </div>
      </Fragment>
    );
  }
}

export default MarkCatsView
