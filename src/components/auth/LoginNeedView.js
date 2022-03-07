import React, {Component} from 'react'
import {connect} from 'react-redux';

export default connect(() => {
  return {}
})(class extends Component {
  render() {
    return (
      <div className={"page-full-notice"}>
        {/*{*/}
        {/*  this.props.back &&*/}
        {/*  <TopAction icon={"back"} left/>*/}
        {/*}*/}

        {/*<div className={"big-icon"}>*/}
        {/*  {*/}
        {/*    Icons['login']*/}
        {/*  }*/}
        {/*</div>*/}
        {/*<WeButton primary onClick={() => {*/}
        {/*  setStoreState("global", {*/}
        {/*    showLoginView: true*/}
        {/*  })*/}
        {/*}}>请先登录</WeButton>*/}
      </div>
    )
  }
});
