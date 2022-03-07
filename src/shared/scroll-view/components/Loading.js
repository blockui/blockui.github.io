import React, {Component} from 'react';
import PropTypes from 'prop-types';

const style = {transition: 'opacity 0.3s'};

export default class Loading extends Component {
  constructor(props) {
    super(props);
    this.circles = [6, 20, 34];
  }

  componentDidMount() {
    const {length} = this.circles;
    this.intervalId = setInterval(() => {
      const next = this.highlighted + 1;
      this.highlighted = next >= length ? 0 : next;
      this.forceUpdate();
    }, 300);
    this.propTypes = {
      color: PropTypes.string.isRequired,
    };
    this.highlighted = 0;
  }

  shouldComponentUpdate() {
    return false;
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  render() {
    const {props: {color}, highlighted, circles} = this;
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 40 40"
        width="32px"
        height="32px"
      >
        {circles.map((cx, index) => (
          <circle
            key={index}
            cx={cx}
            cy="20"
            r="3"
            fill={color}
            opacity={highlighted === index ? 1 : 0.2}
            style={style}
          />
        ))}
      </svg>
    );
  }
}
