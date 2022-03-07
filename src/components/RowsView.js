import React, {Fragment} from "react"
import RowView from "./RowView";
import {EmptyView} from "components";

class RowsView extends React.Component {
  render() {
    const {rows, onSelectRow} = this.props;
    return (
      <Fragment>
        {
          rows.length === 0 ?
            <EmptyView/> :
            <div className="weui-panel weui-panel_access">
              <div className="weui-panel__bd">
                {
                  rows.map((row, i) => {
                    return (
                      <RowView
                        onSelectRow={onSelectRow}
                        row={row}
                        key={i}/>
                    )
                  })
                }
              </div>
            </div>
        }
      </Fragment>
    )
  }
}

export default RowsView
