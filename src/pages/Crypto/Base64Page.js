import React from 'react';
import BasePage from "components/core/BasePage";
import {WeFlex, WeFlexItem, WeFormTextArea} from "shared/weui";
import {

  getAppBarHeight,
  getPageFooterHeight,
  locationHashPost,
  readUploadFile,
  showTopTips
} from "shared/functions/common";
import WeButton from "shared/weui/WeButton";
import {base64Decode, base64Encode} from "shared/functions/base64";
import UploadFileView from "components/UploadFileView";
import {getConstant} from "shared/functions/common";
import QrCodeScannerView from "../../components/QrCodeScannerView";
import {setStoreState} from "../../components/core/App";

class Base64Page extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      message: "",
      uploadId: this.getUploadId()
    }
    this.uploader = React.createRef()
  }

  getUploadId() {
    return `upload_file_${+(new Date())}`;
  }

  render() {
    const {message} = this.state;
    return (
      <BasePage
        right={[
          {
            icon: "RiQrScanLine",
            onClick: ()=>{
              setStoreState("global", {
                qrCodeScanner: (message) => {
                  this.setState({
                    message
                  })
                }
              })
            }
          },
          {
            icon: "upload",
            onClick: () => this.uploader.current.upload()
          }
        ]}
        title={"Base64编解码"} back footer={{
        component: (
          <WeFlex className={"width_100p"}>
            <WeFlexItem>
              <WeButton mini={true} width={"80%"} onClick={() => {
                this.onEncode(true)
              }}>编码</WeButton>
            </WeFlexItem>
            <WeFlexItem>
              <WeButton mini={true} width={"80%"} onClick={() => {
                this.onEncode(false)
              }}>解码</WeButton>
            </WeFlexItem>
          </WeFlex>
        )
      }}>

        <WeFormTextArea
          style={{height: `calc(100vh - ${getAppBarHeight()}px - ${getPageFooterHeight()}px - 32px)`}}
          placeholder={"请输入"} value={message}
          onChange={({target}) => {
            let message = target.value;
            this.setState({
              message
            })
          }}/>
        <UploadFileView
          uploadId={this.state['uploadId']}
          onChange={(files) => {
            if (files && files.length > 0) {
              const file = files[0]
              const {type, size} = file
              const constant = getConstant()
              const {maxUploadLengthM} = constant.common.upload
              if (size > 1024 * 1024 * maxUploadLengthM) {
                return showTopTips(`文件大小超过最大上传限制: ${maxUploadLengthM}m`)
              }
              if (type === "" || type.indexOf("application") > -1 || type.indexOf("text") > -1) {
                readUploadFile(file, "readAsText").then(result => {
                  this.setState({
                    message: result
                  })
                }).catch(() => {
                  return showTopTips("上传文件读取失败！")
                })
              } else {
                return showTopTips("上传文件不合法！")
              }
            }
          }}
          ref={this.uploader}
        />
      </BasePage>
    );
  }

  onEncode(encode) {
    let result = ""
    const {message} = this.state;
    if (message.length > 0) {
      try {
        result = encode ? base64Encode(message) : base64Decode(message)
        if (result) {
          locationHashPost("Crypto/Base64/Result", {}, {
            result
          })
        }
      } catch (e) {
        console.error(e.message)
        showTopTips(encode ? "编码失败" : "解码失败")
      }
    } else {
      showTopTips("请输入文本")
    }
  }
}


export default Base64Page
