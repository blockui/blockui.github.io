import createStyles from './ScrollView.styles';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {debounce, eventOptions, forwardRef, isIOS} from '../util';
import {refType} from '../PropTypes';
import Observer from '../Observer';
import FixedState from '../FixedState';
import RefreshState from '../RefreshState';
import PullingDown from '../PullingDown';
import Hook from './Hook';
import FixedContainer from './FixedContainer';
import warning from 'warning';
import {FixedContext, ObserverContext, RefreshContext} from '../Contexts';

class ScrollView extends Component {
  constructor(props) {
    super(props);
    const {isHorizontal, onEndReached, refreshControl} = props;
    warning(
      !isHorizontal || !refreshControl,
      '`refreshControl` with `isHorizontal` is NOT supported, `refreshControl` will be ignored',
    );

    warning(
      !isHorizontal || !onEndReached,
      '`onEndReached` with `isHorizontal` is NOT supported, `onEndReached` will be ignored',
    );
    this.initOffSetTop = 64
    this.domScrollTop = 0;
    this.styles = createStyles();
    this.observer = new Observer();
    this.toEmitOnScrollEnd = debounce((ev) => {
      const {onScrollEnd} = this.props;
      this.isScrolling = false;
      onScrollEnd && onScrollEnd(ev, this.dom);
    }, 100);

    this.fixedState = new FixedState();
    if (props.refreshControl) this.refreshState = new RefreshState();
  }

  shouldComponentUpdate(nextProps, nextState, nextContext) {
    if (this.childMountOb) {
      this.childMountOb.disconnect()
    }
    return true;
  }

  componentDidMount() {
    const {dom} = this;
    this.initOffSetTop += window.$(this.domChildren).offset().top
    this.observer.setOnChildrenChanged(this.onChildrenChanged.bind(this), this.domChildren)
    this.observer.mount(dom);
    this.registerTouchEvents(dom);

  }

  componentWillUnmount() {
    const {dom} = this;
    this.toEmitOnScrollEnd.clearDebounce();
    this.unregisterTouchEvents(dom);
  }

  scrollChildrenViewRef(domChildren) {
    forwardRef(this.props.childrenRef, domChildren);
    this.domChildren = domChildren;
  }

  scrollViewRef(dom) {
    forwardRef(this.props.innerRef, dom);
    this.dom = dom;
  };

  getScrollClientHeight() {
    return parseInt(this.dom.clientHeight);
  }

  getScrollFullHeight() {
    return parseInt(this.domChildren.clientHeight);
  }

  scrollTo(val = 0) {
    const args = this.props.isHorizontal ? [val, 0] : [0, val];
    this.dom.scrollTo(...args);
  }

  scrollToBottom() {
    const scrollClientHeight = this.getScrollClientHeight();
    const scrollHeight = this.getScrollFullHeight();
    if (scrollHeight > scrollClientHeight) {
      this.scrollTo(scrollHeight - scrollClientHeight + this.initOffSetTop)
    }
  }

  onChildrenChanged() {
    const {onChildrenChanged} = this.props;
    if (onChildrenChanged) onChildrenChanged();
  }

  registerTouchEvents(dom) {
    if (!this.refreshState) return;
    this.pullingDown = new PullingDown(this.dom);
    if (this._checkSupportTouch()) {
      dom.addEventListener('touchstart', this.handleTouchStart.bind(this), eventOptions);
    } else {
      dom.addEventListener('mousedown', this.handleTouchStart.bind(this), eventOptions);
    }
  };

  unregisterTouchEvents(dom) {
    if (!this.refreshState) return;
    if (this._checkSupportTouch()) {
      dom && dom.removeEventListener('touchstart', this.handleTouchStart.bind(this), eventOptions);
    } else {
      dom && dom.removeEventListener('mousedown', this.handleTouchStart.bind(this), eventOptions);
    }
  };

  handleEndEnter(enable) {
    const {onEndReached} = this.props;
    if (onEndReached) onEndReached(enable);
  };

  handleScroll(ev) {
    const {props: {onScrollStart, onScroll, onScrollTop}, isScrolling} = this;
    if (!isScrolling) {
      this.isScrolling = true;
      onScrollStart && onScrollStart(ev);
    }
    const {scrollTop} = this.dom;
    if (this.domScrollTop > scrollTop && scrollTop === 0) {
      onScrollTop && onScrollTop()
    }
    this.domScrollTop = scrollTop
    onScroll && onScroll(ev, scrollTop);
    this.toEmitOnScrollEnd(ev);
  };

  handleTouchStart(ev) {
    const {dom} = this;
    this.y0 = this._getClientY(ev)
    this.enableTouchStart = true;
    setTimeout(() => {
      this.handleTouchEnd()
    }, 1000)
    if (dom) {
      if (this._checkSupportTouch()) {
        dom.addEventListener('touchmove', this.handleTouchMove.bind(this), eventOptions);
        dom.addEventListener('touchend', this.handleTouchEnd.bind(this), eventOptions);
      } else {
        if (ev.button !== 2) {//not right key down
          dom.addEventListener('mousemove', this.handleTouchMove.bind(this), eventOptions);
          dom.addEventListener('mouseup', this.handleTouchEnd.bind(this), eventOptions);
        }
      }
    }
  };

