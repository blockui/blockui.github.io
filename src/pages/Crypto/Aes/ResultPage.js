import React from 'react';
import BasePage from "components/core/BasePage";
import {WeFlex, WeFlexItem, WeFormTextArea} from "shared/weui";
import WeButton from "shared/weui/WeButton";
import {
  base64ToBlob,
  blobToObjectUrl,
  downloadFileToHard,
  getAppBarHeight,
  getPageFooterHeight,
  getWeui,
  locationHashPost,
  showTopTips
} from "shared/functions/common";
import {aesDecrypt} from "shared/functions/crypto";

class ResultPage extends React.PureComponent {
  constructor(props) {
    super(props);
    const {postData, params} = props.location
    const {encrypt} = params
    const {result, aesKey} = postData;
    this.state = {
      result,
      encrypt: encrypt === "true",
      aesKey
    }
  }

  render() {
    const {result, encrypt, aesKey} = this.state;
    return (
      <BasePage title={encrypt ? "加密结果" : "解密密结果"} back footer={{
        component: (
          <WeFlex className={"width_100p"}>
            <WeFlexItem>
              <WeButton mini={true} width={"80%"} onClick={() => {
                getWeui().prompt({
                  title: "输入文件名:",
                  useInput: true
                }).then(({value}) => {
                  if (value.length > 0) {
                    let suffix = "txt"
                    let type = "text"
                    let url = ""
                    if (!encrypt) {
                      if (result.indexOf("base64,") > -1 && result.indexOf("data:") === 0) {
                        type = result.split(";base64,")[0].replace("data:", "")
                        suffix = type.split("/")[1]
                        url = blobToObjectUrl(base64ToBlob(result, type))
                      }
                    }
                    downloadFileToHard(`${encrypt ? "en" : "de"}_${value}_${new Date().Format("yyyyMMddhhmmss")}.${suffix}`, {
                      content: result,
                      type,
                      url
                    })
                  } else {
                    showTopTips("文件名不能为空！")
                  }
                })
              }}>下载</WeButton>
            </WeFlexItem>
            {
              encrypt &&
              <WeFlexItem>
                <WeButton primary={false} mini={true} width={"80%"} onClick={() => {
                  const result1 = aesDecrypt(result, aesKey)
                  if (!result1) {
                    return showTopTips("解密失败")
                  }
                  locationHashPost("Crypto/Aes/Result", {encrypt: false}, {aesKey, result: result1})

                }}>解密</WeButton>
              </WeFlexItem>
            }
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
}


export default ResultPage
