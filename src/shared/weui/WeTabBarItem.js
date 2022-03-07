import React from "react"
import classNames from 'classnames'
import {Icons} from "components/Icons";
import PropTypes from 'prop-types'

const WeTabBarItem = ({index, item, onSelectItem, currentTabBarItemIndex}) => {
  const {label, icon} = item;
  const className = classNames('weui-tabbar__item', "btn_active", {
    "weui-bar__item_on": index === currentTabBarItemIndex
  })
  return (
    <div className={className} onClick={() => {
      onSelectItem && onSelectItem(index, item)
    }}>
      <div className={"weui-tabbar__top"}>
                <span className="weui-tabbar__icon">
                    {Icons[index === currentTabBarItemIndex ? icon + "Outlined" : icon]}
                </span>
        {
          item.barBadges &&
          <span className="weui-badge">
                        {item.barBadges}
                    </span>
        }
        {
          item['badgeDot'] &&
          <span className="weui-badge weui-badge_dot" style={{position: "absolute", top: 0, right: -6}}/>
        }
      </div>
      <p className="weui-tabbar__label">
        {label}
      </p>
    </div>
  )
}

WeTabBarItem.propTypes = {
  index: PropTypes.number,
  item: PropTypes.object,
  onSelectItem: PropTypes.func,
  currentTabBarItemIndex: PropTypes.number
}


export default WeTabBarItem;
