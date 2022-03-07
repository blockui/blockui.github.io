import React from "react"
import BasePage from "components/core/BasePage"
import weui from "shared/weui-js";

class ActionSheetPage extends React.Component {

  render() {
    const menus = [
      {
        label: '拍照',
        onClick: function () {
          console.log('拍照');
        }
      }, {
        label: '从相册选择',
        onClick: function () {
          console.log('从相册选择');
        }
      }, {
        label: '其他',
        onClick: function () {
          console.log('其他');
        }
      }
    ];
    const actions = [
      {
        label: '取消',
        onClick: function () {
          console.log('取消');
        }
      }
    ];
    return (
      <BasePage back title={"ActionSheet"}>
        <div className="mt_64">
          <div className="page__bd page__bd_spacing">
            <button onClick={() => weui.actionSheet(menus, actions, {
              className: 'custom-classname',
              isAndroid: false,
              onClose: function () {
                console.log('关闭');
              }
            })} className="weui-btn weui-btn_default">iOS
              ActionSheet
            </button>
            <button onClick={() => weui.actionSheet(menus, actions, {
              className: 'custom-classname',
              isAndroid: true,
              onClose: function () {
                console.log('关闭');
              }
            })} className="weui-btn weui-btn_default">Android
              ActionSheet
            </button>
          </div>
        </div>
      </BasePage>
    )
  }
}

export default ActionSheetPage
