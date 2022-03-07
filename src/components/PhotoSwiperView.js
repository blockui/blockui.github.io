import React, {Component} from "react"
import "photoswipe/dist/photoswipe.css"
import "photoswipe/dist/default-skin/default-skin.css"
import PhotoSwipe from 'photoswipe/dist/photoswipe'
import PhotoSwipeUI_Default from 'photoswipe/dist/photoswipe-ui-default'

class PhotoSwiperView extends Component {
  constructor(props) {
    super(props);
    this.dom = React.createRef()
  }

  componentDidMount() {
    const {photoSwiperHandler} = this.props
    const pswpElement = this.dom.current;
    const items = photoSwiperHandler.items;
    const options = {
      history: false,
      showAnimationDuration: 0,
      hideAnimationDuration: 0,
      index: photoSwiperHandler.index
    };
    const gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);
    gallery.listen('destroy', () => {
      this.props.onDestroy && this.props.onDestroy()
    });
    gallery.init();
  }

  render() {
    return (
      <div className="pswp" ref={this.dom} tabIndex="-1" role="dialog" aria-hidden="true">
        <div className="pswp__bg"/>
        <div className="pswp__scroll-wrap">
          <div className="pswp__container">
            <div className="pswp__item">1</div>
            <div className="pswp__item">2</div>
            <div className="pswp__item">3</div>
          </div>
          <div className="pswp__ui pswp__ui--hidden">
            <div className="pswp__top-bar">
              <div className="pswp__counter"></div>
              <button className="pswp__button pswp__button--close" title="Close (Esc)"></button>
              {/*<button className="pswp__button pswp__button--share" title="Share"></button>*/}
              {/*<button className="pswp__button pswp__button--fs" title="Toggle fullscreen"></button>*/}
              <button className="pswp__button pswp__button--zoom" title="Zoom in/out"/>
              <div className="pswp__preloader">
                <div className="pswp__preloader__icn">
                  <div className="pswp__preloader__cut">
                    <div className="pswp__preloader__donut"/>
                  </div>
                </div>
              </div>
            </div>
            <div className="pswp__share-modal pswp__share-modal--hidden pswp__single-tap">
              <div className="pswp__share-tooltip"/>
            </div>
            {/*<button className="pswp__button pswp__button--arrow--left" title="Previous (arrow left)">*/}
            {/*</button>*/}
            {/*<button className="pswp__button pswp__button--arrow--right" title="Next (arrow right)">*/}
            {/*</button>*/}
            <div className="pswp__caption">
              <div className="pswp__caption__center"/>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

PhotoSwiperView.propTypes = {}

export default PhotoSwiperView
