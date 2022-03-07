import React from 'react'
import cls from 'classnames'

const Item = ({item}) => {
  const id = +(new Date())
  return (
    <label className="weui-cell weui-cell_active weui-check__label" htmlFor={`radio_${id}`}>
      <div className="weui-cell__bd"><p>{item.label}</p></div>
      <div className="weui-cell__ft">
        <input readOnly type="radio" className="weui-check" name="radio1" id={`radio_${id}`}/>
        <span className="weui-icon-checked"/>
      </div>
    </label>
  )
}

const WeCellsRadio = ({className, items, ...props}) => {
  const classNames = cls(
    "weui-cells",
    "weui-cells_radio",
    className
  )
  return (
    <div className={classNames} {...props}>
      {
        items.map((item, i) => {
          return <Item key={i} item={item}/>
        })
      }
    </div>
  )
}

export default WeCellsRadio;
