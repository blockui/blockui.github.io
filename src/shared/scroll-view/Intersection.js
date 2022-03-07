import {noop} from './util';
import EntryState from './EntryState';

export default class Intersection {
  constructor({onEnter, onLeave, onIntersect, debugId = ''}) {
    this._onIntersect = onIntersect || noop;
    this.onEnter = onEnter || noop;
    this.onLeave = onLeave || noop;
    this._isIntersecting = false;
    this.debugId = debugId; // useful for debug

  }

  onIntersect(eventData) {
    const {entry} = eventData;
    const {isIntersecting} = entry;
    const entryState = new EntryState(entry, this.debugId);
    if (this._isIntersecting !== isIntersecting) {
      this._isIntersecting = isIntersecting;
      // this.setVisibleIds(entryState,this.debugId)
      this[isIntersecting ? 'onEnter' : 'onLeave'](entryState);
    }
    this._onIntersect(entryState);
  }

  setVisibleIds(res, debugId) {
    if (!this.visibleIds) window.visibleIds = {}
    if (res.isBottomVisible) {
      window.visibleIds["bottomVisible"] = debugId
    }

    if (res.isTopVisible) {
      window.visibleIds["topVisible"] = debugId
    }
    if (res.isOffsetTop) {
      window.visibleIds["offsetTop"] = debugId
    }
    if (res.isOffsetBottom) {
      window.visibleIds["offsetBottom"] = debugId
    }

  };
}
