'use strict';

const {APPS, INDEX} = process.env
const apps = APPS ? APPS.split(",") : ["Home"]
const index = INDEX ? INDEX : "Home/Index"
let hasIndex = false;
console.log(APPS, INDEX)
const path = require('path');
const fs = require('fs');
let routes = []

async function getFiles(dir, app) {
  const files = fs.readdirSync(path.join(dir, app))
  for (let i in files) {
    const file = files[i]
    if (file.indexOf("Page.js") > 0) {
      const page = file.replace("Page.js", "")
      const route = {
        name: `${app.replace(/\//g, "")}${page}`,
        hash: `${app}/${page}`,
        mainPage: page.indexOf("Main") > 0,
        path: app + "/" + file
      }
      if (route.hash === index) {
        route.index = true;
        hasIndex = true;
        console.log(route.hash,route.index)
      }
      console.log(route.hash)
      routes.push(route)
    }
    const p = path.join(dir, app, file)
    const stat = fs.statSync(p);
    if (stat.isDirectory()) {
      await getFiles(dir, app + "/" + file)
    }
  }
}

async function main(appSrc) {
  routes = []
  for (let i in apps) {
    const app = apps[i]
    await getFiles(path.join(appSrc, "pages"), app, routes)
  }
  let routeStr = "const Routes =  ["
  let importStr = ""
  let home404 = false
  if (!hasIndex) {
    routes[0].index = true;
  }
  for (let i in routes) {
    const route = routes[i]
    let index = route.index ? " index:true, " : ""
    let mainPage = route.mainPage ? " mainPage:true," : "";
    const name = route.name;
    if (name === "Home/404") {
      home404 = true;
    }
    importStr += `import ${name} from 'pages/${route.path.split(".")[0]}';\n`
    routeStr += `\n  {name: '${route.hash}',${index}${mainPage} component: ${name}},`
  }

  if(!home404){
    importStr += `import {Home404} from 'components/core/PageManager';\n`
    routeStr += `\n  {name: 'Home/404', component: Home404},`
  }
  if (routeStr.substring(routeStr.length - 1) === ",") {
    routeStr = routeStr.substring(0, routeStr.length - 1)
  }
  routeStr += `\n];\n\nexport default Routes;\n`
  fs.writeFileSync(path.join(appSrc, "_routes.js"), `/**\n do not edit manual!!!! \n pls run "yarn routes" or "npm run routes" to gen it \n*/\n\n${importStr}\n\n${routeStr}`)
}

main(path.join(__dirname, "..", "src")).then(() => {
})
