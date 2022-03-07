import React from "react"
import PropTypes from 'prop-types'
import {Icons} from "components/Icons";

const AlertInfoView = ({message, children, type}) => {
  let Icons_ = {
    error: Icons['ErrorOutline'],
    warning: Icons['WarningAmberOutlined'],
    info: Icons['InfoOutlined'],
    success: Icons['CheckCircleOutline']
  }
  let icon_ = Icons_[type] || Icons_['info']
  return (
    <div className={"alert-info-view alert-" + type}>
      <div className="icon">{icon_}</div>
      <div className="message">
        {
          message && <span>{message}</span>
        }
        {
          children && <span>{children}</span>
        }
      </div>
    </div>
  )
}


AlertInfoView.propTypes = {
  children: PropTypes.any,
  message: PropTypes.string,
  type: PropTypes.string
}

export default AlertInfoView
