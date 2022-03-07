import React from 'react';
import BasePage from "components/core/BasePage";
import {WeFlex, WeFlexItem, WeFormGroup, WeFormInput, WeFormTextArea} from "shared/weui";
import WeButton from "shared/weui/WeButton";
import {locationHashPost, onChangeInput, showTopTips} from "shared/functions/common";
import WeFormSelect from "shared/weui/WeFormSelect";
import {md5, randomString} from "shared/functions/crypto";

class HashPage extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      hashType: 0,
      txt:"",
      result: ""
    }
    this.hashTypes = [
      {
        label: "Md5",
        value: 0
      }
    ]
  }

  genKey() {
    const {randomType,txt} = this.state;
    if(txt){
      switch (randomType){
        default:
          this.setState({result:md5(txt)})
          break
      }

    }

  }

  render() {
    const {result,txt,hashType} = this.state;
    return (
      <BasePage title={"Hash"} back>

        <WeFormGroup>
          <WeFormInput label={"文本"} placeholder={"输入文本"} textAlign={"right"} value={txt} onChange={onChangeInput.bind(this, this, "txt")}/>

          <WeFormSelect label={"类型"} onChange={onChangeInput.bind(this, this, "randomType")} value={hashType}
                        items={this.hashTypes}/>
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


export default HashPage
