import React from "react"
import BasePage from "components/core/BasePage"
import WeSearchBar from "shared/weui/WeSearchBar";
import {Icons} from "components/Icons";
import {WeCell} from "shared/weui";
import "./Icon.less"

class IconsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showSearch: false,
      searchValue: ""
    }
  }

  render() {
    const {showSearch, searchValue} = this.state;
    const iconKeys = Object.keys(Icons)
    return (
      <BasePage back useScroll={true} header={{
        title: showSearch ? (
          <div style={{flex: 1}}>
            <WeSearchBar
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
        ) : null,
        right: [
          {
            hide: showSearch,
            icon: "search",
            onClick: () => {
              this.setState({
                showSearch: true
              })
            }
          }
        ]
      }}>
        {
          iconKeys.filter(iconKey => {
            if (searchValue) {
              if (iconKey.toLowerCase().indexOf(searchValue.toLowerCase()) >= 0) {
                return true;
              } else {
                return false;
              }
            } else {
              return true;
            }
          }).map((iconKey, i) => {
            return <WeCell icon={iconKey} key={i} title={(<div className={"user_select_text"}>{iconKey}</div>)} active/>
          })
        }
      </BasePage>
    )
  }
}

export default IconsPage
