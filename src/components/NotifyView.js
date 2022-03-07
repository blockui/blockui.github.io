import {connect} from "react-redux";
import React from "react";
import {diffObject} from "shared/functions/common";
import PropTypes from "prop-types";

const NotifyView = connect(({notify}) => {
  return {messages: notify.messages}
})(class extends React.Component {
  shouldComponentUpdate(nextProps, nextState, nextContext) {
    const {namespace, id, messages} = this.props;
    if (diffObject(messages, nextProps.messages)) {
      let _id;
      if (id) {
        _id = `${namespace}.${id}`
      } else {
        _id = namespace
      }
      if (this.props.onUpdate && nextProps.messages[_id] !== messages[_id]) {
        setTimeout(() => {
          this.props.onUpdate(nextProps.messages[_id], _id)
        }, 10)
      }
    }
    return false;
  }

  render() {
    return null
  }
})


NotifyView.propTypes = {
  namespace: PropTypes.string,
  messages: PropTypes.object,
  id: PropTypes.string,
  onUpdate: PropTypes.func
}

export default NotifyView
