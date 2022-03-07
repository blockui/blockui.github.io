import React from "react"
import blockies from "./blockies"
import PropTypes from "prop-types"


class RandomIdIcon extends React.Component {

  getOpts() {
    const {size, scale, seed, color, bgcolor, spotcolor} = this.props;
    const options = {
      size: 24,
      scale: 1,
    };

    if (seed) {
      options["seed"] = seed
    }
    if (scale) {
      options["scale"] = scale
    }
    if (size) {
      options["size"] = size
    }
    if (bgcolor) {
      options["bgcolor"] = bgcolor
    }
    if (spotcolor) {
      options["spotcolor"] = spotcolor
    }
    if (color) {
      options["color"] = color
    }
    // _debug(options)
    return options;
  }

  componentDidMount() {
    this.draw();
  }

  draw() {
    blockies.render(this.getOpts(), this.canvas);
  }

  render() {
    const {className} = this.props;
    return React.createElement("canvas", {className, ref: canvas => this.canvas = canvas});
  }
}


RandomIdIcon.propTypes = {
  bgcolor: PropTypes.string,
  spotcolor: PropTypes.string,
  color: PropTypes.string,
  seed: PropTypes.string,
  scale: PropTypes.number,
  size: PropTypes.number,
}

export default RandomIdIcon;
