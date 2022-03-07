/*global chrome*/

export default class BDChrome {
  static createNewTab(url) {
    chrome.tabs.create({url});
  }

  static getCurrentTab() {
    return new Promise((resolve) => {
      chrome.tabs.query({
          active: true,
          currentWindow: true
        },
        (tabs) => {
          resolve(tabs[0]);
        });
    })
  }
}
