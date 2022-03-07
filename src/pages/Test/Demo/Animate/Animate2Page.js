import React from 'react';
import {CSSTransition, TransitionGroup} from 'react-transition-group';
import WeButton from "shared/weui/WeButton";
import BasePage from "components/core/BasePage";
import './Animate2.css';

class Animate2Page extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {num: 0};
  }

  onToggle() {
    this.setState({num: (this.state.num + 1) % 2})
  }

  render() {
    const {num} = this.state;
    return (
      <BasePage title={"Animate2"} useHeader back>
        <div className="height_100p">
          <div className={'container'}>
            <TransitionGroup className={'square-wrapper'}>
              <CSSTransition
                key={num}
                timeout={500}
                classNames={'fade'}>
                <div className={'square'}>{num}</div>
              </CSSTransition>
            </TransitionGroup>
            <WeButton primary onClick={this.onToggle.bind(this)}>toggle</WeButton>
          </div>
        </div>
      </BasePage>

    );
  }
}

export default Animate2Page
