import MapMarkerHelper from "./MapMarkerHelper";
import {getItemFromSessionStorage, setItemFromSessionStorage} from "../../functions/common";

const {L} = window

export default class MapHelper {
  static flayTo(map, {lat, lng}, marker) {
    map.flyTo([lat, lng]);
    if (marker) {
      MapMarkerHelper.setLatLng(marker, {lat, lng})
    }
  }

  static addMarkersToMap(markers, map) {
    markers.forEach((marker) => {
      const {lat, lng} = marker.getLatLng()
      const bounds = map.getBounds();
      const north = bounds.getNorth();
      const south = bounds.getSouth();
      const west = bounds.getWest();
      const east = bounds.getEast();
      if (lat < north && lat > south && lng > west && lng < east) {
        marker.addTo(map)
      } else {
        marker.remove()
      }
    })
  }

  static addMapMarker(map, {toolTip, icon, lat, lng, onClick, draggable}) {
    const marker = L.marker([lat, lng], {
      "icon": MapMarkerHelper.getIcon(icon || "default"),
      draggable: draggable || false
    })

    if (toolTip) {
      marker.bindTooltip(toolTip, {direction: "top"})
    }
    marker.on("click", () => {
      onClick && onClick()
    })
    return marker
  }

  static seedMap(map, layer) {
    const max = map.getZoom() + 1
    const min = map.getZoom() - 1
    layer.seed(map.getBounds(), min, max > 20 ? 20 : max)
  }

  static cacheMapLayerName(name) {
    setItemFromSessionStorage("map.layer", name)
  }

  static getCacheMapLayerName() {
    return getItemFromSessionStorage("map.layer", null)
  }
}

MapHelper.AddLocationIcon = "addLocation"
MapHelper.CloseIcon = "close"
MapHelper.FullScreenIcon = "fullScreen"
MapHelper.FullScreenIconExit = "fullScreenExit"
MapHelper.MyLocationIcon = "myLocation"
MapHelper.LayersIcon = "LayersRounded"
