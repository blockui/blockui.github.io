import Portal from "@material-ui/core/Portal";
import React from "react";
import PropTypes from "prop-types";

function PortalView({selector, children}) {
  return (
    <Portal container={document.querySelector(selector)}>
      {children}
    </Portal>
  )
}

PortalView.propTypes = {
  selector: PropTypes.string,
}
export default PortalView
