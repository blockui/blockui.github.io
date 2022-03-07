import React from "react"
import BasePage from "components/core/BasePage";

const {$} = window;

class SliderPage extends React.Component {
  componentDidMount() {
    var $sliderTrack = $('#sliderTrack'),
      $sliderHandler = $('#sliderHandler'),
      $sliderValue = $('#sliderValue');

    var totalLen = $('#sliderInner').width(),
      startLeft = 0,
      startX = 0;

    $sliderHandler
      .on('touchstart', function (e) {
        startLeft = parseInt($sliderHandler.css('left')) * totalLen / 100;
        startX = e.changedTouches[0].clientX;
      })
      .on('touchmove', function (e) {
        var dist = startLeft + e.changedTouches[0].clientX - startX,
          percent;
        dist = dist < 0 ? 0 : dist > totalLen ? totalLen : dist;
        percent = parseInt(dist / totalLen * 100);
        $sliderTrack.css('width', percent + '%');
        $sliderHandler.css('left', percent + '%');
        $sliderValue.text(percent);

        e.preventDefault();
      })
    ;
  }

  render() {
    return (
      <BasePage title="List" back>
        <div className="page__bd page__bd_spacing">
          <div className="weui-slider">
            <div className="weui-slider__inner">
              <div style={{width: 0}} className="weui-slider__track"/>
              <div style={{left: 0}} className="weui-slider__handler"/>
            </div>
          </div>
          <br/>
          <div className="weui-slider-box">
            <div className="weui-slider">
              <div id="sliderInner" className="weui-slider__inner">
                <div id="sliderTrack" style={{width: "50%"}} className="weui-slider__track"/>
                <div id="sliderHandler" style={{left: "50%"}} className="weui-slider__handler"/>
              </div>
            </div>
            <div id="sliderValue" className="weui-slider-box__value">50</div>
          </div>
        </div>

      </BasePage>
    )
  }
}

export default SliderPage;
