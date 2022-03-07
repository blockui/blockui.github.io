import React from 'react'
import cls from "classnames";
import PropTypes from "prop-types";

class WeFormTextArea extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputFocused: false,
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
      label,
      autoFocus,
      rows,
      hide,
      vertical,
      valueMaxLength,
      placeholder,
      value,
      onBlur,
      onFocus,
      onChange,
      readOnly,
      ...props
    } = this.props;
    if (hide) return null;
    const className = cls({
      "weui-cell": true,
      "weui-cell_vertical": vertical,
    })
    const className_bd = cls("weui-cell__bd", {
      "weui-flex": true,
      "weui-cell__bd_focus": this.state.inputFocused,
    })
    if(readOnly){
      props.readOnly = readOnly
    }
    return (
      <div className={className}>
        <div className={className_bd}>
                <textarea
                  ref={this.input}
                  onChange={(e) => {
                    onChange && onChange(e);
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
                  rows={rows || 8}
                  className="weui-textarea"
                  value={value}
                  placeholder={placeholder}
                  {...props}
                />
          {
            valueMaxLength &&
            <div className="weui-textarea-counter"><span>{value ? value.length : 0}</span>/{valueMaxLength}
            </div>
          }
        </div>
      </div>
    )
  }
}

WeFormTextArea.propTypes = {
  autoFocus:PropTypes.bool,
  value:PropTypes.string,
  onFocus:PropTypes.func,
  onChange:PropTypes.func,
  onBlur:PropTypes.func,
  vertical:PropTypes.bool,
  readOnly:PropTypes.bool,
  placeholder:PropTypes.string,
  rows:PropTypes.number
}
export default WeFormTextArea;
