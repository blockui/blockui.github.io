import React from "react"
import ImageBox from "./ImageBox";
import cls from 'classnames'
import {Icons} from "./Icons";
import PropTypes from "prop-types"

export function isSeedAvatar(src) {
  return !src || src.length === 0
}

const AvatarBox = ({
                     className,
                     useImage,
                     seed,
                     defaultAvatar,
                     circle,
                     border,
                     size,
                     imgStyle,
                     src,
                     style,
                     onClick,
                     ...props
                   }) => {
  const classNames = cls(
    "avatar-box", className,
    {
      "avatar-circle": circle,
      "avatar-border": border
    }
  )
  const styleSize = {}
  if (size) {
    styleSize.width = size
    styleSize.height = size
  }
  let defaultImage = defaultAvatar
  if(!defaultImage){
    defaultImage = Icons['FaUser']
  }
  return (
    <ImageBox
      src={src}
      defaultImage={defaultImage}
      onClick={onClick}
      imgStyle={imgStyle}
      useImage={useImage === undefined ? true : useImage}
      style={{...style, ...styleSize}} defaultIcon={Icons['person']}
      className={classNames} {...props} />
  )
}

AvatarBox.propTypes = {
  onClick: PropTypes.func,
  className: PropTypes.string,
  seed: PropTypes.string,
  imgStyle: PropTypes.object,
  defaultAvatar: PropTypes.any,
  src: PropTypes.string,
  style: PropTypes.object,
  circle: PropTypes.bool,
  useImage: PropTypes.bool,
  border: PropTypes.bool,
}

export default AvatarBox
