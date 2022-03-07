import React, {Component, Fragment} from 'react'
import classNames from 'classnames'
import {CSSTransition} from "react-transition-group";
import PropTypes from "prop-types";
import WeButton from "./WeButton";

const $ = window.$;

class WeSearchBar extends Component {
  constructor(props) {
    super(props);
    this.input = React.createRef();
    this.state = {
      showSearchResult: props.showSearchResult || false,
      searchFocused: props.searchFocused || false,
      value: props.value || ""
    }
  }

  shouldComponentUpdate({value}, nextState, nextContext) {
    if (value !== this.props.value) {
      this.setState({
        value
      })
      return false;
    }
    return true;
  }

  componentDidMount() {
    const {searchFocused} = this.props;
    if (searchFocused) {
      $(this.input.current).focus()
    }
  }

  render() {
    const {
      loading,
      onSearchConfirmed,
      className,
      title,
      placeholder,
      notEmptyValueOnCancel,
      style,
      searchFocused,
      onFocus,
      onBlur,
      onCancelSearch,
      onChangeSearchValue,
      children,
      hideCancelBtn,
      showSearchBtn,
      showSearchResult,
      searchResult,
      ...props
    } = this.props;
    const {value} = this.state
    const searchBarClassName = classNames("weui-search-bar", className, {
      "weui-search-bar_focusing": true
    })
    return (
      <Fragment>
        <div className={searchBarClassName} style={style} {...props}>
          <form className="weui-search-bar__form">
            <div className="weui-search-bar__box">
              <i className="weui-icon-search"/>
              <input
                ref={this.input}
                onClick={() => {
                  if (this.state.searchFocused && !this.state.showSearchResult) {
                    this.setState({
                      showSearchResult: true
                    })
                  }
                }}
                value={this.state.value}
                onChange={({target}) => {
                  const {value} = target;
                  this.setState({value})
                  onChangeSearchValue && onChangeSearchValue(value)
                }}
                onFocus={({target}) => {
                  onFocus && onFocus()
                  this.setState({
                    searchFocused: true,
                    showSearchResult: true
                  })
                }}
                onBlur={({target}) => {
                  onBlur && onBlur()
                  const {value} = target;
                  if (value.length === 0) {
                    //this.onCancelSearch()
                  }
                }}
                onKeyDown={(e) => {
                  if (e.code === "Enter") {
                    e.preventDefault();
                    e.stopPropagation()
                    return false
                  }
                }}
                type="search" className="weui-search-bar__input"
                placeholder={placeholder}
                required
              />
              <span className="weui-icon-clear" onClick={() => {
                // onFocus && onFocus()
                this.setState({showSearchResult: false, value: ""})
                $(this.input.current).focus()
                onChangeSearchValue && onChangeSearchValue("")
              }}/>
              {
                loading &&
                <span className="weui-primary-loading weui-primary-loading_brand">
                    <span className="weui-primary-loading__dot"/>
                </span>
              }
            </div>
            <label
              className="weui-search-bar__label"
              onClick={() => {
                onFocus && onFocus()
                this.setState({
                  searchFocused: true,
                  showSearchResult: true
                }, () => {
                  $(this.input.current).focus()
                })
              }}>
              <i className="weui-icon-search"/>
              <span>{placeholder || "搜索"}</span>
            </label>
          </form>
          {
            !hideCancelBtn &&
            <span className="weui-search-bar__cancel-btn" onClick={() => {
              onBlur && onBlur()
              if (!notEmptyValueOnCancel) {
                this.setState({showSearchResult: false, value: ""})
                onChangeSearchValue && onChangeSearchValue("")
              }
              this.onCancelSearch()
            }}>取消</span>
          }
          {
            (showSearchBtn && value) &&
            <span className="weui-search-bar__cancel-btn" onClick={() => {
                onSearchConfirmed && onSearchConfirmed()
            }}><WeButton mini>搜索</WeButton></span>
          }

          <div className="searchbar-result">
            <CSSTransition
              in={this.state.showSearchResult}
              timeout={200}
              unmountOnExit={true}
              classNames={this.state.showSearchResult ? "slide-in-from-top" : "slide-out-from-bottom"}
            >
              <div className="searchbar-list">
                {searchResult && searchResult}
              </div>
            </CSSTransition>
          </div>
        </div>
        {
          this.state.showSearchResult &&
          <div className="search-mask" onClick={() => {
            this.setState({showSearchResult: false})
          }}/>
        }
      </Fragment>
    );
  }

  onCancelSearch() {
    this.setState({searchFocused: false})
    const {onCancelSearch} = this.props;
    onCancelSearch && onCancelSearch()
  }
}

WeSearchBar.propTypes = {
  loading: PropTypes.bool,
  showSearchResult: PropTypes.bool,
  searchResult: PropTypes.any,
  className: PropTypes.string,
  title: PropTypes.string,
  notEmptyValueOnCancel: PropTypes.bool,
  style: PropTypes.object,
  value: PropTypes.string,
  searchFocused: PropTypes.bool,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  placeholder: PropTypes.string,
  onCancelSearch: PropTypes.func,
  onChangeSearchValue: PropTypes.func,
  children: PropTypes.any,
  onSearchConfirmed:PropTypes.func,
  hideCancelBtn: PropTypes.bool,
  showSearchBtn: PropTypes.bool
}
export default WeSearchBar;

