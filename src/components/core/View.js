import React from "react";
import PropTypes from "prop-types";

function View({children, className, style}) {
  return (
    <div className={className} style={{...style}}>
      {children}
    </div>
  )
}

View.propTypes = {
  className: PropTypes.string,
  style: PropTypes.object,
};

export default View
