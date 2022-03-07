import React, {Fragment} from "react"
import {clearBodyOverflowHidden, locationHash, parseGeo, setBodyOverflowHidden} from "shared/functions/common";

import {handleCatSearch} from "shared/functions/cat";
import WeCell from "shared/weui/WeCell";
import {setStoreState} from "components/core/App";
import {getConstant} from 'shared/functions/common'
import UploadView from "components/UploadView";
import MapView from "./MapView";
import WeCellSelect from "shared/weui/WeCellSelect";
import weui from "shared/weui-js";
import {PortalView} from "./core/BasePage";
import WeSearchBar from "shared/weui/WeSearchBar";
import config from "config";

class FormViewItem extends React.Component {
  constructor(props) {
    super(props);
    setStoreState("global", {input: {}})
    this.state = {
      showCatSearch: false,
      searchCatVal: "",
      searchCatResult: [],
      py: {},
      items: []
    }
  }

  onCatSearchChange(searchCatVal) {
    const {picker_scroll} = this
    const {items, py} = this.state
    this.setState({
      searchCatVal,
      searchCatResult: []
    })
    handleCatSearch({
      items,
      searchCatVal,
      py,
      picker_scroll
    })
  }

  onShowSelectCat(row, field_name, items, py) {
    setBodyOverflowHidden()
    const {namespace} = this.props;
    let defaultValue;
    let val = row[field_name]
    if (val && val.length > 0 && val.indexOf(",") > 0) {
      defaultValue = val.split(",")
    }
    weui.picker(items, {
      defaultValue,
      className: "cat-search-picker",
      onConfirm: ([catRes, subCatRes]) => {
        const {searchCatResult} = this.state;
        let cat = catRes.label;
        let subCat = subCatRes.label;
        if (searchCatResult.length > 0) {
          cat = searchCatResult[0];
          subCat = searchCatResult[1]
        }
        setStoreState(namespace, {
          row: {
            ...row,
            cat,
            subCat,
            [field_name]: `${cat},${subCat}`,
          }
        })
      },
      onClose: () => {
        clearBodyOverflowHidden()
        this.setState({
          showCatSearch: false,
          searchCatVal: "",
          searchCatResult: [],
          items: [], py: {}
        })
      },
      onReady: ($picker, {picker_scroll}) => {
        this.picker_scroll = picker_scroll
      }
    });

    this.setState({
      showCatSearch: true,
      searchCatVal: "",
      searchCatResult: [],
      items, py
    })
  }

  render() {
    const {field, row, fields, onMapReady, namespace} = this.props;
    let {placeholder, type, field_name} = field
    let val = row[field_name] || "";
    const onClick = () => {
      setStoreState("global", {
        input: {
          field: field_name,
          ...fields[field_name],
          value: row[field_name],
        }
      })
      locationHash(`InputPage`)
    }

    if (typeof field["enum"] === 'string') {
      const constant = getConstant()
      let items = []
      let py = {}
      if (field["enum"] === "chances.cats") {
        items = constant['chances']['cats']
        py = constant['chances']['py']
      }
      if (field["enum"] === "marks.cats") {
        items = constant['marks']['cats']
        py = constant['marks']['py']

      }
      if (val.length === 0) {
        val = (row['cat'] || "") + "," + (row['subCat'] || "");
        if (val === ",") {
          val = "";
        }
      }
      return (
        <Fragment>
          {
            this.state.showCatSearch &&
            <PortalView selector={config.ui.CatSearchPickSelector}>
              <WeSearchBar onChangeSearchValue={this.onCatSearchChange.bind(this)}/>
            </PortalView>
          }

          <WeCellSelect
            key={field_name}
            textRight
            foot={val}
            placeholder={placeholder}
            title={fields[field_name].label}
            onClick={this.onShowSelectCat.bind(this, row, field_name, items, py)}/>
        </Fragment>
      )
    }
    switch (type) {
      case "geo":
        const mapHeight = "180px"
        return (
          <WeCell key={field_name}
                  onClick={onClick}
                  title={fields[field_name].label}
                  placeholder={placeholder}
                  foot={""}
                  subCell={(
                    (row[field_name] && row[field_name].length > 0) ?
                      <MapView
                        options={{
                          onMapReady,
                          center: parseGeo(row[field_name]),
                          marker: {
                            icon: "red",
                            position: parseGeo(row[field_name])
                          },
                          showMapInfo: true,
                          layer: {userCache: true}
                        }}
                        style={{height: mapHeight}}/> : null
                  )} access/>
        )
      case "upload":
        const pics = row[field_name] || "[]"
        return (
          <WeCell key={field_name}
                  title={fields[field_name].label}
                  placeholder={placeholder}
                  foot={""}
                  subCell={(
                    <UploadView
                      onChange={(files) => {
                        const {row} = this.props;
                        setStoreState(namespace, {
                          row: {
                            ...row,
                            files
                          }
                        })
                      }}
                      files={JSON.parse(pics)}/>)}/>
        )
      case "textarea":
        return (
          <WeCell key={field_name}
                  onClick={onClick}
                  title={fields[field_name].label}
                  placeholder={placeholder}
                  foot={""}
                  subCell={(row[field_name] && row[field_name].length > 0 ?
                    <pre className={"pl_16"}>{row[field_name]}</pre> : null)}
                  active
                  access/>
        )
      default:
        return (
          <WeCell key={field_name}
                  onClick={onClick}
                  placeholder={placeholder}
                  foot={val}
                  title={fields[field_name].label}
                  active
                  access/>
        )
    }
  }
}

export default FormViewItem
