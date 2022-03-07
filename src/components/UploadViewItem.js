import React, {Component} from "react"
import {Icons} from "components/Icons";
import ImageBox from "components/ImageBox";

class UploadViewItem extends Component {
  render() {
    const {file, onClick} = this.props;
    return (
      <li onClick={onClick} key={file._id} className="weui-uploader__file">
        <ImageBox style={{height: "100%", width: "100%"}} src={file._id}/>
        {
          file.home &&
          <span className="home">
                        {Icons["home"]}
                    </span>
        }
      </li>
    )
  }
}

export default UploadViewItem
