import React from 'react';
import BasePage from "components/core/BasePage";
import {WeFlex, WeFlexItem, WeFormGroup, WeFormTextArea} from "shared/weui";
import {
  getAppBarHeight,
  getPageFooterHeight,
  locationHashPost,
  readUploadFile,
  showTopTips
} from "shared/functions/common";
import WeButton from "shared/weui/WeButton";
import UploadFileView from "components/UploadFileView";


class IndexPage extends React.PureComponent {
  constructor(props) {
    super(props);
    const {postData} = props.location
    const {data} = postData || {}
    this.state = {
      desKey: "",
      data,
      uploadId: this.getUploadId()
    }
    this.uploader = React.createRef()
  }

  getUploadId() {
    return `upload_file_${+(new Date())}`;
  }

  onEncrypt() {
    let {desKey, data} = this.state;
    desKey = desKey.trim()
    if (!desKey) {
      return showTopTips("密钥不能为空！")
    }
    locationHashPost("Crypto/Des/EnterData", null, {desKey, data})
  }

  render() {
    const {desKey} = this.state;
    return (
      <BasePage
        right={[
          {
            icon: "upload",
            onClick: () => this.uploader.current.upload()
          }
        ]}
        title={"Des加解密"} back footer={{
        component: (
          <WeFlex className={"width_100p"}>
            <WeFlexItem>
              <WeButton mini={true} width={"90%"} onClick={() => this.onEncrypt()}>下一步</WeButton>
            </WeFlexItem>
          </WeFlex>
        )
      }}>
        <WeFormGroup title={"密钥"}>
          <WeFormTextArea
            style={{height: `calc(100vh - ${getAppBarHeight()}px - ${getPageFooterHeight()}px - 64px)`}}
            placeholder={"请输入密钥"}
            value={desKey || ""}
            onChange={({target}) => {
              let desKey = target.value;
              if (desKey) {
                desKey = desKey.trim()
              }
              this.setState({
                desKey
              })
            }}/>
        </WeFormGroup>
        <UploadFileView
          uploadId={this.state['uploadId']}
          onChange={(files) => {
            if (files && files.length > 0) {
              const file = files[0]
              const {type, size} = file
              if (size > 1024 * 1024 * 2) {
                return showTopTips(`文件大小超过最大上传限制: ${2}m`)
              }
              if (type === "" || type.indexOf("text") > -1) {
                readUploadFile(file, "readAsText").then(result => {
                  this.setState({
                    desKey: result
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
}

export default IndexPage
