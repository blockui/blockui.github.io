import React, {Component} from "react";
import {connect} from "react-redux";
import BasePage from "components/core/BasePage";
import {WeFormGroup} from "shared/weui";
import {ModelWalletAccount} from "./shared/model_wallet_account";
import AccountsRowItem from "./components/AccountsRowItem";
import "./style.scss"
import StorageHelper from "../../shared/BD/helper/StorageHelper";
import {historyBack} from "../../shared/functions/common";
import WeSearchBar from "../../shared/weui/WeSearchBar";
import {currentTimestamp} from "../../shared/functions/date";

export default connect(({global}) => {
  return {
    global
  }
})(class extends Component {
    constructor(props) {
      super(props);
      const {notify_id, notify_namespace} = props.location.params;
      this.notify_namespace = notify_namespace
      this.notify_id = notify_id
      this.state = {
        accounts: [],
        showSearch: true,
        searchValue: "",
      }
    }

    componentDidMount() {
      ModelWalletAccount.getAccounts().then((accounts) => {
        this.setState({
          accounts
        })
      })
    }

    render() {
      const {accounts, searchValue, showSearch} = this.state;
      return (
        <BasePage useScroll back={!showSearch} header={{
          title: showSearch ? (
            <div style={{flex: 1}}>
              <WeSearchBar
                placeholder={"Select Account"}
                onCancelSearch={() => {
                  this.setState({
                    showSearch: false,
                    searchValue: ""
                  })
                }}
                searchFocused={true}
                onChangeSearchValue={(searchValue) => {
                  this.setState({
                    searchValue: searchValue
                  })
                }}/>
            </div>
          ) : "Select Account",
          right: [
            {
              hide: showSearch,
              icon: "search",
              onClick: () => {
                this.setState({showSearch: true})
              }
            }
          ]
        }}>
          <div className="pt_8">
            <WeFormGroup title={"Accounts"}>
              {
                accounts.filter((account) => {
                  if(account.address === this.notify_id){
                    return false
                  }
                  if (searchValue.length > 0) {
                    return account.name.toLowerCase().indexOf(searchValue.toLowerCase()) > -1;
                  } else {
                    return true
                  }
                }).map((account, i) => {
                  return <AccountsRowItem
                    onClick={() => {
                      StorageHelper.notify(this.notify_namespace, this.notify_id, {account,updateAt:currentTimestamp()})
                      historyBack()
                    }} account={account} key={i}/>
                })
              }
            </WeFormGroup>
          </div>
        </BasePage>
      )
    }
  }
)
