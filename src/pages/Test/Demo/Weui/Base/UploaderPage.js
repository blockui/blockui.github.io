import React, {Fragment} from "react"
import {WeAppBar} from "shared/weui"
import weui from "shared/weui-js";
import {PIC_160} from "components/DataImages";

const {$} = window;
export default class UploaderPage extends React.Component {
  initUploader1() {

    var tmpl = '<li class="weui-uploader__file" style="background-image:url(#url#)"></li>',
      $gallery = $("#gallery"), $galleryImg = $("#galleryImg"),
      $uploaderInput = $("#uploaderInput"),
      $uploaderFiles = $("#uploaderFiles")
    ;

    $uploaderInput.on("change", function (e) {
      var src, url = window.URL || window.webkitURL || window.mozURL, files = e.target.files;
      for (var i = 0, len = files.length; i < len; ++i) {
        var file = files[i];

        if (url) {
          src = url.createObjectURL(file);
        } else {
          src = e.target.result;
        }

        $uploaderFiles.append($(tmpl.replace('#url#', src)));
      }
    });
    $uploaderFiles.on("click", "li", function () {
      $galleryImg.attr("style", this.getAttribute("style"));
      $gallery.fadeIn(100);
    });
    $gallery.on("click", function () {
      $gallery.fadeOut(100);
    });

  }

  initUploader() {
    const $gallery = $("#gallery"), $galleryImg = $("#galleryImg");
    const $uploaderFiles = $("#uploaderFiles")
    $uploaderFiles.on("click", "li", function () {
      $galleryImg.attr("style", this.getAttribute("style"));
      $gallery.fadeIn(100);
    });
    $gallery.on("click", function () {
      $gallery.fadeOut(100);
    });

    var uploadCount = 0;
    weui.uploader('#uploader', {
      url: 'http://localhost:8081',
      auto: true,
      type: 'file',
      fileVal: 'fileVal',
      compress: {
        width: 1600,
        height: 1600,
        quality: .8
      },
      onBeforeQueued: function (files) {
        // `this` 是轮询到的文件, `files` 是所有文件

        if (["image/jpg", "image/jpeg", "image/png", "image/gif"].indexOf(this.type) < 0) {
          weui.alert('请上传图片');
          return false; // 阻止文件添加
        }
        if (this.size > 10 * 1024 * 1024) {
          weui.alert('请上传不超过10M的图片');
          return false;
        }
        if (files.length > 5) { // 防止一下子选择过多文件
          weui.alert('最多只能上传5张图片，请重新选择');
          return false;
        }
        if (uploadCount + 1 > 5) {
          weui.alert('最多只能上传5张图片');
          return false;
        }

        ++uploadCount;

        // return true; // 阻止默认行为，不插入预览图的框架
      },
      onQueued: function () {
        console.log(this);

        // console.log(this.status); // 文件的状态：'ready', 'progress', 'success', 'fail'
        // console.log(this.base64); // 如果是base64上传，file.base64可以获得文件的base64

        // this.upload(); // 如果是手动上传，这里可以通过调用upload来实现；也可以用它来实现重传。
        // this.stop(); // 中断上传

        // return true; // 阻止默认行为，不显示预览图的图像
      },
      onBeforeSend: function (data, headers) {
        console.log(this, data, headers);
        // $.extend(data, { test: 1 }); // 可以扩展此对象来控制上传参数
        // $.extend(headers, { Origin: 'http://127.0.0.1' }); // 可以扩展此对象来控制上传头部

        // return false; // 阻止文件上传
      },
      onProgress: function (percent) {
        console.log(this, percent);
        // return true; // 阻止默认行为，不使用默认的进度显示
      },
      onSuccess: function (ret) {
        console.log(this, ret);
        // return true; // 阻止默认行为，不使用默认的成功态
      },
      onError: function (err) {
        console.log(this, err);
        // return true; // 阻止默认行为，不使用默认的失败态
      }
    });
  }

  componentDidMount() {
    this.initUploader()
  }

  render() {
    return (
      <Fragment>
        <WeAppBar {...{title: "List", left: [{icon: "back"}]}} />

        <div className="page__bd bg_2" style={{marginTop: 80}}>
          <div className="weui-gallery" id="gallery">
            <span className="weui-gallery__img" id="galleryImg"/>
            <div className="weui-gallery__opr">
                            <span className="weui-gallery__del">
                                <i className="weui-icon-delete weui-icon_gallery-delete"/>
                            </span>
            </div>
          </div>
          <div className="weui-cells weui-cells_form" id="uploader">
            <div className="weui-cell  weui-cell_uploader">
              <div className="weui-cell__bd">
                <div className="weui-uploader">
                  <div className="weui-uploader__hd">
                    <p className="weui-uploader__title">图片上传</p>
                    <div className="weui-uploader__info">0/2</div>
                  </div>
                  <div className="weui-uploader__bd">

                    <ul className="weui-uploader__files" id="uploaderFiles">
                      <li className="weui-uploader__file"
                          style={{backgroundImage: `url(${PIC_160})`}}/>
                      <li className="weui-uploader__file"
                          style={{backgroundImage: `url(${PIC_160})`}}/>
                      <li className="weui-uploader__file"
                          style={{backgroundImage: `url(${PIC_160})`}}/>
                      <li className="weui-uploader__file weui-uploader__file_status"
                          style={{backgroundImage: `url(${PIC_160})`}}>
                        <div className="weui-uploader__file-content">
                          <i className="weui-icon-warn"/>
                        </div>
                      </li>
                      <li className="weui-uploader__file weui-uploader__file_status"
                          style={{backgroundImage: `url(${PIC_160})`}}>
                        <div className="weui-uploader__file-content">50%</div>
                      </li>
                    </ul>
                    <div className="weui-uploader__input-box">
                      <input id="uploaderInput"
                             className="weui-uploader__input"
                             type="file"
                             capture="camera"
                             accept="image/*" multiple/>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Fragment>
    )
  }
}
