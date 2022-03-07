import React, {Component, Fragment} from "react";
import {connect} from "react-redux";
import "./style.scss"

export default connect(({global}) => {
  return {
    global
  }
})(class extends Component {
    render() {
      return (
        <Fragment>
          Hello
        </Fragment>
      )
    }
  }
)
