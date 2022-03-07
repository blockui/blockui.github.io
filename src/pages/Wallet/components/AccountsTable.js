import React, {Component} from "react"
//import {connect} from "react-redux"
import PropTypes from 'prop-types'
import {Link, Table, Tbody, Td, Tfoot, Th, Thead, Tr} from "@chakra-ui/react";
import {todayStartTimestamp} from "../../../shared/functions/date";
import {ModelBswGame} from "../shared/model_bsw_game";
import {pageJump} from "../../../shared/functions/common";
import {setState} from "jest-circus/build/state";

class AccountsTable extends Component {
  render() {
    const {accounts, showDrawer,sortType, filterPlaytime, searchValue, sortField} = this.props;
    return (
      <div>

      </div>
    )
  }
}

AccountsTable.propTypes = {
  accounts: PropTypes.array
}

//export default connect(({...state})=>{
//    return {}
//})(AccountsTable)

export default AccountsTable
