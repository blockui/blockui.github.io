import {getConstant} from "../functions/common";

class BDConstant {
  static common(key) {
    const {common} = getConstant()
    return common[key] !== undefined ? common[key] : null
  }
  static im(key) {
    const {im} = getConstant()
    return im[key] !== undefined ? im[key] : null
  }
  static server(key) {
    const {server} = getConstant()
    return server[key] !== undefined ? server[key] : null
  }
  static circle(key) {
    const {circle} = getConstant()
    return circle[key] !== undefined ? circle[key] : null
  }
}

export default BDConstant
