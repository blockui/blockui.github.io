import React from "react"
import BasePage from "components/core/BasePage"
import weui from "shared/weui-js";

class DialogPage extends React.Component {

  render() {
    const options1 = {
      title: 'dialog标题',
      content: 'dialog内容',
      className: 'custom-classname',
      buttons: [{
        label: '取消',
        type: 'default',
        onClick: function () {
        }
      }, {
        label: '确定',
        type: 'primary',
        onClick: function () {
        }
      }]
    }
    const options2 = {
      title: 'dialog标题',
      content: 'dialog内容',
      className: 'custom-classname',
      buttons: [{
        label: '取消',
        type: 'primary',
        onClick: function () {
        }
      }]
    }
    return (
      <BasePage back title={"Dialog"}>
        <div className="mt_64" style={{marginTop: 80}}>
          <div className="page__bd page__bd_spacing">
            <button onClick={() => weui.dialog({...options1, isAndroid: false})}
                    className="weui-btn weui-btn_default">iOS
              Dialog样式一
            </button>
            <button onClick={() => weui.dialog({...options2, isAndroid: false})}
                    className="weui-btn weui-btn_default">iOS
              Dialog样式二
            </button>
            <button onClick={() => weui.dialog({...options1, isAndroid: true})}
                    className="weui-btn weui-btn_default">Android
              Dialog样式一
            </button>
            <button onClick={() => weui.dialog({...options2, isAndroid: true})}
                    className="weui-btn weui-btn_default">Android
              Dialog样式二
            </button>
          </div>

        </div>
      </BasePage>
    )
  }
}

export default DialogPage
