import React from "react"
import WeForm, {WeFormButton, WeFormFooter, WeFormGroup, WeFormInput, WeFormTips} from "shared/weui/WeForm";
import BasePage from "components/core/BasePage";


export default class WeUiDemoFormPage extends React.Component {
  render() {
    return (
      <BasePage title="表单结构" back>
        <WeForm
          title={"表单结构"}
          desc={"展示表单页面的信息结构样式, 分别由头部区域/控件区域/提示区域/操作区域和底部信息区域组成。"}
        >
          <WeFormGroup title={"表单组标题"}>
            <WeFormInput label={"微信号"} warn={"最多支持8位数"} showWarn placeholder={"填写本人微信号"}/>
            <WeFormInput label={"昵称"} placeholder={"填写本人微信号的昵称"}/>
            <WeFormInput label={"联系电话"} placeholder={"填写绑定的电话号码"} type="number" pattern="[0-9]*"/>
          </WeFormGroup>
          <WeFormGroup title={"微信号"}>
            <WeFormInput placeholder={"填写本人微信号"}/>
          </WeFormGroup>
          <WeFormGroup title={"昵称"}>
            <WeFormInput placeholder={"填写本人微信号的昵称"}/>
          </WeFormGroup>
          <WeFormTips>表单页提示，居中对齐</WeFormTips>
          <WeFormButton primary disabled>确定</WeFormButton>
          <WeFormTips>表单页提示，居中对齐</WeFormTips>
          <WeFormFooter link={"底部链接文本"} text={"Copyright © 2008-2019 weui.io"}/>
        </WeForm>
      </BasePage>
    )
  }
}
