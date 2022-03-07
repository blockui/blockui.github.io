import React from "react"
import PropTypes from 'prop-types'
import sound_left_0 from 'assets/img/speek/sound_left_0.webp'
import sound_left_1 from 'assets/img/speek/sound_left_1.webp'
import sound_left_2 from 'assets/img/speek/sound_left_2.webp'
import sound_left_3 from 'assets/img/speek/sound_left_3.webp'

import sound_right_0 from 'assets/img/speek/sound_right_3.png'
import sound_right_3 from 'assets/img/speek/sound_right_3.png'
import sound_right_1 from 'assets/img/speek/sound_right_1.webp'
import sound_right_2 from 'assets/img/speek/sound_right_2.webp'

class AudioSpeakerBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      counter: 0
    }
    this.icons = {
      left: [
        sound_left_0,
        sound_left_1,
        sound_left_2,
        sound_left_3
      ],
      right: [
        sound_right_0,
        sound_right_1,
        sound_right_2,
        sound_right_3
      ]
    }
    this.timeId = null;
    this.timeSpace = 200
  }

  shouldComponentUpdate({play}, nextState, nextContext) {
    if (play !== this.props.play) {
      this.setTimeInterval()
      return false;
    }
    return true;
  }

  componentWillUnmount() {
    this.clearTimeInterval()
  }

  componentDidMount() {
    if (this.props.play) {
      this.setTimeInterval()
    }
  }

  clearTimeInterval() {
    if (this.timeId) {
      clearInterval(this.timeId)
    }
  }

  setTimeInterval() {
    this.clearTimeInterval()
    this.timeId = setInterval(() => {
      this.setState({
        counter: this.state.counter + 1
      })
    }, this.timeSpace)
  }

  render() {
    const {right, play} = this.props;
    let index
    if (!play) {
      index = 0;
    } else {
      index = this.state.counter % 4
    }
    const src = this.icons[right ? "right" : "left"][index]
    return (
      <img src={src} alt=""/>
    )
  }
}

AudioSpeakerBox.propTypes = {
  right: PropTypes.bool,
  play: PropTypes.bool
}

export default AudioSpeakerBox