  _checkSupportTouch() {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0 || window.navigator.msMaxTouchPoints > 0;
  }

  _getClientY(ev) {
    let y;
    if (ev.touches && ev.touches.length > 0) {
      y = ev.touches[0].clientY;
    } else {
      y = ev.clientY;
    }
    return y;
  }

  handleTouchMove(ev) {
    if (!this.enableTouchStart) return;
    //_debug("handleTouchMove")
    const dy = this._getClientY(ev) - this.y0;
    if (!this.pullingDown.isActive) {
      if (this.dom.scrollTop <= 0) {
        if (dy > 0) {
          const {onPullingDownStart} = this.props;
          onPullingDownStart && onPullingDownStart()
          this.pullingDown.start();
          this.refreshState.call('disableTransition');
        }
      } else {
        this.y0 = this._getClientY(ev).clientY;
      }
    } else if (dy <= 0) {
      this.refreshState.call('setHeight', 0);
      const {onPullingDownStop} = this.props;
      onPullingDownStop && onPullingDownStop()
      this.pullingDown.stop();
    }

    if (this.pullingDown.isActive) {
      this.refreshState.call('setHeight', dy);
    }
  };

  handleTouchEnd() {
    const {dom} = this;
    this.y0 = 0;
    if (this.pullingDown.isActive) {
      const {onPullDown} = this.props;
      if (onPullDown) onPullDown();
      this.refreshState.call('attemptToRefresh');
      const {onPullingDownStop} = this.props;
      onPullingDownStop && onPullingDownStop()
      this.pullingDown.stop();
    }

    //_debug("handleTouchEnd")
    this.enableTouchStart = false;
    if (dom) {
      if (this._checkSupportTouch()) {
        dom.removeEventListener('touchmove', this.handleTouchMove.bind(this), eventOptions);
        dom.removeEventListener('touchend', this.handleTouchEnd.bind(this), eventOptions);
      } else {
        dom.removeEventListener('mousemove', this.handleTouchMove.bind(this), eventOptions);
        dom.removeEventListener('mouseup', this.handleTouchEnd.bind(this), eventOptions);
      }
    }
  };

  render() {
    const {
      props: {
        style,
        className,
        onPullDown,
        contentContainerStyle,
        contentContainerClassName,
        children,
        onScrollStart,
        onScrollEnd,
        onEndReached,
        onChildrenChanged,
        onPullingDownStart,
        onPullingDownStop,
        onScrollTop,
        endReachedThreshold,
        isHorizontal,
        disabled,
        refreshControl,
        innerRef,
        childrenRef,
        ...other
      },
      styles,
      observer,
      fixedState,
      refreshState,
    } = this;
    const direction = isHorizontal ? 'horizontal' : 'vertical';
    return (
      <ObserverContext.Provider value={observer}>
        <FixedContext.Provider value={fixedState}>
          <RefreshContext.Provider value={refreshState}>
            <div style={styles.container(style)} className={className}>
              <FixedContainer
                style={styles.fixedContainer(contentContainerStyle)}>
                {fixedState.children}
              </FixedContainer>
              <div
                {...other}
                style={styles.main(direction, disabled)}
                ref={this.scrollViewRef.bind(this)}
                onScroll={this.handleScroll.bind(this)}>

                {!isHorizontal && refreshControl}

                <div
                  ref={this.scrollChildrenViewRef.bind(this)}
                  style={contentContainerStyle}
                  className={contentContainerClassName}>
                  {children}
                </div>

                {isIOS && <div style={styles.background(direction)}/>}

                {!isHorizontal && (
                  <Hook
                    style={styles.endHook(endReachedThreshold)}
                    onEnter={this.handleEndEnter.bind(this, true)}
                    onLeave={this.handleEndEnter.bind(this, false)}
                  />
                )}
              </div>
            </div>
          </RefreshContext.Provider>
        </FixedContext.Provider>
      </ObserverContext.Provider>
    );
  }
}

ScrollView.propTypes = {
  style: PropTypes.object,
  className: PropTypes.string,
  contentContainerStyle: PropTypes.object,
  contentContainerClassName: PropTypes.string,
  children: PropTypes.node,
  onScrollTop: PropTypes.func,
  onScrollStart: PropTypes.func,
  onScroll: PropTypes.func,
  onScrollEnd: PropTypes.func,
  onChildrenChanged: PropTypes.func,
  onEndReached: PropTypes.func,
  onPullDown: PropTypes.func,
  onPullingDownStart: PropTypes.func,
  onPullingDownStop: PropTypes.func,
  endReachedThreshold: PropTypes.number,
  isHorizontal: PropTypes.bool,
  innerRef: refType,
  childrenRef: refType,
  disabled: PropTypes.bool,
  refreshControl: PropTypes.node,
};

ScrollView.defaultProps = {
  endReachedThreshold: 1,
  isHorizontal: false,
  disabled: false,
};
export default ScrollView
