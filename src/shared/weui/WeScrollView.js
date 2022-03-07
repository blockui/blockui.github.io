import React from 'react'
import "intersection-observer";
import {RefreshControl, ScrollView} from "shared/scroll-view";
import WeLoadMore from "./WeLoadMore";

class WeScrollView extends React.Component {
  constructor(props) {
    super(props);
    this.scrollView = React.createRef()
    this.scrollViewInner = React.createRef()
  }

  componentDidMount() {
    const {onScrollReady} = this.props;
    onScrollReady && onScrollReady(this.scrollView.current)
  }

  scrollTo(val) {
    this.scrollView && this.scrollView.current.scrollTo(val)
  }

  scrollToBottom() {
    this.scrollView && this.scrollView.current.scrollToBottom()
  }

  getScrollClientHeight() {
    this.scrollView && this.scrollView.current.getScrollClientHeight()
  }

  getScrollFullHeight() {
    this.scrollView && this.scrollView.current.getScrollFullHeight()
  }

  getRows(rows) {
    const {onLoadOldRows, noMoreRows, loadingOldRows} = this.props;
    if (onLoadOldRows) {
      if (rows.length > 0) {
        if (loadingOldRows) {
          rows.push(
            <WeLoadMore key={"loading"} loading/>
          )
        } else {
          rows.push(
            <WeLoadMore onClick={() => {
              onLoadOldRows && onLoadOldRows()
            }} key={"loading_more"} tips={noMoreRows ? "" : "加载更多"}/>
          )
        }
      } else {
        rows.push(
          <WeLoadMore onClick={() => {
            onLoadOldRows && onLoadOldRows()
          }} key={"empty"} tips={""}/>
        )
      }
    }

    return rows;
  }

  render() {
    const {
      style,
      rows,
      RefreshControlColor,
      isRefreshing,
      loadingOldRows,
      noMoreRows,
      onEndReached,
      onChildrenChanged,
      enableRefreshControl,
      onScrollEnd,
      onScrollStart,
      onScrollTop,
      onScroll,
      onPullDownRefresh,
      onScrollReady,
      onLoadOldRows,
      ...props
    } = this.props;
    return (
      <ScrollView
        contentContainerClassName={"bd-scr"}
        ref={this.scrollView}
        innerRef={this.scrollViewInner}
        {...{
          onScroll,
          refreshControl: enableRefreshControl ? (
            <RefreshControl
              color={RefreshControlColor || undefined}
              enableIcon={true}
              onRefresh={(e) => {
                onPullDownRefresh && onPullDownRefresh(e)
              }}
              isRefreshing={isRefreshing || false}
            />
          ) : undefined,
          onScrollTop: () => {
            onScrollTop && onScrollTop()
          },
          onScrollStart: (e) => {
            onScrollStart && onScrollStart(e)
          },
          onScrollEnd: (e, scroll) => {
            onScrollEnd && onScrollEnd(e, scroll)
          },
          onEndReached: (endReached) => {
            onEndReached && onEndReached(endReached)
          },
          onChildrenChanged: (e) => {
            onChildrenChanged && onChildrenChanged(e)
          },
        }}
        {...props}
        style={style}
      >
        {this.getRows(rows).map((row) => {
          return row
        })}
      </ScrollView>
    );
  }
}

export default WeScrollView;
