import React,{Fragment} from 'react';
import BasePage from "components/core/BasePage";
import {WeCell, WeFormGroup} from "shared/weui";
import WeSearchBar from "shared/weui/WeSearchBar";
import {unique_array} from "shared/functions/array";
import {locationHash} from "shared/functions/common";
import Routes from '../../_routes'

class IndexPage extends React.PureComponent {
  constructor(props) {
    super(props);
    const {pageName} = props
    this.pageName = pageName
    const {path} = props.location.params;
    const routeNames = []
    const routeNameParents = []
    Routes.forEach(row => {
      if (pageName !== row.name) {
        if (!path) {
          routeNameParents.push(row.name.split("/")[0])
          routeNames.push(row.name)
        } else {
          if (row.name.indexOf(path) === 0) {
            routeNameParents.push(row.name.replace(path + "/", "").split("/")[0])
            routeNames.push(row.name)
          }
        }
      }

    })
    this.path = path
    this.state = {
      searchValue: "",
      showSearch: false,
      routeNames,
      rows: unique_array(routeNameParents)
    }
  }

  render() {
    const {showSearch, routeNames, searchValue, rows} = this.state;
    return (
      <BasePage back={!this.state['showSearch']} useScroll={true} header={{
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
        ) : <Fragment>{this.path}</Fragment>,
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
        <WeFormGroup title={"Pages"}>
          {
            rows.filter(row => {
              if (searchValue) {
                return row.toLowerCase().indexOf(searchValue.toLowerCase()) > -1;
              } else {
                return true
              }
            }).map((row, i) => {
              const props = {access: true}
              const title = (this.path ? this.path + "/" : "") + row
              return (
                <WeCell key={i} onClick={() => {
                  if (routeNames.indexOf(title) > -1) {
                    locationHash(title)
                  } else {
                    locationHash(this.pageName, {path: title})
                  }
                }} title={row} {...props} active/>
              )
            })
          }
        </WeFormGroup>
      </BasePage>
    );
  }
}


export default IndexPage
