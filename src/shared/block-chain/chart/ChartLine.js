import {timestampToDateStr} from "../../functions/date";

class ChartLine {
  constructor({time, value}) {
    //sec unixtimestamp
    this.time = time
    this.dateStr = timestampToDateStr(this.time, "MM-dd hh:mm:ss")
    this.value = Number(value)
  }
}
export default ChartLine
