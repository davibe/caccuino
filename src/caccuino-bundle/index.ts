import './style/delta3.css'
import 'markdown-it-highlight/dist/index.css'

console.log(`working directory: ${__dirname}`)

// import pages from `./../**/*.md`
var pages = require(`../**/*.md`)

console.log(`pages tree`, pages)

const page = unescape(window.location.pathname)
  .substr(1)
  .replace(".md", "")
  .split('/')
  .reduce((scope, acc) => scope[acc], pages));

if (pages.menu) {
  document.querySelector(".menu").innerHTML = pages.menu.html
}

if (page) {
  document.querySelector(".content").innerHTML = page.html || "not found"
} else {
  document.querySelector(".content").innerHTML = "page not found"
}