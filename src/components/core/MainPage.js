import React from "react";
import PropTypes from "prop-types";
import cls from 'classnames'
import WeScrollView from "shared/weui/WeScrollView";

const MainPage = ({children, scroll, className, useScroll, style}) => {
  const classNames = cls(
    className
  )
  const props = {
    className: classNames,
    style
  }
  const {top, bottom} = style;
  const {
    isRefreshing,
    enableRefreshControl,
    onScrollTop,
    endReachedThreshold,
    onScrollReady,
    handleRefresh,
    onEndReached,
    ...other
  } = scroll || {}
  const height = `calc(100vh - ${top}px - ${bottom}px)`
  return (
    <main {...props}>
      {
        useScroll ?
          <WeScrollView
            className={"scroll-view"}
            style={{height}}
            rows={[children]}
            {...{
              enableRefreshControl,
              onScrollTop,
              onScrollReady,
              isRefreshing,
              endReachedThreshold,
              onEndReached: (endReached) => {
                onEndReached && onEndReached(endReached)
              },
              ...other
            }}
          /> :
          children
      }
    </main>
  )
}


MainPage.propTypes = {
  children: PropTypes.any,
  useScroll: PropTypes.bool,
  style: PropTypes.object,
  className: PropTypes.string,
  scroll: PropTypes.object
};

MainPage.defautlProps = {
  style: {},
  useScroll: false
}

export default MainPage

