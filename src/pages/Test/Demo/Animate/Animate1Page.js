import React from 'react';
import {CSSTransition} from 'react-transition-group'
import {_debug} from "shared/functions/common";
import WeButton from "shared/weui/WeButton";
import BasePage from "components/core/BasePage";
import './Animate1.css';

class Animate1Page extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {show: false};
  }

  onToggle() {
    this.setState({show: !this.state.show})
  };

  render() {
    const {show} = this.state;
    return (
      <BasePage title={"Animate1"} useHeader back>
        <div className="height_100p">
          <div className={'container'}>
            <div className={'square-wrapper'}>
              <CSSTransition
                in={show}
                onEnter={() => {
                  _debug("onEnter")
                }}
                onEntered={() => {
                  _debug("onEntered")
                }}
                onExit={() => {
                  _debug("onExit")
                }}
                onExited={() => {
                  _debug("onExited")
                }}
                timeout={200}
                classNames={show ? 'slide-in-from-right' : 'slide-out-from-left'}
                unmountOnExit={true}
              >
                <div className={show ? 'square-demo square-in' : 'square-demo square-out'}/>
              </CSSTransition>
            </div>
            <WeButton
              onClick={this.onToggle.bind(this)}>{show ? 'slide-in-from-right' : 'slide-out-from-left'}</WeButton>
          </div>


        </div>
      </BasePage>
    );
  }
}

export default Animate1Page
