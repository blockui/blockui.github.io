import React, {Component} from "react"
import {CSSTransition} from "react-transition-group";
import {Icons} from "components/Icons";
import PropTypes from 'prop-types'
import "./style.scss"
import cls from "classnames";
import MapHelper from "shared/BD/helper/MapHelper";

class PopMenus extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showMenus: false
    }
  }

  onClose() {
    this.setState({showMenus: false})
    const {onClose} = this.props;
    onClose && onClose()
    window.$("body").off("touchstart mousedown")
  }

  onMenuClicked(i, e) {
    e.preventDefault();
    e.stopPropagation();
    this.setState({
      showMenus: false
    })
    window.$("body").off("touchstart mousedown")
    const {menus} = this.props;
    menus.forEach((m, j) => {
      if (i === j) {
        m.onClick && m.onClick()
      }
    })
  }

  render() {
    const {menus, className, style, label, icon} = this.props;
    return (
      <div style={style} className={"pop-menus " + (className || "")} onClick={() => {
        if (this.state.showMenus) return;
        setTimeout(() => {
          window.$("body").on("touchstart mousedown", (e) => {
            if (window.$(e.target).parents(".menus").length > 0) {
              return;
            }
            this.onClose();
          })
        }, 500)
        this.setState({showMenus: true})
      }}>
        {
          this.state.showMenus &&
          <div className={"position_fixed p_0000"} style={{zIndex: 1}} onClick={() => {
            this.setState({showMenus: false})
          }}/>
        }
        <CSSTransition
          in={this.state.showMenus}
          timeout={200}
          classNames={this.state.showMenus ? 'slide-in-from-right' : 'slide-out-from-left'}
          unmountOnExit={true}
        >
          <div className={"menus"}>

            {
              this.state.showMenus &&
              <div className="menu-actions">
                {
                  menus.map((menu, i) => {
                    const classNames = cls("menu-action", {
                      active: menu['label'] === MapHelper.getCacheMapLayerName()
                    })
                    return (
                      <div key={i} className={classNames}
                           onClick={this.onMenuClicked.bind(this, i)}>
                        <div className="icon">{Icons[menu["icon"]]}</div>
                        <span>{menu['label']}</span>
                      </div>
                    )
                  })
                }
              </div>
            }
          </div>
        </CSSTransition>
        <div className={"menu-btn"}>
          {
            icon &&
            <div className="icon">
              {Icons[icon]}
            </div>
          }
          {
            label &&
            <span className="label">
                            {label}
                        </span>
          }
        </div>
      </div>
    )
  }
}

PopMenus.propTypes = {
  menus: PropTypes.array,
  className: PropTypes.string,
  style: PropTypes.object,
  label: PropTypes.string,
  icon: PropTypes.string
}

export default PopMenus
