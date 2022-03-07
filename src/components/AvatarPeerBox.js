import React from "react"
import PropTypes from 'prop-types'
import AvatarBox from "./AvatarBox";
import cls from "classnames";
import {Icons} from "./Icons";

const AvatarPeerBox = ({className, isFavor, onClick, avatar, maxSize, minSize}) => {
  const classNames = cls("avatar-peer-box", className, {
    "multi-avatar": avatar.length > 1
  })
  const size = avatar.length > 1 ? minSize : maxSize
  if (avatar.length === 0) return null;
  return (
    <div className={classNames} onClick={onClick}>
      {
        isFavor &&
        <div className={"avatar favor"}>
          {Icons['Bookmarks']}
        </div>
      }
      {
        (!isFavor && avatar) && avatar.map(({username, avatar}, i) => {
          return (
            <div className={"avatar"} key={i}>
              <AvatarBox useImage circle size={size} seed={username} src={avatar}/>
            </div>
          )
        })
      }
    </div>
  )
}

AvatarPeerBox.propTypes = {
  className: PropTypes.string,
  avatar: PropTypes.array,
  maxSize: PropTypes.number,
  minSize: PropTypes.number,
  onClock: PropTypes.func
}

AvatarPeerBox.maxSize = 24
AvatarPeerBox.minSize = 8

export default AvatarPeerBox
