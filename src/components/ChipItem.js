import Chip from "@material-ui/core/Chip";
import {setStoreState} from "components/core/App";
import React from "react";
import PropTypes from "prop-types"

const ChipItem = ({item, hideDel, onClick, color, namespace}) => {
  const key = Object.keys(item)[0]
  if (!item[key] || item[key].length === 0) return null
  return (
    <Chip
      color={color}
      size="small"
      label={item[key]}
      onClick={onClick ? onClick : undefined}
      onDelete={hideDel ? undefined : () => setStoreState(namespace, {[key]: null})}
    />
  )
}

ChipItem.propType = {
  namespace: PropTypes.string,
  item: PropTypes.object
}

export default ChipItem
