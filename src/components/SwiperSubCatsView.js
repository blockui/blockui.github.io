import React, {Fragment} from 'react'
import {Swiper, SwiperSlide} from 'swiper/react';
import {locationHashReplaceCatSubCat} from "shared/functions/cat";
import ChipItem from "components/ChipItem";

class SwiperSubCatsView extends React.Component {
  constructor(props) {
    super(props);
    this.swiper = null;
    const {clientWidth} = document.body
    this.clientWidth = clientWidth;

  }

  componentWillUnmount() {
    if (this.swiper) {
      this.swiper.destroy()
    }
  }

  shouldComponentUpdate({subCat, cats, cat}, nextState, nextContext) {
    if (cat && subCat !== this.props.subCat && this.swiper) {
      this.slideToSubCat(cats, cat, subCat, this.swiper)
    }
    return true;
  }


  getSubCatIndex(items, subCat) {
    let index = 0;
    if (subCat) {
      items.forEach((item, i) => {
        if (item === subCat) {
          console.log("===>>shouldComponentUpdate", i)
          index = i
        }
      })
    }
    return index
  }

  slideToSubCat(cats, cat, subCat, swiper) {
    cats.forEach((row) => {
      if (row.label === cat) {
        row.children.forEach((item, i) => {
          if (item === subCat) {
            if (i > 6) {
              swiper.slideTo(i - 2 >= 0 ? i - 2 : 0)
            }
          }
        })
      }
    })
  }

  render() {
    const {
      cats, cat, subCat, namespace
    } = this.props;

    let subCats = []
    cats.forEach((row) => {
      if (row.label === cat) {
        subCats = row.children;
      }
    })

    return (
      <Fragment>
        <div className={"swiper-sub-cats-view"}>
          <Swiper
            width={64}
            spaceBetween={0}
            initialSlide={0}
            onSlideChange={() => console.log('slide change')}
            onSwiper={(swiper) => {
              this.swiper = swiper;
              this.slideToSubCat(cats, cat, subCat, swiper)
            }}>
            {
              subCats.map((item, index) => {
                // const subCatClassNames = classNames(
                //     "swiper-slide-main",
                //     {
                //         "action-active": subCat === item
                //     }
                // )
                return (
                  <SwiperSlide key={index}>
                    <div className={"swiper-slide-inner"}>
                      <ChipItem
                        hideDel={true}
                        color={item === subCat ? "primary" : undefined}
                        key={item}
                        onClick={() => {
                          locationHashReplaceCatSubCat(namespace, {
                            cat,
                            subCat: item
                          })
                        }}
                        item={{subCat: item}}
                        namespace={namespace}/>
                    </div>
                  </SwiperSlide>
                )
              })}
          </Swiper>

        </div>
      </Fragment>
    );
  }
}

export default SwiperSubCatsView
