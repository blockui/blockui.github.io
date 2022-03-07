import React, {Fragment} from "react"
import {parseGeo} from "shared/functions/common";
import {setStoreState} from "components/core/App";
import FormViewItem from "./FormViewItem";
import {WeFormGroup} from "shared/weui/WeForm";

class FormView extends React.Component {
  constructor(props) {
    super(props);
    setStoreState("global", {input: {}})
  }

  componentWillUnmount() {
    setStoreState("global", {input: {}})
  }

  shouldComponentUpdate({input}, nextState, nextContext) {
    const {value, type, children, field} = input
    const {row, namespace} = this.props;
    if (field && field.length > 0 && row[field] !== value) {
      const obj = {
        [field]: value
      }
      if (children) {
        if (type === "geo") {
          const {lat, lng} = parseGeo(value)
          this.map && this.map.flyTo([lat, lng])
          this.marker && this.marker.setLatLng({lat, lng})
          obj["lat"] = lat
          obj["lng"] = lng

        } else {
          if (value.length > 0 && value.indexOf(",") > 0) {
            const [f1, f2] = children.split(",")
            const [v1, v2] = value.split(",")
            obj[f1] = v1
            obj[f2] = v2
          }
        }
      }
      const newRow = {
        ...row,
        ...obj
      };
      // _debug("===>>",input, value,obj,newRow)
      setStoreState(namespace, {row: newRow})
    }
    return true
  }

  formatRows() {
    const {fields} = this.props;
    let hasGroup = false
    let items = {}
    const rows = Object.keys(fields)
      .filter(field_name => !fields[field_name].ignore_dpl)
      .map(field_name => {
        if (fields[field_name].g) {
          hasGroup = true;
        }
        return (
          {field_name, ...fields[field_name]}
        )
      })
    if (hasGroup) {
      rows.forEach(row => {
        if (row.g) {
          if (!items[row.g]) {
            items[row.g] = []
          }
          items[row.g].push(row)
        } else {
          if (!items["base"]) {
            items["base"] = []
          }
          items["base"].push(row)
        }
      })
    }
    return {rows, groupItems: items, hasGroup}
  }

  renderRows(rows, title) {
    const {fields, namespace, row} = this.props;
    return (
      <WeFormGroup title={title === "base" ? "" : title}>
        {
          rows
            .sort((a, b) => {
              return a.i - b.i
            })
            .map((field, i) => {
              return <FormViewItem field={field}
                                   key={i}
                                   onMapReady={(map, marker) => {
                                     this.map = map;
                                     this.marker = marker;
                                   }}
                                   namespace={namespace}
                                   row={row}
                                   fields={fields}/>
            })
        }
      </WeFormGroup>
    )
  }

  renderGroupRows(groupItems) {
    return (
      <React.Fragment>
        {
          Object.keys(groupItems).map(key => {
            return (
              <Fragment key={key}>
                {this.renderRows(groupItems[key], key)}
              </Fragment>
            )
          })
        }
      </React.Fragment>
    )
  }

  render() {
    const {rows, groupItems, hasGroup} = this.formatRows()
    if (hasGroup) {
      return this.renderGroupRows(groupItems)
    } else {
      return this.renderRows(rows)
    }
  }
}

export default FormView
