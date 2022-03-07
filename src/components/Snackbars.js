import React, {Fragment} from "react";
import Snackbar from "@material-ui/core/Snackbar";
import {dispatchStore} from "components/core/App";

const Snackbars = ({snackbars, snackbarsMaxNum}) => {
  return (
    <Fragment>
      {
        snackbars && snackbars.slice(0, snackbarsMaxNum).map(({id, open, message, autoHideDuration}, i) => {
          return (
            <Snackbar
              style={{bottom: ((48 + 12) * i + 12)}}
              key={id}
              open={open}
              onClick={() => {
                dispatchStore("global", "removeSnackbar", {
                  id
                })
              }}
              autoHideDuration={autoHideDuration}
              message={message}
            />
          )
        })
      }
    </Fragment>
  )
}

export default Snackbars
