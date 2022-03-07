import React from "react"
import BasePage from "components/core/BasePage"
import MapView from "components/map-view/MapView";

export default class MapPage extends React.Component {

  render() {

    return (
      <BasePage title={"Map"} back>
        <MapView height={"100%"}/>
      </BasePage>
    )
  }
}
