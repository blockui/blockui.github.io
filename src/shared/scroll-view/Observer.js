import Map from './MapPolyfill';
import warning from 'warning';
import Intersection from './Intersection';

if (!IntersectionObserver) {
  throw new Error(
    [
      'react-scroll-view requires `IntersectionObserver`.',
      'You may add this polyfill to fix the issue.',
      '`https://github.com/w3c/IntersectionObserver/tree/master/polyfill`',
    ].join(' '),
  );
}

const createBox = (observer, intersection) => ({
  observer,
  intersection,
});

export default class Observer {
  constructor() {
    this._boxes = new Map();
    this._prevScrollPos = 0;
    this._currScrollPos = 0;
    this.onChildrenChanged = null
  }

  mount(root) {
    this.root = root;
  }

  setOnChildrenChanged(func, rootChildren) {
    this.onChildrenChanged = func
    this.rootChildren = rootChildren
  }

  observerMutation() {
    if (this.rootChildren) {
    }
    if (this.childMountOb) {
      this.childMountOb.disconnect()
    }
    const config = {attributes: true, childList: true, subtree: false};
    const callback = (mutationsList) => {
      for (let mutation of mutationsList) {
        if (mutation.type === 'childList') {
          this.onChildrenChanged && this.onChildrenChanged()
        }
      }
    };
    this.childMountOb = new MutationObserver(callback);
    this.childMountOb.observe(this.rootChildren, config);
  }

  observe(target, intersection, options) {
    if (!this.root) {
      return warning(
        false,
        'Should call observer.mount(root) before calling observer.observe()',
      );
    }
    if (this.rootChildren) {
      this.observerMutation()
    }
    if (intersection instanceof Intersection && !this._boxes.has(target)) {
      const callback = (entries) =>
        entries.forEach((entry, i) => {
          const {target} = entry;
          if (this._boxes.has(target)) {
            const {intersection} = this._boxes.get(target);
            intersection.onIntersect({entry});
          }
        });
      const observer = new IntersectionObserver(callback, {
        root: this.root,
        ...options,
      });
      const box = createBox(observer, intersection);
      this._boxes.set(target, box);

      observer.observe(target);
    }
  }

  unobserve(target) {
    const box = this._boxes.get(target);
    if (box) {
      const {observer} = box;
      observer.unobserve(target);
      observer.disconnect();
      this._boxes.delete(target);
    }
  }
}
