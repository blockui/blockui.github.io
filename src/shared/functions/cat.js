import {clearBodyOverflowHidden, locationHashReplace, setBodyOverflowHidden} from "./common";
import weui from "../weui-js";
import {setStoreState} from "components/core/App"
import qs from 'querystring'

export function getCat(cat, subCat, cats) {
  if (!subCat) {
    cats.forEach(cat_ => {
      if (cat_.label === cat) {
        return cat_
      }
    })
    return null;
  } else {
    return getCatBySubCat(subCat, cats)
  }
}

export function getCatNameBySubCat(cat, subCat, cats) {
  let cat_ = cat;
  if (!cat && subCat) {
    cat_ = getCatBySubCat(subCat, cats).label
  }
  return cat_;
}


export function getCatBySubCat(subCat, cats) {
  cats.forEach(cat => {
    cat.children.forEach(subCat_ => {
      if (subCat_ === subCat) {
        return cat;
      }
    })
  })
  return null;
}


export function getCatItems(cats) {
  const items = []
  cats.forEach(({label, ...cat}) => {
    const children = []
    cat.children.forEach(subCat => {
      children.push({
        label: subCat,
        value: subCat
      })
    })
    items.push({
      label: label,
      value: label,
      children
    })
  })
  return items;
}

export function handleCatSearch({items, searchCatVal, py, picker_scroll}) {
  let searched = false
  items.forEach((cat, i) => {
    cat.children.forEach((subCat, j) => {
      if (!searched) {
        const value = subCat.value || subCat.label || subCat;
        if (py && py[value] && py[value] === searchCatVal.toLowerCase()) {
          searched = true;
          picker_scroll([i, j])
        } else if (py && py[value] && py[value].indexOf(searchCatVal.toLowerCase()) > -1) {
          searched = true;
          picker_scroll([i, j])
        } else if (value === searchCatVal) {
          searched = true;
          picker_scroll([i, j])
        } else if (value.indexOf(searchCatVal) > -1) {
          searched = true;
          picker_scroll([i, j])
        }
      }
    })
  })
}

export function locationHashReplaceCatSubCat(namespace, params) {
  setStoreState(namespace, params)
  const {hash} = window.location
  const pageName = hash.substring(1).split("?")[0]
  locationHashReplace(`${pageName}?${qs.stringify(params)}`)
}

export function onShowCatSearch({cats, namespace, onReady}) {
  setBodyOverflowHidden()
  const items = getCatItems(cats)
  let defaultValue = [];
  weui.picker(items, {
    defaultValue,
    className: "cat-search-picker",
    onConfirm: ([cat, subCat]) => {
      //console.log([cat.value, subCat.value])
      locationHashReplaceCatSubCat(namespace, {
        cat: cat.value,
        subCat: subCat.value,
      })
    },
    onClose: () => {
      clearBodyOverflowHidden()
      setStoreState(namespace, {
        showCatSearch: false
      })
    },
    onReady: ($picker, {picker_scroll}) => {
      onReady && onReady(picker_scroll)
    }
  });
  setStoreState(namespace, {
    showCatSearch: true,
    searchCatVal: ""
  })
}
