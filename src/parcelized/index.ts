import './style/typebase.css'
import './style/delta3.css'
import './node_modules/markdown-it-highlight/dist/index.css'

console.log(`Caccuino working directory: ${__dirname}`)

// import pages from `./pages/**/*.md`
const pages = require(`../pages/**/*.md`)

console.log(`Caccuino pages tree`, pages)


const page = window.location.pathname
  .substr(1)
  .replace(".md", "")
  .split('/')
  .reduce((scope, acc) => scope[acc], pages));

document.querySelector(".menu").innerHTML = pages.menu.html
if (page) {
  document.querySelector(".content").innerHTML = page.html || "not found"
} else {
  document.querySelector(".content").innerHTML = "page not found"
}