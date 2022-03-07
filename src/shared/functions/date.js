/* eslint-disable no-extend-native */
// 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
// 例子：
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
// (new Date()).Format("yyyy-M-d h:m:s.S") ==> 2006-7-2 8:9:4.18
//
Date.prototype.Format = function (fmt) { // author: meizz
  var o = {
    "M+": this.getMonth() + 1, // 月份
    "d+": this.getDate(), // 日
    "h+": this.getHours(), // 小时
    "m+": this.getMinutes(), // 分
    "s+": this.getSeconds(), // 秒
    "q+": Math.floor((this.getMonth() + 3) / 3), // 季度
    "S": this.getMilliseconds() // 毫秒
  };
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}

export function formatRecentTime(time_) {
  let time = time_;
  if (time > 16221312510) {
    time = Math.floor(time / 1000)
  }

  if (!time) return "";
  const timeNow = Math.floor(+(new Date()) / 1000)
  const t = timeNow - time
  if (t < 10) {
    return "刚刚"
  }
  if (t < 60) {
    return `${t}秒前`
  }
  if (t < 60 * 60) {
    return `${Math.floor(t / 60)}分钟前`
  }
  if (t < 60 * 60 * 24) {
    return `${Math.floor(t / (60 * 60))}小时前`
  }
  if (t < 60 * 60 * 24 * 7) {
    return `${Math.floor(t / (60 * 60 * 24))}天前`
  }
  return (new Date(time * 1000)).Format("MM-dd")
}

export function timestampToDateStr(unix_timestamp, format = "yyyy-MM-dd hh:mm:ss") {
  return new Date(unix_timestamp * 1000).Format(format)
}

export function todayStartTimestamp() {
  const currentTime = currentTimestamp()
  return currentTime - currentTime % 3600 * 24
}



export function currentTimestamp() {
  return +new Date() / 1000
}
