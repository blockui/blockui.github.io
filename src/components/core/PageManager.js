import React, {Component, Fragment} from "react";
import {CSSTransition} from "react-transition-group";
import cls from 'classnames'
import queryString from 'query-string'
import {getLocationHashData} from "shared/functions/common";

const {location} = window

export const PageContext = React.createContext({
  pageShow: false,
});

export function savePagesStack(_pagesStack) {
  window.sessionStorage.setItem("_pagesStack", JSON.stringify(_pagesStack))
}

export function delPagesStack() {
  window.__delPagesStack()
  window.sessionStorage.removeItem("_pagesStack")
}

function getPagesStack() {
  const res = window.sessionStorage.getItem("_pagesStack")
  return res ? JSON.parse(res) : [];
}

export const Home404 = () => {
  return (
    <div className={"position_fixed p_0000 flex_center_center"}>
      <h1>404</h1>
    </div>
  )
}

export const PageRoute = () => {
  return (
    <div/>
  )
}

export function parseHash(hash) {
  const name = hash.substring(1).split('?')[0]
  let params = {}
  if (hash.indexOf("?") > 0) {
    params = queryString.parse(hash.split("?")[1])
  }
  return {name, params}
}


export class PageManager extends Component {
  constructor(props) {
    super(props);
    //delPagesStack();
    const pages = {}
    let _defaultPage = null
    PageManager.defaultIndexPageName = null;
    const {children} = props;
    this.transitionTimeOutMs = 100
    if (children.length === 0) {
      throw Error("PageManager must have children")
    }
    children.forEach(child => {
      const {name, component, mainPage, index} = child.props;
      pages[name] = {
        name, component, mainPage: !!mainPage
      }
      if (index) {
        PageManager.defaultIndexPageName = name;
        _defaultPage = {name, mainPage: true, className: `page ${name.replace(/\//g, "_")}`}
      }
    })

    if (!_defaultPage && children.length > 0) {
      const {name} = children[0].props;
      PageManager.defaultIndexPageName = name
      _defaultPage = {name, mainPage: true, className: `page ${name.replace(/\//g, "_")}`}
    }
    _defaultPage['hash'] = "#" + PageManager.defaultIndexPageName

    this.state = {
      pages,
      _defaultPage,
      _pageStack: getPagesStack()
    }
  }

  componentWillUnmount() {
    this.setState = () => false;
  }

  __delPagesStack() {
    this.setState({
      _pageStack: []
    })
  }

  componentDidMount() {
    this.init()
    window.__delPagesStack = this.__delPagesStack.bind(this)
    window.__historyBack = this._back.bind(this)
    window.__locationHashReplace = this._locationHashReplace.bind(this)
  }

  init() {
    const {hash} = location
    window.addEventListener('popstate', this.onHashChange.bind(this));
    console.log("init hash is ", hash)
    if (hash === "#" || hash === "" || hash === "#index") {
      location.hash = "#" + PageManager.defaultIndexPageName
    } else {
      const currentPageInStack = this.getTailPageStack(0);
      const nextPage = this.getPageByLocationHash(hash);
      if (currentPageInStack && currentPageInStack.hash === location.hash) {//same page
        return true;
      } else {
        this._go(nextPage).catch(console.error);
      }
    }
  }

  __go(hash) {
    const nextPage = this.getPageByLocationHash(hash);
    this._go(nextPage).catch(console.error);
  }

  onHashChange() {
    const nextLocationHash = location.hash;
    if (this.locationHashReplace) {
      const locationHashReplace = this.locationHashReplace
      this.locationHashReplace = false;
      const nextPage = this.getPageByLocationHash(nextLocationHash);
      this._go(nextPage, locationHashReplace).catch(console.error);
      return;
    }
    if (this.backing) return
    const lastPageInStack = this.getTailPageStack(-1);
    const currentPageInStack = this.getTailPageStack(0);
    const nextPage = this.getPageByLocationHash(nextLocationHash);
    if (currentPageInStack && currentPageInStack.hash === nextLocationHash) {
      return this._back()
    }

    if (
      lastPageInStack
      && nextLocationHash === lastPageInStack.hash
      && lastPageInStack.hash !== "#" + PageManager.defaultIndexPageName
    ) {
      this._back()
    } else {
      this._go(nextPage).catch(console.error);
    }
  }

  getPageByLocationHash(hash) {
    let pageName
    if (hash === "" || hash === "#") {
      pageName = PageManager.defaultIndexPageName
    } else {
      pageName = hash.substring(1)
    }
    if (pageName.indexOf("?") > 0) {
      pageName = pageName.split("?")[0]
    }

    if (!this.state.pages[pageName]) pageName = "Home404"
    return this.state.pages[pageName];
  }

  getTailPageStack(tail_index) {
    const {_pageStack} = this.state;
    const page_stack_length = _pageStack.length
    return _pageStack[page_stack_length - 1 + tail_index]
  }


  setCurrentPage({currentPage, pageStack}) {
    return new Promise((resolve) => {
      const _pageStack = [...pageStack, currentPage];
      this.setState({
        _pageStack
      }, () => {
        resolve(_pageStack)
      })
    })
  }

  _locationHashReplace(hash, replacePage) {
    this.locationHashReplace = replacePage ? replacePage : 1
    window.location.hash = hash
  }

