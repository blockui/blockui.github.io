import React, {Children, cloneElement, Component} from 'react';
import PropTypes from 'prop-types';
import {FixedContext} from '../Contexts';
import {createId} from '../util';


class Fixed extends Component {
  constructor(props) {
    super(props);
    this.fixedId = createId();
  }

  componentDidMount() {
    this.renderInContext();
  }

  componentDidUpdate({children}) {
    if (children !== this.props.children) {
      this.renderInContext();
    }
  }

  componentWillUnmount() {
    this.fixedContext.unmount(this.fixedId);
  }

  renderInContext() {
    const {fixedContext, fixedId, props: {children}} = this;
    if (fixedContext.render) {
      fixedContext.render(
        cloneElement(Children.only(children), {key: fixedId}),
      );
    }
  }

  renderChildren(fixedContext) {
    this.fixedContext = fixedContext;
    return null;
  };

  render() {
    return <FixedContext.Consumer>{this.renderChildren.bind(this)}</FixedContext.Consumer>;
  }
}


Fixed.propTypes = {
  children: PropTypes.node,
}

export default Fixed
