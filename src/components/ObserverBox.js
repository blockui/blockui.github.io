import React from "react"

class ObserverBox extends React.Component {
  constructor(props) {
    super(props);
    this.intersectionObserver = null
    this.dom = React.createRef()

  }

  componentDidMount() {
    this.intersectionObserver = new IntersectionObserver((entries) => {
      if (entries[0].intersectionRatio <= 0) return;
      setTimeout(() => {
        this.loadImage(src)
      })
    });
    this.intersectionObserver.observe(this.dom.current);
  }

  componentWillUnmount() {
    this.intersectionObserver && this.intersectionObserver.disconnect()
  }

  render() {
    return (
      <div ref={this.dom}>
        {this.props.children}
      </div>
    )
  }

}


export default ObserverBox
