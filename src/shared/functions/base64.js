import {Base64} from 'js-base64';


export function base64Encode(utf8) {
  return Base64.encode(utf8)
}

export function base64Decode(utf8) {
  return Base64.decode(utf8)
}
