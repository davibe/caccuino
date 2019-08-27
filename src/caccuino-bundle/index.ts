import '../*.css'
import 'markdown-it-highlight/dist/index.css'
import render from './renderer'

var pages = require(`../**/*.md`)

const pageSource = unescape(window.location.pathname)
  .substr(1)
  .replace(".md", "")
  .split('/')
  .reduce((scope, acc) => {
    return scope[acc]
  }, pages)

const page = render(pageSource)

// TODO: outline ? filelist ? custom menu ?
if (pages.menu) {
  document.querySelector(".menu").innerHTML = pages.menu.html
}

if (page) {
  document.querySelector(".content").innerHTML = page.html || "not found"
} else {
  document.querySelector(".content").innerHTML = "page not found"
}