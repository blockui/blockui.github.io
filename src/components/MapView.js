import React, {Component} from 'react'
import {Icons} from "components/Icons";
import {getConstant} from "shared/functions/common";
import WeMap from "shared/weui/WeMap";
import PropTypes from 'prop-types'

class MapView extends Component {
  constructor(props) {
    super(props);
    this.mapConstant = getConstant().map
  }

  render() {
    const {options, className, height, style, ...props} = this.props;
    const {map} = getConstant();
    const {tile, area} = map;
    const {x, y, z} = area['default'].c
    const {layers} = tile
    return (
      <WeMap
        style={{height: "100%", ...style, ...{height}}}
        options={{
          tileLayers: layers,
          defaultMapCenter: {zoom: z, lat: y, lng: x},
          Icons: Icons,
          className,
          ...options,
        }} {...props}/>
    )
  }
}

MapView.propTypes = {
  height: PropTypes.any,
  className: PropTypes.string,
  options: PropTypes.object,
  style: PropTypes.object
}


export default MapView;
