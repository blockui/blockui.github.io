import React from "react"
import BasePage from "components/core/BasePage"
import AvatarBox from "components/AvatarBox";
import {WeCell} from "shared/weui";

class ArticlePage extends React.Component {
  render() {
    return (
      <BasePage title={"Avatar"} back useScroll={true}>
        <div className="pt_8">
          <WeCell img={<AvatarBox size={8}/>}/>
          <WeCell img={<AvatarBox size={8}/>}/>
          <WeCell img={<AvatarBox size={8}/>}/>
        </div>
      </BasePage>
    )
  }
}

export default ArticlePage
