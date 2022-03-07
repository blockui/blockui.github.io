import React, {Component} from "react";
import {connect} from "react-redux";
import BasePage from "components/core/BasePage";
import "./style.scss"
import {WeCell, WeFormGroup} from "shared/weui";

export default connect(({global}) => {
  return {
    global
  }
})(class extends Component {
    constructor(props) {
      super(props);
      this.state = {
        isOpen: true,
        accountAddress: null,
        players: []
      }
    }

    componentDidMount() {

    }

    render() {
      const {isOpen} = this.state;
      return (
        <BasePage header={{
          title: "Wallet",
        }}>
          <div className="pt_8">

            <WeFormGroup>
              <WeCell title={"Accounts"} to={"#Wallet/Accounts"} access active/>
              <WeCell title={"AccountSearch"} to={"#Wallet/Account"} access active/>
              <WeCell title={"Estimate"} to={"#Wallet/Estimate"} access active/>
            </WeFormGroup>
          </div>
        </BasePage>
      )
    }
  }
)
