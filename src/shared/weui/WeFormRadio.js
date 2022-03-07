import React, {Fragment} from 'react'
import cls from "classnames"
import PropTypes from "prop-types";

const WeFormRadio = (props) => {
  const {
    onChange,
    hide,
    items,
    name,
    value
  } = props;
  if (hide) return null
  const className = cls({
    "weui-cells": true,
    "weui-cells_radio": true,
  })

  return (
    <Fragment>
      <div className={className}>
        {
          items.map((item, i) => {
            const props = {
              onChange: () => {
                onChange && onChange(item.value)
              }
            }
            return (
              <label key={i} className="weui-cell weui-cell_active weui-check__label">
                <div className="weui-cell__bd">
                  <p>{item.label}</p>
                </div>
                <div className="weui-cell__ft">
                  <input checked={value === item.value} {...props} type="radio" className="weui-check" name={name}/>
                  <span className="weui-icon-checked"/>
                </div>
              </label>
            )
          })
        }
      </div>
    </Fragment>
  )

}

WeFormRadio.propTypes = {
  onChange: PropTypes.func,
  label: PropTypes.string,
  hide: PropTypes.bool,
  items: PropTypes.array,
  value: PropTypes.any,
}

export default WeFormRadio;
