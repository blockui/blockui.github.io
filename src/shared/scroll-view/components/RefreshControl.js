import createStyles from './RefreshControl.styles';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import RefreshControlObserver from './RefreshControlObserver';
import Loading from "./Loading";

class RefreshControl extends Component {
  constructor(props) {
    super(props);
    this.styles = createStyles();
  }

  saveRef(refreshControl) {
    this.refreshControl = refreshControl;
  };

  requestRefresh() {
    const {refreshControl} = this;
    refreshControl && refreshControl.requestRefresh();
  }

  render() {
    const {props: {color, enableIcon, ...other}, styles} = this;
    return (
      <RefreshControlObserver {...other} ref={this.saveRef.bind(this)}>
        {({isRefreshing, isActive}) => {
          if (!enableIcon) return null
          return (
            <div className={"scr-refresh"} style={styles.iconContainer}>
              {/*{isRefreshing ? (*/}
              {/*  <Loading color={color}/>*/}
              {/*) : (*/}
              {/*  <Arrow color={color} style={styles.arrowIcon(isActive)}/>*/}
              {/*)}*/}
              {
                isRefreshing && <Loading color={color}/>
              }
            </div>
          )
        }}
      </RefreshControlObserver>
    );
  }
}

RefreshControl.propTypes = {
  isRefreshing: PropTypes.bool.isRequired,
  onRefresh: PropTypes.func,
  color: PropTypes.string,
  style: PropTypes.object,
  enableIcon: PropTypes.bool,
};

RefreshControl.defaultProps = {
  color: '#333',
  enableIcon: true
};

export default RefreshControl
