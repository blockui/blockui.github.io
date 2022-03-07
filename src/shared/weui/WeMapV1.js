import React, {Component, Fragment} from 'react'
import cls from 'classnames'
import * as PropTypes from "prop-types";
import "shared/leaflet/L.TileLayer.cache"
import "shared/leaflet/L.TileLayer.PouchDBCached"
import MapMarkerHelper from "../BD/helper/MapMarkerHelper";
import MapHelper from "../BD/helper/MapHelper";

const {L} = window

function ControlsBox({position, items}) {
  if (!items) return null;
  let className;
  switch (position) {
    case "leftTop":
      className = "left top"
      break;
    case "leftBottom":
      className = "left bottom"
      break;
    case "rightTop":
      className = "right top"
      break;
    case "rightBottom":
    default:
      className = "right bottom"
      break;
  }
  return (
    <div className={"map-ctl " + className}>
      {
        items && items.map(({icon, onClick}, i) => {
          return (
            <div key={i + icon} className="map-ctl-action" onClick={onClick}>
              {icon}
            </div>
          )
        })
      }
    </div>
  )
}

function Controls({controls}) {
  const {leftTop, leftBottom, rightTop, rightBottom} = controls || {}
  return (
    <Fragment>
      <ControlsBox position={"leftTop"} items={leftTop}/>
      <ControlsBox position={"leftBottom"} items={leftBottom}/>
      <ControlsBox position={"rightTop"} items={rightTop}/>
      <ControlsBox position={"rightBottom"} items={rightBottom}/>
    </Fragment>
  );
}

class WeMap extends Component {
  constructor(props) {
    super(props);
    this.map = null;
    this.marker = null;
    this.resizeObserver = null
    this.tileLayers = props.tileLayers
    this.defaultOptions = props.defaultOptions
    this.state = {
      mapId: `map_${+(new Date())}`
    }
    this.options = {
      addMarkerWhenMapReady: false,
      isSeed: false,
      zoom: this.defaultOptions.zoom,
      center: {...this.defaultOptions.center},
      onMapReady: () => {
      },
      onChangeLayer: () => {
      },
      map: {
        zoomControl: false,
      },
      marker: {
        draggable: false,
        opacity: 1,
        zIndexOffset: 1003,
        icon: MapMarkerHelper.getIcon(this.defaultOptions['markerIcon'] || "red")
      },
      layer: {
        useCache: true,
        crossOrigin: true,
        maxZoom: 20,
        minZoom: 7,
      }
    };
  }

  shouldComponentUpdate(nextProps, nextState, nextContext) {
    const {options} = nextProps;
    if (options && options.center && this.map) {
      const {lat, lng} = options.center
      const center = this.map.getCenter()
      if (center.lat !== lat || center.lng !== lng) {
        MapHelper.flayTo(this.map, {lat, lng}, this.marker)
      }
    }
    return true;
  }

  componentWillUnmount() {
    this.map && this.map.remove()
    this.map = null;
    this.marker = null;
    if (this.resizeObserver) {
      this.resizeObserver.disconnect()
      this.resizeObserver = null
    }
  }

  initMap() {
    const options = {
      ...this.options,
      ...this.props.options
    }
    const {mapId} = this.state;

    if (this.map) {
      this.map.remove()
    }
    this.map = L.map(mapId, {
      ...this.options.map,
      ...options.map
    })
      .setView(options.center, options.zoom)
      .on("baselayerchange", ({name, layer}) => {
        options.onChangeLayer && options.onChangeLayer(layer, name)
        MapHelper.cacheMapLayerName(name)
        if (options.isSeed) {
          MapHelper.seedMap(this.map, layer)
        }
        layer.on('tilecachehit', () => {
          //console.log(name,'Cache hit: ', ev.url);
        });
        layer.on('tilecachemiss', () => {
          //console.log(name,'Cache miss: ', ev.url);
        });
        layer.on('tilecacheerror', (ev) => {
          console.log(name, 'Cache error: ', ev.tile, ev.error);
        });
        layer.on('seedprogress', (seedData) => {
          //const percent = 100 - Math.floor(seedData.remainingLength / seedData.queueLength * 100);
          //console.log(name+ ' Seeding ' + percent + '% done');
        });
        layer.on('seedend', function (seedData) {
          //console.log(name+ ' Cache seeding complete');
        });
      });
    const layerKeys = Object.keys(this.tileLayers)
    if (layerKeys.length === 0) {
      throw Error("can not found titleLayers")
    }

    const baseLayers = {}
    const layerOptions = {
      ...this.options.layer,
      ...options.layer
    }
    let defaultLayer = layerKeys[0]
    layerKeys.forEach((layerKey) => {
      baseLayers[layerKey] = L.tileLayer(this.tileLayers[layerKey], layerOptions)
    })
    L.control.layers(baseLayers, {}).setPosition("topright").addTo(this.map);
    const localDefaultLayer = MapHelper.getCacheMapLayerName()
    const defaultLayer_ = localDefaultLayer ? localDefaultLayer : defaultLayer
    const layerObj = baseLayers[defaultLayer_]
    layerObj.addTo(this.map);
    this.resizeObserver = new ResizeObserver(() => {
      this.map && this.map.invalidateSize();
    });
    this.resizeObserver.observe(document.getElementById(mapId));
    const markOptions = {
      ...this.options.marker,
      ...options.marker,
    }
    if (typeof markOptions.icon === "string") {
      markOptions.icon = MapMarkerHelper.getIcon(markOptions.icon)
    }

    this.marker = L.marker({
      ...options.center,
      ...options.marker.position
    }, markOptions)

    options.onMapReady({
      map: this.map,
      marker: this.marker,
      layer: layerObj,
      baseLayers,
      defaultLayer: defaultLayer_
    })
  }

  componentDidMount() {
    this.initMap()
  }

  render() {
    const {
      className,
      loading,
      defaultOptions,
      controls,
      defaultCenter,
      tileLayers,
      Icons,
      options,
      height,
      style,
      ...props
    } = this.props;

    const classNames = cls(
      "weui-map",
      "bd-map",
      className,
    )
    return (
      <div className={classNames} style={{height: "100%", ...style, ...{height}}} {...props}>
        <div id={this.state.mapId} className={"weui-map-container"}/>
        <Controls controls={controls}/>
      </div>
    )
  }
}

WeMap.propTypes = {
  isSeed: PropTypes.bool,
};

export default WeMap;
