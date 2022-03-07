import React from 'react';
import BasePage from "components/core/BasePage";
import {WeFlex, WeFlexItem, WeFormTextArea} from "shared/weui";
import {

  downloadFileToHard,
  getAppBarHeight,
  getPageFooterHeight,
  getWeui,
  showTopTips
} from "shared/functions/common";
import WeButton from "shared/weui/WeButton";
import {base64Decode, base64Encode} from "shared/functions/base64";

class Base64ResultPage extends React.PureComponent {
  constructor(props) {
    super(props);
    const {postData} = props.location
    const {result} = postData;
    this.state = {
      result
    }
  }

  render() {
    const {result} = this.state;
    return (
      <BasePage
        title={"结果"} back footer={{
        component: (
          <WeFlex className={"width_100p"}>
            <WeFlexItem>
              <WeButton mini={true} width={"80%"} onClick={() => {
                if (result.length === 0) {
                  return showTopTips("结果为空！")
                }
                getWeui().prompt({
                  title: "输入文件名:",
                  useInput: true
                }).then(({value}) => {
                  if (value.length > 0) {
                    const content = `${result}`;
                    downloadFileToHard(`b64_${value}_${new Date().Format("yyyyMMddhhmmss")}.txt`, {
                      content,
                      type: "text"
                    })
                  } else {
                    showTopTips("文件名不能为空！")
                  }
                })
              }}>下载</WeButton>
            </WeFlexItem>
          </WeFlex>
        )
      }}>
        <WeFormTextArea
          readOnly
          style={{height: `calc(100vh - ${getAppBarHeight()}px - ${getPageFooterHeight()}px - 32px)`}}
          placeholder={""} value={result}/>
      </BasePage>
    );
  }

  onEncode(encode) {
    let result = ""
    const {message} = this.state;
    if (message.length > 0) {
      try {
        result = encode ? base64Encode(message) : base64Decode(message)
      } catch (e) {
        console.error(e.message)
        showTopTips(encode ? "编码失败" : "解码失败")
      }
    }
    this.setState({
      result
    })
  }
}


export default Base64ResultPage
