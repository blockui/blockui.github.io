import LangZhCn from "./lang-zh-cn"

const langItems = {
  "zh-CN": LangZhCn
};

const defaultLang = "zh-CN"

export function getSysLanguage() {
  let language = window['__language'];
  if (!language) {
    language = window.localStorage.getItem("language")
    if (!language) {
      language = navigator.language;
    }
    if (!language) {
      language = defaultLang
    }
    window['__language'] = language;
    window.localStorage.setItem("language", language)
  }
  return language;
}

/**
 *
 * @param txt
 * @returns {*}
 * @private
 */
export default function _(txt) {
  // const language = getSysLanguage();
  const l = langItems[defaultLang]
  return (l && l[txt]) ? l[txt] : txt
}
