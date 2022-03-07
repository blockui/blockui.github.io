import React, {Fragment} from 'react'
import {Icons} from "components/Icons";
import cls from "classnames"
import PropTypes from "prop-types";
import WeButton from "./WeButton";

class WeFormInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputFocused: false,
      passwordVisible: false
    }
    this.input = React.createRef()
  }

  componentWillUnmount() {
    this.setState = () => false;
  }

  componentDidMount() {
    if (this.props.autoFocus) {
      this.input.current && window.$(this.input.current.focus())
    }
  }

  render() {
    const {
      autoFocus,
      showInputClear,
      label,
      warn,
      type,
      value,
      showWarn,
      textAlign,
      labelWidth,
      placeholder,
      hide,
      vertical,
      inputBtnIcon,
      inputBtn,
      inputBtnTxt,
      onChange,
      head,
      onFocus,
      onBlur,
      className,
      labelTextAlign,
      labelStyle,
      ...props
    } = this.props;
    if (hide) return null
    const _onChange = (e) => {
      onChange && onChange(e)
    }
    const classNames = cls(className, {
      "weui-cell": true,
      "weui-form-input": true,
      "weui-cell_vertical": vertical,
    })

    const className_bd = cls("weui-cell__bd", {
      "weui-flex": true,
      "weui-cell__bd_focus": this.state.inputFocused,
    })
    return (
      <Fragment>
        <div className={classNames}>

          {
            (head || label) &&
            <div className="weui-cell__hd">
              {
                head && head
              }
              {
                label &&
                <label className="weui-label" style={{width: labelWidth, textAlign: labelTextAlign, ...labelStyle}}>
                  {label}
                </label>
              }
            </div>
          }
          <div className={className_bd}>
            <input
              ref={this.input}
              type={type === "password" ? (this.state.passwordVisible ? "text" : type) : type}
              onChange={(e) => {
                _onChange(e)
              }}
              onFocus={(e) => {
                this.setState({inputFocused: true})
                onFocus && onFocus(e);
              }}
              onBlur={(e) => {
                setTimeout(() => {
                  this.setState({inputFocused: false})
                }, 200)
                onBlur && onBlur(e);
              }}
              value={(value !== null && value !== undefined) ? value : ""}
              className={"weui-input" + (textAlign === "right" ? " text_align_right" : "")}
              placeholder={placeholder} {...props}
            />
            {
              (showInputClear && this.state.inputFocused && value && value.length > 0) &&
              <button onClick={() => {
                onChange && onChange({target: {value: ""}})
              }} className="weui-btn_reset weui-btn_icion weui-btn_input-clear display_inline">
                <i className="weui-icon-clear"/>
              </button>
            }
            {
              type === "password" &&
              <button onClick={() => {
                this.setState({passwordVisible: !this.state.passwordVisible})
              }} className="weui-btn_reset weui-btn_reset_pw_visible weui-btn_icon display_inline">
                {Icons[this.state.passwordVisible ? 'visibilityOff' : 'visibilityOutlined']}
              </button>
            }
            {
              (inputBtn && value.length > 0) &&
              <WeButton onClick={inputBtn} mini>{inputBtnIcon ? Icons[inputBtnIcon] : ""} {inputBtnTxt || ""}</WeButton>
            }
          </div>
        </div>
        {
          showWarn &&
          <div className="weui-cells__tips weui-cells__tips_warn display_block">
            {warn}
          </div>
        }
      </Fragment>
    )

  }
}

WeFormInput.propTypes = {
  textAlign: PropTypes.string,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
  placeholder: PropTypes.string,
  className: PropTypes.string,
  vertical: PropTypes.bool,
  label: PropTypes.string,
  type: PropTypes.string,
  showInputClear: PropTypes.bool,
  inputBtn: PropTypes.func,
  inputBtnIcon: PropTypes.any,
  inputBtnTxt: PropTypes.string,
  autoFocus: PropTypes.bool
}

export default WeFormInput;
