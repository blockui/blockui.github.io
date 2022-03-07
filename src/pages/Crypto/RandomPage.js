import React from 'react';
import BasePage from "components/core/BasePage";
import {WeFlex, WeFlexItem, WeFormGroup, WeFormInput, WeFormTextArea} from "shared/weui";
import WeButton from "shared/weui/WeButton";
import {locationHashPost, onChangeInput, showTopTips} from "shared/functions/common";
import WeFormSelect from "shared/weui/WeFormSelect";
import {randomString} from "shared/functions/crypto";

class RandomPage extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      randomLen: 32,
      randomType: 5,
      result: ""
    }
    this.randomTypes = [
      {
        label: "数字",
        value: 0
      },
      {
        label: "字母",
        value: 1
      },
      {
        label: "特殊字符",
        value: 2
      },
      {
        label: "字符+数字",
        value: 3
      },
      {
        label: "数字+特殊字符",
        value: 4
      },
      {
        label: "数字+字符+特殊字符",
        value: 5
      }
    ]
  }

  genKey() {
    const {randomLen, randomType} = this.state;
    const result = randomString(randomLen, parseInt(randomType))
    this.setState({result})
  }

  render() {
    const {result, randomType, randomLen} = this.state;
    return (
      <BasePage title={"随机字符"} back>

        <WeFormGroup>
          <WeFormInput label={"随机长度"} textAlign={"right"} value={randomLen}
                       onChange={onChangeInput.bind(this, this, "randomLen")} type={"number"}/>
          <WeFormSelect label={"类型"} onChange={onChangeInput.bind(this, this, "randomType")} value={randomType}
                        items={this.randomTypes}/>
        </WeFormGroup>
        <WeFormGroup title={"结果"}>
          <WeFormTextArea rows={10} readOnly value={result}/>
        </WeFormGroup>
        <WeFlex className={"width_100p mt_16"}>
          <WeFlexItem>
            <WeButton mini={true} width={"90%"} onClick={() => {
              this.genKey()
            }}>生成</WeButton>
          </WeFlexItem>
        </WeFlex>
        <WeFlex hide className={"width_100p mt_8"}>
          <WeFlexItem>
            <WeButton primary={false} mini={true} width={"90%"} onClick={() => {
              if (!result) {
                return showTopTips("文本不能为空")
              }
              locationHashPost("Utils/Encrypt/RsaEncrypt", {}, {data: result})
            }}>使用Rsa加密该文本</WeButton>
          </WeFlexItem>
        </WeFlex>
      </BasePage>
    );
  }

}


export default RandomPage
