import React from "react"
import BasePage from "components/core/BasePage"
import _ from "config/lang";
import {WeFormGroup, WeFormInput, WeFormTextArea} from "shared/weui/WeForm";
import {connect} from "react-redux";
import {setStoreState} from "components/core/App";
import {getAppBarHeight, historyBack, parseGeo} from "shared/functions/common";
import {WeCells} from "shared/weui";
import MapView from "./MapView";
import {getMarkIcon} from "shared/weui/WeMap";

class Page extends React.Component {
  constructor(props) {
    super(props);
    this.state = props.input
  }

  onChangeValue({target}) {
    this.setState({
      value: target.value
    })
  }

  render() {
    return (
      <BasePage title={_(this.state.label)}
                right={[{
                  button: "下一步",
                  onClick: () => {
                    setStoreState("global", {input: this.state})
                    historyBack()
                  }
                }]}
                left={[{icon: "back"}]}>
        {this.renderView()}
      </BasePage>
    )
  }

  onMapReady(map, marker) {
    const {lat, lng} = map.getCenter();
    this.setState({value: `${lat},${lng}`})
    map.on("drag", () => {
      const {lat, lng} = map.getCenter();
      marker.setLatLng([lat, lng])
      this.setState({value: `${lat},${lng}`})
    })
    marker.setIcon(getMarkIcon("red"));
  }

  renderView() {
    const {input} = this.props;
    const {type} = input
    if (type === "geo") {
      const mapHeight = `calc(100vh - ${getAppBarHeight()}px)`
      return (
        <MapView
          options={{
            center: parseGeo(this.state.value),
            marker: {
              position: parseGeo(this.state.value)
            },
            onMapReady: this.onMapReady.bind(this),
            showMapInfo: true,
            layer: {userCache: true}
          }}
          style={{height: mapHeight}}/>
      );
    } else if (type === "textarea") {
      return (
        <WeCells className={"mt_8"}>
          <WeFormGroup className={"mt_0"} titleClassName={"font_12 color_1"}
                       title={this.state.desc}>
            <WeFormTextArea onChange={this.onChangeValue.bind(this)}
                            label={""}
                            value={this.state.value || ""}
                            placeholder={this.state.placeholder || "请输入"}/>
          </WeFormGroup>
        </WeCells>
      );
    } else if (0 && input["set"] !== undefined) {
      //todo
      // let items = []
      // if (typeof input["set"] === "object") {
      //     Object.keys(input["enum"]).forEach(value => {
      //         items.push({
      //             label: input["enum"][value],
      //             value,
      //         })
      //     })
      //     return (
      //         <WeCellsRadio className={"mt_8"} items={items}/>
      //     );
      // }
    } else {
      return (
        <WeCells className={"mt_8"}>
          <WeFormGroup className={"mt_0"} titleClassName={"font_12 color_1"}
                       title={this.state.desc}>
            <WeFormInput onChange={this.onChangeValue.bind(this)}
                         label={""}
                         value={this.state.value || ""}
                         placeholder={this.state.placeholder || "请输入"}/>
          </WeFormGroup>
        </WeCells>
      );
    }
  }
}

export default connect(({global}) => {
  return {input: global.input}
})(Page)
