import React, {Fragment} from "react"
import {connect} from 'react-redux'
import PropTypes from 'prop-types'

const MainController = ({children}) => {
  return (
    <Fragment>
      <div className={"app"}>
        {children}
      </div>
    </Fragment>
  )
}

MainController.propTypes = {
  loading: PropTypes.bool,
  authUser: PropTypes.object,
}

export default connect(({auth, global}) => {
  return {
    authUser: auth.user,
  }
})(MainController)
