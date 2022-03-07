import React, {Component} from "react";
import BasePage from "components/core/BasePage";
import {WeCell, WeFormGroup} from "shared/weui";

export default class extends Component {
  render() {
    return (
      <BasePage header={{
        title: "Crypto",
      }}>
        <div className="pt_8">
          <WeFormGroup>
            <WeCell title={"Random"} to={"#Crypto/Random"} access active/>
            <WeCell title={"Hash"} to={"#Crypto/Hash"} access active/>
            <WeCell title={"Base64"} to={"#Crypto/Base64"} access active/>
            <WeCell title={"Aes"} to={"#Crypto/Aes/Index"} access active/>
            <WeCell title={"Des"} to={"#Crypto/Des/Index"} access active/>
          </WeFormGroup>
        </div>
      </BasePage>
    )
  }
}
