import React, {Fragment} from "react";
import PropTypes from "prop-types"
import WeCells from "../shared/weui/WeCells";
import {randomColor} from "../shared/functions/color";
import BadgeHelper from "../shared/BD/helper/BadgeHelper";
import WeButtonCell from "../shared/weui/WeButtonCell";
import WeCell from "../shared/weui/WeCell";
import BDApp from "../shared/BD/BDApp";

const CellsView = ({items, actions, cellClassname}) => {
  return (
    <Fragment>
      {
        items.map((cells, i) => {
          return (
            <WeCells className={cellClassname} key={i}>
              {
                cells.map(({hide, onlyChr, onlyDebug, button, icon, action, title, to, hash, badgeDot}, k) => {
                  const props = {
                    hide,
                    icon,
                    title,
                    active: "true",
                    access: "true",
                    iconColor: randomColor(to)
                  }
                  if (to) {
                    props['to'] = "#" + to
                  }
                  if (action && actions[action]) {
                    props['onClick'] = actions[action]
                  }

                  if (badgeDot) {
                    props['badgeDot'] = BadgeHelper.check
                  }
                  if (onlyDebug) {
                    props['hide'] = !BDApp.isDebug()
                  }

                  if (onlyChr) {
                    props['hide'] = !BDApp.isChrPlatform()
                  }
                  if (button) {
                    return (
                      <WeButtonCell key={k} {...props}>{title}</WeButtonCell>
                    )
                  } else {
                    return (
                      <WeCell key={k} {...props}/>
                    )
                  }

                })
              }
            </WeCells>
          )
        })
      }
    </Fragment>
  )
}

CellsView.propType = {
  cellClassname: PropTypes.string,
  items: PropTypes.array,
  actions: PropTypes.object
}

export default CellsView
