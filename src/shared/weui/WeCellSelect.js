import React, {Fragment} from 'react'
import classNames from 'classnames'

const WeCellSelect = ({
                label,
                value,
                title,
                foot,
                placeholder,
                textRight,
                active,
                access,
                labelWidth,
                primary,
                id,
                component,
                to,
                ...props
              }) => {
  const className = classNames(
    "weui-cell weui-cell_select weui-cell_select-after",
    {
      "weui-cell_active": active === undefined ? true : active,
      "weui-cell_access": access === undefined ? true : access,
    }
  )
  const className_bd = classNames(
    "weui-cell__bd",
    {
      "weui-cell__bd_right": textRight
    }
  )

  const href = component === "a" ? to : undefined

  const onClick = (e) => {
    //todo event prevent default
    props.onClick && props.onClick(e)
    if (to) {
      window.location[to.indexOf("#") === 0 ? "hash" : "href"] = to
    }
  }
  const title_ = label || title
  const value_ = value || foot

  return React.createElement(component || "div", {className, ...props, href, onClick}, (
    <Fragment>
      {
        (title_ && title_.length > 0) &&
        <div className="weui-cell__hd"><label className="weui-label"
                                              style={{width: labelWidth}}>{title_}</label></div>

      }
      <div className={className_bd}>
        {
          value_ && value_.length > 0 ?
            <span>{value_}</span> :
            <span className="placeholder">
                            {placeholder}
                        </span>
        }
      </div>
    </Fragment>
  ))
}
export default WeCellSelect;
