import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {ObserverContext} from '../Contexts';
import Intersection from '../Intersection';
import {forwardRef} from '../util';
import {refType, thresholdType} from '../PropTypes';

class ScrollObserver extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isIntersecting: false,
      // visibleIds:{},
      ref: (dom) => {
        forwardRef(this.props.innerRef, dom);
        this.dom = dom;
      },
    };
  }

  componentDidMount() {
    const {
      dom,
      props: {rootMargin, threshold, onIntersect, debugId},
    } = this;
    process.nextTick(() => {
      const intersection = new Intersection({
        onEnter: this.onEnter.bind(this),
        onLeave: this.onLeave.bind(this),
        onIntersect,
        debugId,
      });
      if (dom) {
        const options = {rootMargin, threshold};
        this.observer.observe(dom, intersection, options);
      }
    });
  }

  componentWillUnmount() {
    const {dom} = this;
    if (dom) this.observer.unobserve(dom);
    this.setState = () => {
    }
  }

  onEnter(...args) {
    const {isIntersecting} = this.state;
    const {onEnter} = this.props;
    !isIntersecting && this.setState({
      isIntersecting: true,
      visibleIds: args[1]
    });
    onEnter && onEnter(...args);
  };

  onLeave(...args) {
    const {isIntersecting} = this.state;
    const {onLeave} = this.props;
    isIntersecting && this.setState({
      isIntersecting: false,
      visibleIds: args[1]
    });
    onLeave && onLeave(...args);
  };

  renderChildren(observer) {
    const {state, props: {children}} = this;
    this.observer = observer;
    return children(state);
  };

  render() {
    return (
      <ObserverContext.Consumer>{this.renderChildren.bind(this)}</ObserverContext.Consumer>
    );
  }
}

ScrollObserver.propTypes = {
  children: PropTypes.func.isRequired,
  onEnter: PropTypes.func,
  onLeave: PropTypes.func,
  onIntersect: PropTypes.func,
  rootMargin: PropTypes.string,
  threshold: thresholdType,
  innerRef: refType,
  debugId: PropTypes.string,
};

export default ScrollObserver
