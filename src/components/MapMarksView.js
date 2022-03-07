import React from "react"
import {connect} from "react-redux"
import {setStoreState} from "components/core/App";
import MapView from "components/MapView";
import {historyBackAction} from "shared/functions/common";
import {addMapMarker, getMarkIcon} from "shared/weui/WeMap";
import {getShopsPDb} from "shared/functions/pdb";
import SwiperMapMarksView from "./SwiperMapMarksView";

export default connect(({global, constant, position}) => {
  const {x, y, z} = constant.map.area['default'].c
  return {
    curArea: position.curArea,
    currentPosition: global.currentPosition || {zoom: z, lat: y, lng: x}
  }
})(class extends React.Component {
  constructor(props) {
    super(props);
    this.db = getShopsPDb()
    this.markers = []
    this.selectedMarkerIndex = -1;

    this.state = {
      showMarkInfo: false
    }
  }

  shouldComponentUpdate({rows, cat, subCat}, nextState, nextContext) {
    if (subCat !== this.props.subCat || cat !== this.props.cat) {
      this.cleanMarkers();
      this.addMarkers(rows)
      this.addMarkersToMap()
      this.onClickMarker(0)
    }
    return true;
  }

  componentWillUnmount() {
    historyBackAction(null)
    this.cleanMarkers();
  }

  cleanMarkers() {
    if (this.markers.length > 0) {
      this.markers.forEach(marker => {
        marker.remove()
      })
    }
    this.markers = []
  }

  addMarkersToMap() {
    this.markers.forEach((marker, i) => {
      const {lat, lng} = marker.getLatLng()
      const bounds = this.map.getBounds();
      const north = bounds.getNorth();
      const south = bounds.getSouth();
      const west = bounds.getWest();
      const east = bounds.getEast();
      if (lat < north && lat > south && lng > west && lng < east) {
        marker.addTo(this.map)
      } else {
        marker.remove()
      }
    })
  }

  setMapInfo(map) {
    const {lat, lng} = map.getCenter();
    const zoom = map.getZoom();
    this.addMarkersToMap()
    setStoreState("global", {
      currentPosition: {
        lat, lng, zoom
      }
    })
  }

  onClickMarker(index) {
    if (this.markers.length === 0) {
      return;
    }
    if (this.selectedMarkerIndex > -1 && this.markers.length > 0) {
      this.markers[this.selectedMarkerIndex].setIcon(getMarkIcon("gray")).setZIndexOffset(1000)
    }

    this.setState({
      sliderActiveIndex: index
    })
    this.selectedMarkerIndex = index
    const marker = this.markers[index]
    marker.setIcon(getMarkIcon("red")).setZIndexOffset(1001);
    this.map.flyTo(marker.getLatLng())
    this.setState({showMarkInfo: true})
  }

  addMarkers(rows) {
    this.markers = []
    rows.forEach(({lat, lng}, i) => {
      //console.log(lat,lng)
      const marker = addMapMarker(this.map, {lat, zIndexOffset: 1000, lng, icon: "gray"})
      marker.on("click", () => {
        this.onClickMarker(i)
      })
      this.markers.push(marker)
    })
  }

  onMapReady(map) {
    this.map = map;
    const {rows} = this.props;
    this.addMarkers(rows)
    this.setMapInfo(map)
    if (rows.length > 0) {
      this.onClickMarker(0)
    }
    map.on("zoom", () => {
      this.setMapInfo(this.map)
    }).on("dragend", () => {
      this.setMapInfo(this.map)
    }).on("click", () => {
      this.resetMarker()
    })
  }

  resetMarker() {
    if (this.selectedMarkerIndex > -1) {
      this.markers[this.selectedMarkerIndex].setIcon(getMarkIcon("gray"))
      this.setState({showMarkInfo: false})
    }
  }

  onSelectRow(row) {
    this.props.onSelectRow(this.db, row)
  }

  onChangeSwiper(index) {
    if (this.markers.length > 1) {
      this.onClickMarker(index)
    }
  }

  render() {
    const {curArea, currentPosition, getHeightOffset} = this.props;
    const heightOffset = getHeightOffset()
    const height = `calc(100vh - ${heightOffset}px)`
    return (
      <React.Fragment>
        <MapView
          style={{height}}
          options={{
            mapId: `map_${+(new Date())}`,
            showMapInfo: false,
            center: {
              ...currentPosition,
              zoom: 16
            },
            layer: {userCache: true},
            onMapReady: this.onMapReady.bind(this),
            onChangeLayer: (layer) => this.layer = layer,
            controls: [
              {
                position: "bottom-right",
                bars: [
                  {
                    icon: "myLocation",
                    hide: true,
                    onClick: () => {
                      const {x, y} = curArea.c;
                      this.map.flyTo([y, x])
                    }
                  }
                ],
              }
            ]
          }}/>
        <SwiperMapMarksView
          onSelectSlideItem={this.onSelectRow.bind(this)}
          activeIndex={this.state.sliderActiveIndex}
          onChange={this.onChangeSwiper.bind(this)}
          items={this.props.rows}/>
      </React.Fragment>
    )
  }

})
