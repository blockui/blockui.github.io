import React from "react"
import {WeButton, WeButtonCell} from "shared/weui";
import BasePage from "components/core/BasePage"

export default class ButtonPage extends React.Component {
  render() {
    const {location} = this.props;
    console.log(location)
    return (
      <BasePage title={"Button"} back useScroll>
        <div className="pt_8 pb_8">
          <div className="">
            <WeButton primary>页面主操作</WeButton>
            <WeButton primary>页面主操作</WeButton>
            <WeButton primary loading>页面主操作</WeButton>
            <WeButton primary disabled>页面主操作</WeButton>
            <WeButton>页面次要操作</WeButton>
            <WeButton loading>页面次要操作</WeButton>
            <WeButton loading disabled>页面次要操作</WeButton>
            <WeButton warn>警告类操作</WeButton>
            <WeButton warn loading>警告类操作</WeButton>
            <WeButton warn disabled>警告类操作</WeButton>
          </div>
          <div className="button-sp-area cell mb_16">
            <WeButtonCell>普通行按钮</WeButtonCell>
            <WeButtonCell primary>强调行按钮</WeButtonCell>
            <WeButtonCell primary
                          img={{src: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC4AAAAuCAMAAABgZ9sFAAAAVFBMVEXx8fHMzMzr6+vn5+fv7+/t7e3d3d2+vr7W1tbHx8eysrKdnZ3p6enk5OTR0dG7u7u3t7ejo6PY2Njh4eHf39/T09PExMSvr6+goKCqqqqnp6e4uLgcLY/OAAAAnklEQVRIx+3RSRLDIAxE0QYhAbGZPNu5/z0zrXHiqiz5W72FqhqtVuuXAl3iOV7iPV/iSsAqZa9BS7YOmMXnNNX4TWGxRMn3R6SxRNgy0bzXOW8EBO8SAClsPdB3psqlvG+Lw7ONXg/pTld52BjgSSkA3PV2OOemjIDcZQWgVvONw60q7sIpR38EnHPSMDQ4MjDjLPozhAkGrVbr/z0ANjAF4AcbXmYAAAAASUVORK5CYII="}}>
              强调行按钮
            </WeButtonCell>
            <WeButtonCell warn>警告行按钮</WeButtonCell>

          </div>
          <div className="button-sp-area mb_16 justify_content_space_around">
            <WeButton primary mini>强调按钮</WeButton>
            <WeButton mini>普通按钮</WeButton>
            <WeButton warn mini>警告按钮</WeButton>
          </div>
        </div>
      </BasePage>
    )
  }
}
