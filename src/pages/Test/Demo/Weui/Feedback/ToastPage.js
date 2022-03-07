import React from "react"
import BasePage from "components/core/BasePage"
import weui from "shared/weui-js";

class ToastPage extends React.Component {
  render() {
    return (
      <BasePage back title={"Toast"}>
        <div className="mt_64">
          <button onClick={() => weui.toast('操作成功', 3000)} className="weui-btn weui-btn_default" id="showToast">成功提示
          </button>
          <button onClick={() => weui.toast('失败提示', {
            type: "warn"
          })} className="weui-btn weui-btn_default" id="showWarnToast">失败提示
          </button>
          <button onClick={() => weui.toast('长文案提示长文案提示', {
            type: "warn",
          })} className="weui-btn weui-btn_default" id="showTextMoreToast">长文案提示
          </button>
          <button onClick={() => {
            const loading = weui.loading('Loading', {
              primary: true,
            });

            setTimeout(() => {
              loading.hide()
            }, 3000)
          }} className="weui-btn weui-btn_default" id="showLoadingToast">加载中提示
          </button>
          <button onClick={() => {
            weui.toast('长文案提示长文案提示', {
              hideIcon: true,
            })
          }} className="weui-btn weui-btn_default" id="showTextToast">文字提示
          </button>
        </div>
      </BasePage>
    )
  }
}

export default ToastPage
