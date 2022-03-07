import createStyles from './RefreshControlObserver.styles';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {RefreshContext} from '../Contexts';
import {PullThreshold} from '../constants';

class RefreshControlObserver extends Component {
  constructor(props) {
    super(props);

    this.styles = createStyles();

    this.state = {
      isActive: false,
    };
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.isRefreshing && this.props.isRefreshing) {
      this.enableTransition();
      this.setHeight(PullThreshold);
    } else if (prevProps.isRefreshing && !this.props.isRefreshing) {
      this.end();
      this.setHeight(0);
    }
  }

  componentWillUnmount() {
    this.refreshState.unmount();
  }

  domRef(dom) {
    this.dom = dom;
  };

  requestRefresh() {
    const {onRefresh} = this.props;
    onRefresh && onRefresh();
  }

  setHeight(val) {
    const max = PullThreshold;
    const height = val > 0 ? (val > max ? max + (val - max) / 2 : val) : 0;
    const {state: {isActive}, dom} = this;
    dom.style.height = `${height}px`;

    if (height >= max && !isActive) {
      this.setState({isActive: true});
    } else if (height < max && isActive) {
      this.setState({isActive: false});
    }
  }

  enableTransition() {
    this.dom.style.transition =
      'height 0.3s ease-out, min-height 0.3s ease-out';
  }

  disableTransition() {
    this.dom.style.transition = 'none';
  }

  end() {
    if (this.state.isActive) {
      this.enableTransition();
    }
    this.setState({isActive: true});
  }

  attemptToRefresh() {
    const {props: {onRefresh, isRefreshing}, state: {isActive}} = this;
    if (onRefresh && !isRefreshing && isActive) {
      onRefresh();
    }
    this.end();
    if (isRefreshing) {
      this.setHeight(PullThreshold);
    } else {
      this.setHeight(0);
    }
  }

  renderChildren(refreshState) {
    if (!this.refreshState) {
      this.refreshState = refreshState;
      refreshState.mount(this);
    }

    const {
      props: {children, style, isRefreshing, onRefresh, ...other},
      state: {isActive},
      styles,
    } = this;

    return (
      <div
        {...other}
        style={styles.container(style, isRefreshing)}
        ref={this.domRef.bind(this)}
      >
        {children({isRefreshing, isActive})}
      </div>
    );
  };

  render() {
    return (
      <RefreshContext.Consumer>{this.renderChildren.bind(this)}</RefreshContext.Consumer>
    );
  }
}


RefreshControlObserver.propTypes = {
  isRefreshing: PropTypes.bool.isRequired,
  onRefresh: PropTypes.func,
  style: PropTypes.object,
  children: PropTypes.func.isRequired,
};

export default RefreshControlObserver
