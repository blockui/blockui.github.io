import React, {Component, Fragment} from 'react'
import PropTypes from "prop-types";
import {Icons} from "components/Icons";
import PopMenus from "./pop-menus/PopMenus";
import {_debug,  getConstant} from "shared/functions/common";
import WeMapV1 from "shared/weui/WeMapV1";
import MapHelper from "shared/BD/helper/MapHelper";
import GeoHelper from "shared/BD/helper/GeoHelper";
import MapMarkerHelper from "shared/BD/helper/MapMarkerHelper";
import {WeSearchBar} from "shared/weui";
import "./style.scss"
import BDConstant from "../../shared/BD/BDConstant";

const Loading = ({loading}) => {
  if (!loading) return null;
  return (
    <div className="map-loading">
      <div className={"loading-icon"}>
        <i className="weui-loading"/>
      </div>
    </div>
  )
}

class MapView extends Component {
  constructor(props) {
    super(props);
    const {defaultOptions} = getConstant().map
    const mapLayers = BDConstant.server("mapLayers")
    this.defaultOptions = defaultOptions
    this.mapLayers = mapLayers
    this.state = {
      loading: false,
      fullScreen: false
    }
    this.map = null
    this.marker = null
    this.layer = null
    this.mapHasInitMarker = false;
    this.searchFocused = false;
  }

  onFullScreen() {
    const fullScreen = !this.state.fullScreen
    const {options} = this.props;
    options.onFullScreen && options.onFullScreen(fullScreen)
    this.setState({
      fullScreen
    })
  }

  onChangeLayers(layName, i) {
    window.$(".leaflet-control-layers-base").find("input")[i].click()
  }

  onGetMyLocation() {
    if (this.state.loading) return;
    const {onGetMyLocationFinish, onGettingMyLocation} = this.props.options || {}
    this.setState({loading: true}, () => {
      onGettingMyLocation && onGettingMyLocation(true)
      GeoHelper.onGetMyLocation().then(({lat, lng}) => {
        _debug("onGetMyLocation", {lat, lng})
        MapHelper.flayTo(this.map, {lat, lng}, this.marker)
        onGetMyLocationFinish && onGetMyLocationFinish({lat, lng}, null)
      }).catch((e) => {
        console.error("onGetMyLocation", e)
        //showToastText("获取位置失败")
        onGetMyLocationFinish && onGetMyLocationFinish({}, e)
      }).finally(() => {
        this.setState({loading: false})
        onGettingMyLocation && onGettingMyLocation(false)
      })
    })
  }

  onMapReady({map, marker, layer, baseLayers, defaultLayer}) {
    const {
      autoGetMyLocationOnReady,
      addMarkerWhenMapReady,
      onMapReady,
      onMapClicked,
      onMarkerClicked,
      onMarkerDragend,
      onDragEnd,
      onMoveEnd
    } = this.props.options || {}
    this.map = map
    this.marker = marker
    this.layer = layer
    this.baseLayers = baseLayers
    if (autoGetMyLocationOnReady) {
      this.onGetMyLocation()
    }
    this.map.on("click", (e) => {
      if (this.searchFocused) return;
      const {lat, lng} = e.latlng
      const {
        addMarkerWhenMapClick
      } = this.props.options || {}
      if (addMarkerWhenMapClick && this.marker) {
        this.marker.addTo(this.map)
        this.mapHasInitMarker = true;
        MapMarkerHelper.setLatLng(this.marker, {lat, lng})
      }
      onMapClicked && onMapClicked({lat, lng}, e)
    })

    this.marker.on("click", (e) => {
      const {lat, lng} = e.latlng
      onMarkerClicked && onMarkerClicked({lat, lng}, e)
    })

    this.marker.on("dragend", (e) => {
      const {lat, lng} = e.target.getLatLng()
      onMarkerDragend && onMarkerDragend({lat, lng, dist: e.distance}, e)
    })

    this.map.on("dragend", (e) => {
      const {lat, lng} = e.target.getCenter()
      const {
        moveMarkerOnMapDrag
      } = this.props.options || {}
      if (this.mapHasInitMarker && moveMarkerOnMapDrag && this.marker) {
        this.marker.addTo(this.map)
        MapMarkerHelper.setLatLng(this.marker, {lat, lng})
      }
      onDragEnd && onDragEnd({lat, lng}, e)
    }).on("moveend", (e) => {
      const {lat, lng} = e.target.getCenter()
      onMoveEnd && onMoveEnd({lat, lng}, e)
    })

    if (addMarkerWhenMapReady) {
      this.marker.addTo(this.map)
      this.mapHasInitMarker = true;
    }
    onMapReady && onMapReady({map, marker, layer, baseLayers, defaultLayer})
  }

  render() {
    const {controls, loading, showLoading, height, options, mapSearchOptions, ...props} = this.props
    const controls_ = {}
    controls && Object.keys(controls).forEach((key) => {
      const items = []
      controls[key].forEach(row => {
        let onClick = row.onClick
        let isFullScreenIcon = false
        if (MapHelper.FullScreenIcon === row.icon) {
          onClick = this.onFullScreen.bind(this)
          isFullScreenIcon = true
        }
        if (MapHelper.LayersIcon === row.icon) {
          const layersIcon = {
            "地图": "MapsHomeWorkOutlined",
            "卫星": "map"
          }
          const menus = []
          Object.keys(this.mapLayers).forEach((layerName, i) => {
            menus.push({
              icon: layersIcon[layerName],
              label: layerName,
              onClick: this.onChangeLayers.bind(this, layerName, i)
            },)
          })
          row.icon = (
            <PopMenus icon={row.icon} menus={menus}/>
          )
        }
        if (MapHelper.MyLocationIcon === row.icon) {
          onClick = this.onGetMyLocation.bind(this)
        }
        let icon = typeof row.icon === "string" ? Icons[row.icon] : row.icon
        if (isFullScreenIcon) {
          icon = !this.state.fullScreen ? Icons[MapHelper.FullScreenIcon] : Icons[MapHelper.FullScreenIconExit]
        }
        items.push({
          ...row,
          icon,
          onClick
        })
      })
      controls_[key] = items
    })
    return (
      <Fragment>
        {
          mapSearchOptions &&
          <WeSearchBar {...mapSearchOptions} {...{
            onFocus: () => {
              this.searchFocused = true;
              mapSearchOptions.onFocus && mapSearchOptions.onFocus()
            },
            onBlur: () => {
              setTimeout(() => {
                this.searchFocused = false;
              }, 200)
              mapSearchOptions.onBlur && mapSearchOptions.onBlur()
            }
          }
          } className={"map-search-bar"}/>
        }
        {
          showLoading &&
          <Loading loading={this.state.loading ? this.state.loading : loading}/>
        }

        <WeMapV1
          controls={controls_}
          options={{
            ...options,
            onMapReady: this.onMapReady.bind(this)
          }}
          tileLayers={this.mapLayers}
          defaultOptions={this.defaultOptions}
          Icons={Icons}
          height={this.state.fullScreen ? "100%" : height}
          {...props}/>
      </Fragment>
    )
  }
}

MapView.propTypes = {
  showLoading: PropTypes.bool,
  loading: PropTypes.bool,
  controls: PropTypes.object,
  height: PropTypes.any,
  options: PropTypes.object,
  mapSearchOptions: PropTypes.object
}


export default MapView;
