import createStyles from './Hook.styles';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import ScrollObserver from './ScrollObserver';

class Hook extends Component {
  constructor(props) {
    super(props);
    this.styles = createStyles();
  }

  render() {
    const {props: {style, ...other}, styles} = this;
    return (
      <ScrollObserver {...other}>
        {({ref}) => (
          <div
            // role="none"
            aria-label="react-scroll-hook"
            ref={ref}
            style={styles.hook(style)}
          />
        )}
      </ScrollObserver>
    );
  }
}

Hook.propTypes = {
  style: PropTypes.object,

}
export default Hook
