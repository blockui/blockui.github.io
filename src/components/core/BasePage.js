import React, {Component, Fragment} from "react";
import {connect} from "react-redux";
import PropTypes from "prop-types";
import {PageContext} from 'components/core/PageManager'
import {WeAppBar} from "shared/weui";
import config from "config";
import MainPage from "./MainPage";
import ImMessage from "shared/BD/model/ImMessage";

export function PortalView({selector, children}) {
  return (
    <div container={document.querySelector(selector)}>
      {children}
    </div>
  )
}

function getTitle(title, headerLoading, header) {
  let res = title || header.title
  if (headerLoading) {
    res = []
    res.push(
      <h2 key={'title'}>
        {title || header.title}
        <span key={"loading"} className="ml_4 weui-primary-loading weui-primary-loading_brand">
          <span className="weui-primary-loading__dot"/>
        </span>
      </h2>
    )
  }else{
    res = (
      <h2>{res}</h2>
    )
  }
  return res;
}

const PageHeader = ({header, headerLoading, back, useHeader, title}) => {
  if (!useHeader) return null
  const {left, right, style, height, subHeader, component, ...other} = header || {};
  const _left = []
  if (back) {
    _left.push({icon: "back"})
  }
  const props = {
    ...other,
    component,
    left: [..._left, ...left || []],
    title: getTitle(title, headerLoading, header),
    right: [...right || []],
    subHeader,
    style,
  }
  return (
    <Fragment>
      <WeAppBar {...props} />
    </Fragment>
  )
}

const PageFooter = ({footer, useFooter}) => {
  if (!useFooter) return null
  const {component, ...other} = footer || {};
  return (
    <footer {...other}>
      {component}
    </footer>
  )
}

const getHeight = (obj, defaultVal) => {
  if (obj && obj.height) {
    return obj.height
  }
  if (obj && obj.style && obj.style.height) {
    return obj.style.height
  } else {
    return defaultVal
  }
}

class BasePage extends Component {

  componentWillUnmount() {
    ImMessage.setTitleNotice("")
  }

  render() {
    const {
      title,
      header,
      useHeader,
      left,
      right,
      useScroll,
      scroll,
      useFooter,
      back,
      footer,
      className,
      children,
      headerLoading
    } = this.props;
    const userHeader_ = !!(useHeader || header || title || back || left || right)
    const userFooter_ = !!(useFooter || footer)
    let useScroll_ = !!(scroll)
    if (useScroll || scroll) {
      useScroll_ = true
    }
    if (useScroll === false) {
      useScroll_ = false
    }
    const headerHeight = userHeader_ ? getHeight(header, config.ui.PageHeaderHeight) : 0;
    const footerHeight = userFooter_ ? getHeight(footer, config.ui.PageFooterHeight) : 0;
    return (
      <PageContext.Consumer>
        {({pageShow, go}) => {
          if (pageShow) {
            setTimeout(() => {
              //globalLoadingHide()
            }, 500)
          }
          return (
            <Fragment>
              <PageHeader headerLoading={headerLoading} back={back} useHeader={userHeader_} header={{
                left,
                right,
                title: title,
                style: {
                  ...(header && header.style ? header.style : {}),
                  height: headerHeight
                },
                ...header
              }}/>
              <MainPage useScroll={useScroll_} scroll={scroll} style={{
                top: headerHeight,
                bottom: footerHeight
              }} className={className}>
                {pageShow ? children : ""}
              </MainPage>
              <PageFooter useFooter={userFooter_} footer={{
                ...footer,
                style: {
                  ...(footer && footer.style ? footer.style : {}),
                  height: footerHeight
                }
              }}/>
            </Fragment>
          )
        }}
      </PageContext.Consumer>
    );
  }
}

BasePage.propTypes = {
  header: PropTypes.object,
  left: PropTypes.array,
  right: PropTypes.array,
  footer: PropTypes.object,
  scroll: PropTypes.object,
  globalLoading: PropTypes.bool,
  useHeader: PropTypes.bool,
  useScroll: PropTypes.bool,
  useFooter: PropTypes.bool,
  title: PropTypes.any,
  back: PropTypes.bool,
  headerLoading: PropTypes.bool,
  loginRequired: PropTypes.bool
};

PageHeader.propTypes = {
  title: PropTypes.any,
  headerLoading: PropTypes.bool,
  header: PropTypes.object,
  useHeader: PropTypes.bool,
  back: PropTypes.bool
};

PageFooter.propTypes = {
  footer: PropTypes.object,
  useFooter: PropTypes.bool,
};

export default connect(({global, auth}) => {
  return {
    auth,
    snackbars: global.snackbars,
    snackbarsMaxNum: global.snackbarsMaxNum
  }
})(BasePage);
