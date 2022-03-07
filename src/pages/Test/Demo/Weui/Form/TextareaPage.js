import React from "react"
import WeForm, {WeFormButton, WeFormGroup, WeFormTextArea} from "shared/weui/WeForm";
import BasePage from "components/core/BasePage";

export default class TextareaPage extends React.Component {
  render() {
    return (
      <BasePage title="文本域" back>
        <WeForm title={"文本域"} desc={"输入更多内容的输入区域样式展示"}>
          <WeFormGroup title={"问题描述"}>
            <WeFormTextArea valueMaxLength={200} placeholder={"请描述你所发生的问题"}/>
          </WeFormGroup>
          <WeFormButton primary>确定</WeFormButton>
        </WeForm>
      </BasePage>
    )
  }
}
