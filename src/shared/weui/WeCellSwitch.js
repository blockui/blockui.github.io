import React, {Fragment} from 'react'
import classNames from 'classnames'

const View = ({title, component, to, ...props}) => {
  const className = classNames(
    "weui-cell weui-cell_switch"
  )
  const href = component === "a" ? to : undefined
  const onClick = (e) => {
    //todo event prevent default
    props.onClick && props.onClick(e)
    if (to) {
      window.location[to.indexOf("#") === 0 ? "hash" : "href"] = to
    }
  }

  return React.createElement(component || "div", {className, ...props, href, onClick}, (
    <Fragment>
      <div className={"weui-cell__bd"}>
        <span>{title}</span>
      </div>
      <div className="weui-cell__ft">
        <input className="weui-switch" type="checkbox"/>
      </div>
    </Fragment>
  ))
}
export default View;
