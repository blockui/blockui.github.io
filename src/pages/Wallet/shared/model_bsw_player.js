import {currentTimestamp, timestampToDateStr} from "shared/functions/date";

export class ModelBswPlayer {
  constructor({
                rarity, tokenId, busyTo, stakeFreeze, createTimestamp, contractEndTimestamp, squidEnergy, maxSquidEnergy
              }) {
    this.tokenId = tokenId
    this.rarity = rarity
    this.busyTo = busyTo
    this.stakeFreeze = stakeFreeze
    this.createTimestamp = createTimestamp
    this.contractEndTimestamp = contractEndTimestamp
    this.squidEnergy = squidEnergy
    this.maxSquidEnergy = maxSquidEnergy
  }

  busyToDate() {
    const leftSec = this.busyTo - currentTimestamp()
    let leftStr = ""
    if (leftSec < 0) {
      leftStr = 0
    } else if (leftSec < 60) {
      leftStr = `剩${leftSec}秒`
    } else if (leftSec < 60 * 60) {
      leftStr = `剩${parseInt(leftSec / 60)}分`
    } else if (leftSec < 60 * 60 * 24) {
      leftStr = `剩${parseInt(leftSec / 3600)}时`
    } else {
      leftStr = `剩${parseInt(leftSec / (3600 * 24))}天`
    }
    return this.busyTo > 0 ? (timestampToDateStr(this.busyTo, "MM-dd hh:mm") + " (" + leftStr + ")") : ""
  }

  contractEndDate() {
    const leftSec = this.contractEndTimestamp - currentTimestamp()
    let leftStr = ""
    if (leftSec < 0) {
      leftStr = 0
    } else if (leftSec < 60) {
      leftStr = `剩${leftSec}秒`
    } else if (leftSec < 60 * 60) {
      leftStr = `剩${parseInt(leftSec / 60)}分`
    } else if (leftSec < 60 * 60 * 24) {
      leftStr = `剩${parseInt(leftSec / 3600)}时`
    } else {
      leftStr = `剩${parseInt(leftSec / (3600 * 24))}天`
    }

    return this.contractEndTimestamp > 0 ? (timestampToDateStr(this.contractEndTimestamp, "MM-dd hh:mm") + " (" + leftStr + ")") : ""
  }

  createDate() {
    let leftDay = (currentTimestamp() - this.createTimestamp) / (3600 * 24)
    if (leftDay < 0) leftDay = 0

    return this.createTimestamp > 0 ? (timestampToDateStr(this.createTimestamp, "MM-dd hh:mm") + " (" + parseInt(leftDay) + "天)") : ""
  }

}