  async _go(page, replace) {
    const {_pageStack} = this.state;
    const {name, mainPage} = page
    const {hash} = location
    const animateClassName = "slide-in-from-right";
    if (
      _pageStack.length === 0 ||
      page.name === PageManager.defaultIndexPageName ||
      mainPage
    ) {
      const {_defaultPage} = this.state;
      const pageStack = []
      if (name !== PageManager.defaultIndexPageName && !mainPage) {
        pageStack.push({
          ..._defaultPage,
          visible: true,
          animateClassName: animateClassName,
          className: `${_defaultPage.className} sub-page`
        })
      }
      const currentPage = {
        name,
        hash: hash,
        data: getLocationHashData(hash) || {},
        mainPage,
        visible: true,
        animateClassName: animateClassName,
        className: `page ${name.replace(/\//g, "_")} cur-page`
      }

      this.setState({
        _pageStack: [...pageStack, currentPage]
      }, () => {
        savePagesStack(this.state._pageStack)
      })
    } else {
      const {_pageStack} = this.state;
      let currentPage = _pageStack.pop();
      if (replace) {
        let i = parseInt(replace)
        do {
          if (_pageStack.length < 1) break
          currentPage = _pageStack.pop()
          i = i - 1
        } while (i > 0)
        savePagesStack(await this.setCurrentPage({
          pageStack: [
            ..._pageStack,
            {
              ...currentPage,
              className: `page ${currentPage.name.replace(/\//g, "_")} sub-page`
            }
          ],
          currentPage: {
            ...page,
            hash,
            data: getLocationHashData(hash) || {},
            visible: true,
            className: `page ${page.name.replace(/\//g, "_")} cur-page`,
          }
        }))
      } else {
        let pageStack = await this.setCurrentPage({
          pageStack: _pageStack,
          currentPage: {
            ...currentPage,
            className: `page ${currentPage.name.replace(/\//g, "_")} sub-page`
          }
        })
        pageStack = await this.setCurrentPage({
          pageStack,
          currentPage: {
            ...page,
            hash,
            visible: false,
            data: getLocationHashData(hash) || {},
            className: `page ${page.name.replace(/\//g, "_")}`,
            animateClassName: "slide-in-from-right",
          }
        })
        currentPage = pageStack.pop();
        await this.setCurrentPage({
          pageStack,
          currentPage: {
            ...currentPage,
            visible: true,
          }
        })
      }
    }
  }

  _back(counter) {
    this.backing = true
    const {_pageStack} = this.state;
    let currentPage
    if (!counter) {
      currentPage = _pageStack.pop();
    } else {
      let i = parseInt(counter)
      do {
        currentPage = _pageStack.pop();
        i = i - 1
      } while (i > 0)
    }
    if (!currentPage || _pageStack.length === 0) {
      setTimeout(() => {
        this.backing = false
      }, 800)
      return;
    }
    this.setCurrentPage({
      pageStack: _pageStack,
      currentPage: {
        ...currentPage,
        animateClassName: "slide-out-from-left",
        className: `page ${currentPage.name.replace(/\//g, "_")}`
      }
    }).then((pageStack) => {
      const currentPage = pageStack.pop();
      return this.setCurrentPage({
        pageStack,
        currentPage: {
          ...currentPage,
          visible: false
        }
      })
    })
    return this;
  }

  render() {
    const {_pageStack, pages} = this.state
    // const {clientWidth, foldSidebar} = this.props;
    const pageStackLength = _pageStack.length;

    // if(clientWidth > config.ui.AppMaxWidth){
    //   style.left = foldSidebar ? config.ui.SidebarFoldWidth : config.ui.SidebarUnFoldWidth
    // }
    return (
      <Fragment>
        {
          _pageStack
            .filter(p => !!pages[p.name])
            // .slice(-2)
            .map(({
                    name,
                    visible,
                    animateClassName,
                    data,
                    hash,
                    className
                  }, i) => {
              const {component} = pages[name]
              const props = {
                pageName: name,
                location: {
                  hash,
                  params: parseHash(hash).params,
                  postData:data ? data.postData : {},
                },
                isCurrentPage: pageStackLength - 1 === i,
                __visible: visible,
              }
              const classNames = cls(className, animateClassName, {
                "full-width": props.location.params.fullWidth
              })
              const pageShow = className.indexOf("cur-page") > 0 || className.indexOf("sub-page") > 0
              const style = {...(data ? data.style : {})}
              return (
                <CSSTransition
                  key={"css" + i + hash}
                  in={visible}
                  onEntered={() => {
                    const pageStack = _pageStack
                    const currentPage = pageStack.pop()
                    setTimeout(() => {
                      this.setCurrentPage({
                        pageStack,
                        currentPage: {
                          ...currentPage,
                          className: `page ${currentPage.name.replace(/\//g, "_")} cur-page`
                        }
                      }).then((pageStack) => {
                        savePagesStack(pageStack)
                      })
                    }, 0)
                  }}
                  onExited={() => {
                    //_debug("onExited")
                    const pageStack = _pageStack
                    pageStack.pop()
                    const currentPage = pageStack.pop()
                    location.hash = currentPage.hash
                    this.setCurrentPage({
                      pageStack,
                      currentPage: {
                        ...currentPage,
                        className: `page ${currentPage.name.replace(/\//g, "_")} cur-page`
                      }
                    }).then((pageStack) => {
                      this.backing = false
                      savePagesStack(pageStack)
                    })
                  }}
                  timeout={200}
                  classNames={animateClassName}
                  unmountOnExit={false}>
                  <div key={i + hash} className={classNames} style={style}>
                    <PageContext.Provider value={{pageShow}}>
                      {React.createElement(component, props)}
                    </PageContext.Provider>
                  </div>
                </CSSTransition>
              )
            })
        }
      </Fragment>
    );
  }
}

PageManager.defaultIndexPageName = null
