import React from "react"
import {WeSearchBar} from "shared/weui"
import BasePage from "components/core/BasePage";


export default class SearchBarPage extends React.Component {
  render() {
    return (
      <BasePage title={"SearchBar"} back>
        <WeSearchBar/>
      </BasePage>
    )
  }
}
