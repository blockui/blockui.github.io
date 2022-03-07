import React, {Component} from "react"
//import {connect} from "react-redux"
import {WeCell, WeFormGroup} from "../../../shared/weui";
import StorageLocal from "../shared/storage_local";
import FilterDrawer from "react-modern-drawer";

const SortItem = ({sortField, sortType, setState, title, sortKey}) => {
  return (
    <WeCell
      icon={sortField === sortKey ? (sortType === 'asc' ? "sortAsc" : "sortDesc") : "FaRegCircle"}
      onClick={() => {
        const sortType_ = sortType === 'desc' ? "asc" : "desc"
        StorageLocal.set("accounts_sortType", sortType_)
        StorageLocal.set("accounts_sortField", sortKey)
        setState({
          isOpen: false,
          sortField: sortKey,
          sortType: sortType_
        })
      }} title={title} active/>
  )
}

class AccountsFilterDrawer extends Component {
  render() {
    const {isOpen, sortItems, setState, sortField, sortType, filterPlaytime} = this.props;
    return (
      <FilterDrawer
        duration={250}
        open={isOpen}
        onClose={() => {
          setState({isOpen: false})
        }}
        direction='right'
        className=''
      >
        <WeFormGroup title={"Sort"}>
          {
            sortItems.map(({sortKey, title}, i) => {
              return (
                <SortItem key={i} {...{
                  setState,
                  sortType,
                  sortField,
                  sortKey,
                  title
                }}/>
              )
            })
          }
        </WeFormGroup>
        <WeFormGroup title={"PlayTime"}>
          <WeCell
            icon={filterPlaytime === "All" ? "FaChevronCircleRight" : "FaRegCircle"}
            onClick={() => {
              StorageLocal.set("accounts_filterPlaytime", "All")
              setState({
                filterPlaytime: "All",
                isOpen: false
              })
            }} title={"All"} active/>
          <WeCell
            icon={filterPlaytime === "Today" ? "FaChevronCircleRight" : "FaRegCircle"}
            onClick={() => {
              StorageLocal.set("accounts_filterPlaytime", "Today")
              setState({
                filterPlaytime: "Today",
                isOpen: false
              })
            }} title={"Today"} active/>
          <WeCell
            icon={filterPlaytime === "Tomorrow" ? "FaChevronCircleRight" : "FaRegCircle"}
            onClick={() => {
              StorageLocal.set("accounts_filterPlaytime", "Tomorrow")
              setState({
                filterPlaytime: "Tomorrow",
                isOpen: false
              })
            }} title={"Tomorrow"} active/>
          <WeCell
            icon={filterPlaytime === "Yesterday" ? "FaChevronCircleRight" : "FaRegCircle"}
            onClick={() => {
              StorageLocal.set("accounts_filterPlaytime", "Yesterday")
              setState({
                filterPlaytime: "Yesterday",
                isOpen: false
              })
            }} title={"Yesterday"} active/>
        </WeFormGroup>
      </FilterDrawer>
    )
  }
}

AccountsFilterDrawer.propTypes = {}

//export default connect(({...state})=>{
//    return {}
//})(AccountsFilterDrawer)

export default AccountsFilterDrawer
