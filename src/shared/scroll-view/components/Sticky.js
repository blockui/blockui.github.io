import createStyles from './Sticky.styles';
import React, {Component, isValidElement} from 'react';
import PropTypes from 'prop-types';
import {stickyNodeType} from '../PropTypes';
import {StickyContext} from '../Contexts';
import Fixed from './Fixed';


class Sticky extends Component {
  constructor(props) {
    super(props);
    this.styles = createStyles();
  }

  saveDOMNode(dom) {
    this.dom = dom;
  };

  componentDidMount() {
    if (this.stickyContext) {
      const {height} = this.dom.getBoundingClientRect();
      this.stickyContext.setStickyStyle({height});
    }
  }

  returnChildren(position) {
    const {children} = this.props;
    return isValidElement(children) ? children : children(position);
  }

  renderChildren(stickyContext) {
    this.stickyContext = stickyContext;
    const {props: {style}, stickyContext: {position}, styles} = this;
    if (position === 'fixed') {
      return (
        <Fixed>
          <div ref={this.saveDOMNode.bind(this)} style={styles.fixed(style)}>
            {this.returnChildren(position)}
          </div>
        </Fixed>
      );
    } else {
      const topOrBottom = position;
      return (
        <div ref={this.saveDOMNode.bind(this)} style={styles.relative(style, topOrBottom)}>
          {this.returnChildren(position)}
        </div>
      );
    }
  };

  render() {
    return (
      <StickyContext.Consumer>{this.renderChildren.bind(this)}</StickyContext.Consumer>
    );
  }
}

Sticky.propTypes = {
  children: stickyNodeType,
  style: PropTypes.object,
};

export default Sticky
