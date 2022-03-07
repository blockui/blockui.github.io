import React, {Component} from "react"
import classNames from 'classnames'
import PropTypes from 'prop-types'
import WeTabBarItem from "./WeTabBarItem";

class WeTabBar extends Component {
  render() {
    const className = classNames('weui-tabbar')
    const {items, style, onSelectItem, currentTabBarItemIndex} = this.props;
    return (
      <div className={className} style={style}>
        {
          (items || []).map((item, i) =>
            <WeTabBarItem
              index={i}
              onSelectItem={onSelectItem}
              currentTabBarItemIndex={currentTabBarItemIndex}
              key={i}
              item={item}/>)
        }
      </div>
    )
  }
}

WeTabBar.propTypes = {
  items: PropTypes.array,
  style: PropTypes.object,
  onSelectItem: PropTypes.func,
  currentTabBarItemIndex: PropTypes.number
}

export default WeTabBar;

