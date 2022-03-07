import React from 'react';

class GlobalPanel extends React.PureComponent {
  render() {
    return (
      <div className="global-panel">
        {this.props.children}
      </div>
    );
  }
}

export default GlobalPanel
