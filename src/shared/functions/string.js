export const PASSWORD_REGX = new RegExp(/^(?=.*?[A-Za-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-_]).{8,}$/);
export const PASSWORD_REGX12 = new RegExp(/^(?=.*?[A-Za-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-_]).{12,}$/);
export const CHARACTER_REGX = new RegExp(/^[A-Za-z0-9\-_]+$/);
export const USERNAME_REGX = new RegExp(/^[A-Za-z][A-Za-z0-9\-_]+$/);
export const CN_MOBILE_PHONE_REGX = new RegExp(/^[1][\d]{10}$/);
export const EMAIL_REGX = new RegExp(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);


export function getStrByteLen(str){
  let byteNo = 0
  const len = str.length
  let c
  for (let i = 0; i < len; i++) {
    c = str.charCodeAt(i)
    if (c >= 0x010000 && c <= 0x10ffff) {
      // 特殊字符，如Ř，Ţ
      byteNo += 4
    } else if (c >= 0x000800 && c <= 0x00ffff) {
      // 中文以及标点符号
      byteNo += 3
    } else if (c >= 0x000080 && c <= 0x0007ff) {
      // 特殊字符，如È，Ò
      byteNo += 2
    } else {
      // 英文以及标点符号
      byteNo += 1
    }
  }
  return byteNo
}

export function hexToInt10(hex) {
  return parseInt(hex, 10)
}

export function int10ToHex(number) {
  if (number < 0) {
    number = 0xFFFFFFFF + number + 1;
  }

  return number.toString(16).toUpperCase();
}

export function strToHex(str) {
  var arr = [];
  for (var i = 0; i < str.length; i++) {
    arr[i] = ("00" + str.charCodeAt(i).toString(16)).slice(-4);
  }
  return "\\u" + arr.join("\\u");
}

export function hexToStr(hex) {
  return unescape(hex.replace(/\\/g, "%"));
}

export function isCharacter(character) {
  return CHARACTER_REGX.test(character)
}

export function isUsername(username) {
  return USERNAME_REGX.test(username)
}

export function isCnMobilePhone(str) {
  return CN_MOBILE_PHONE_REGX.test(str)
}

export function isEmailStr(str) {
  return EMAIL_REGX.test(str)
}


export function maskEmail(email) {
  if(!email || email === "" ||email === "-" || email === "@"){
    return email
  }
  if(email.indexOf("@") > 1){
    let email_name = email.split("@")[0]
    if(email_name.length > 3){
      email_name = email_name.substring(0,email_name.length - 3) + "***"
    }else{
      email_name = email_name.substring(0,email_name.length - 1) + "*"
    }
    email = email_name + "@" + email.split("@")[1]
  }
  return email
}



export function maskPhone(phone) {
  if (("" + phone).length !== 11) return ""
  const t = phone.split("")
  return t.slice(0, 3).join("") + "****" + t.reverse().slice(0, 4).reverse().join("")
}

