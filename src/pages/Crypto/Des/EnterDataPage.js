import React from 'react';
import BasePage from "components/core/BasePage";
import {WeFlex, WeFlexItem, WeFormGroup, WeFormTextArea} from "shared/weui";
import {
  getAppBarHeight,
  getPageFooterHeight,
  globalLoading,
  globalLoadingHide,
  isMediaType,
  locationHashPost,
  readUploadFile,
  showTopTips
} from "shared/functions/common";
import WeButton from "shared/weui/WeButton";
import UploadFileView from "components/UploadFileView";
import {desDecrypt, desEncrypt} from "shared/functions/crypto";

class EnterDataPage extends React.PureComponent {
  constructor(props) {
    super(props);
    const {desKey,data} = props.location.postData  || {};
    this.state = {
      desKey,
      data,
      uploadId: this.getUploadId()
    }
    this.uploader = React.createRef()
  }

  getUploadId() {
    return `upload_file_${+(new Date())}`;
  }

  onEncrypt(encrypt) {
    let {desKey, data} = this.state;
    if(!desKey){
      return showTopTips("密钥不能为空")
    }
    if(!data){
      return showTopTips("文本不能为空")
    }
    const result = encrypt ? desEncrypt(data,desKey) : desDecrypt(data,desKey)
    if(!encrypt && !result){
      return showTopTips("解密失败")
    }
    locationHashPost("Crypto/Des/Result", {encrypt}, {desKey,result})
  }

  render() {
    const {data} = this.state;
    return (
      <BasePage
        right={[
          {
            icon: "upload",
            onClick: () => this.uploader.current.upload()
          }
        ]}
        title={"输入加解密的文本"} back footer={{
        component: (
          <WeFlex className={"width_100p"}>
            <WeFlexItem>
              <WeButton mini={true} width={"90%"} onClick={() => this.onEncrypt(true)}>加密</WeButton>
            </WeFlexItem>
            <WeFlexItem>
              <WeButton mini={true} width={"90%"} onClick={() => this.onEncrypt(false)}>解密</WeButton>
            </WeFlexItem>
          </WeFlex>
        )
      }}>
        <WeFormGroup>
          <WeFormTextArea
            style={{height: `calc(100vh - ${getAppBarHeight()}px - ${getPageFooterHeight()}px - 32px)`}}
            placeholder={"请输入加解密的文本"}
            value={data || ""}
            onChange={({target}) => {
              this.setState({
                data: target.value,
              })
            }}/>
        </WeFormGroup>
        <UploadFileView
          uploadId={this.state['uploadId']}
          onChange={(files) => {
            if (files && files.length > 0) {
              const file = files[0]
              const {type, size} = file
              if (size > 1024 * 1024 * 10) {
                return showTopTips(`文件大小超过最大上传限制: ${10}m`)
              }
              globalLoading("Loading...")
              if (type === "" || type.indexOf("text") > -1 || type.indexOf("application") > -1) {
                readUploadFile(file, "readAsText").then(result => {
                  this.setState({
                    data: result
                  })
                }).catch(() => {
                  return showTopTips("上传文件读取失败！")
                }).finally(() => globalLoadingHide())
              } else if (isMediaType(type)) {
                readUploadFile(file, "readAsDataURL").then(result => {
                  this.setState({
                    data: result
                  })
                }).catch(() => {
                  return showTopTips("上传文件读取失败！")
                }).finally(() => globalLoadingHide())
              } else {
                globalLoadingHide()
                return showTopTips("上传文件不合法！")
              }
            }
          }}
          ref={this.uploader}
        />
      </BasePage>
    );
  }

}


export default EnterDataPage
