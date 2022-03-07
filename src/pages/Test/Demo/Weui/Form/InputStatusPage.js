import React from "react"
import BasePage from "components/core/BasePage"

const {$} = window

class InputStatusPage extends React.Component {
  componentDidMount() {
    var $tooltips = $('.js_tooltips');
    var $toast = $('#js_toast');
    var $input = $('#js_input');
    var $inputClear = $('#js_input_clear');
    var $cell = $('#js_cell');
    var $currentInput = $('#js_current_input');

    $input.on('input', function () {
      var $value = $input.val();
      if ($cell.hasClass('weui-cell_warn')) {
        $cell.removeClass('weui-cell_warn');
      }
      if ($value) {
        $('#showTooltips').removeClass('weui-btn_disabled');
      } else {
        $('#showTooltips').addClass('weui-btn_disabled');
      }
    });
    $currentInput.on('input', function () {
      var $value = $currentInput.val();
      if ($value) {
        $('#js_current_tips').css('display', 'block');
      } else {
        $('#js_current_tips').css('display', 'none');
      }
    });
    $('#showTooltips').on('click', function () {
      if ($(this).hasClass('weui-btn_disabled')) return;

      var $value = $input.val();
      if ($tooltips.css('display') !== 'none') return;

      // toptips的fixed, 如果有`animation`, `position: fixed`不生效
      $('.page.cell').removeClass('slideIn');

      if ($value.length < 16) {
        $cell.addClass('weui-cell_warn');
        $tooltips.fadeIn(100);
        setTimeout(function () {
          $tooltips.fadeOut(100);
        }, 2000);
      } else {
        $toast.fadeIn(100);
        setTimeout(function () {
          $toast.fadeOut(100);
        }, 2000);
      }
    });
    $inputClear.on('click', function () {
      $input.val('');
    });
  }

  render() {
    return (
      <BasePage title={"输入框状态"} back>
        <div className="weui-form">
          <div className="weui-form__text-area">
            <h2 className="weui-form__title">输入框状态</h2>
            <div
              className="weui-form__desc">可体验表单输入的反馈状态。显示报错信息有两种类型，一种是超过1个输入项的时候，用置顶tipsbar报错信息，告知错误原因，页面聚焦到对应的报错区域，内容标红色，另一种是在当前输入项位置报错，适用于只有1个输入项的时候，用户焦点主要是输入区域。
            </div>
          </div>
          <div className="weui-form__control-area">
            <div className="weui-cells__group weui-cells__group_form">
              <div className="weui-cells__title">表单报错：置顶tipsbar报错信息</div>
              <div className="weui-cells weui-cells_form">
                <div className="weui-cell weui-cell_active" id="js_cell">
                  <div className="weui-cell__hd"><label className="weui-label">卡号</label></div>
                  <div className="weui-cell__bd weui-flex">
                    <input id="js_input" className="weui-input" type="text"
                           pattern="[0-9]*" placeholder="请输入16位数卡号" maxLength="16"/>
                    <button id="js_input_clear"
                            className="weui-btn_reset weui-btn_icon weui-btn_input-clear">
                      <i className="weui-icon-clear"/>
                    </button>
                  </div>
                </div>
                <div className="weui-cell weui-cell_active">
                  <div className="weui-cell__hd"><label className="weui-label">持卡人</label></div>
                  <div className="weui-cell__bd weui-flex">
                    <input className="weui-input" type="text" placeholder="请输入持卡人姓名"/>
                  </div>
                </div>
              </div>
            </div>
            <div className="weui-cells__group weui-cells__group_form">
              <div className="weui-cells__title">表单报错：当前项位置报错</div>
              <div className="weui-cells weui-cells_form">
                <div className="weui-cell weui-cell_active">
                  <div className="weui-cell__hd"><label className="weui-label">金额</label></div>
                  <div className="weui-cell__bd weui-flex">
                    <input id="js_current_input" className="weui-input" type="text"
                           placeholder="请输入金额"/>
                  </div>
                </div>
              </div>
              <div id="js_current_tips"
                   style={{display: "none"}}
                   className="weui-cells__tips weui-cells__tips_warn">最多支持8位数
              </div>
            </div>
            <div className="weui-cells__group weui-cells__group_form">
              <div className="weui-cells__title">表单只读、置灰</div>
              <div className="weui-cells weui-cells_form">
                <div className="weui-cell weui-cell_active weui-cell_readonly">
                  <div className="weui-cell__hd"><label className="weui-label">EMail</label></div>
                  <div className="weui-cell__bd">
                    <input className="weui-input" placeholder="请输入EMail" value="1234567"
                           readOnly/>
                  </div>
                </div>
                <div className="weui-cell weui-cell_active weui-cell_disabled">
                  <div className="weui-cell__hd"><label className="weui-label">微信号</label></div>
                  <div className="weui-cell__bd">
                    <input className="weui-input" placeholder="请输入微信号" value="WeUI" disabled/>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="weui-form__opr-area">
            <button className="weui-btn weui-btn_primary weui-btn_disabled"
                    id="showTooltips">确定
            </button>
          </div>
        </div>
      </BasePage>
    )
  }
}

export default InputStatusPage
