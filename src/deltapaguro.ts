#!/usr/bin/env node
const { src, dest, series, parallel } = require('gulp')
const transform = require('gulp-transform')
const rename = require('gulp-rename')

import { render } from './renderer'

function renderMd(content: String, file: String) {
  return `
<script>
["//cdnjs.cloudflare.com/ajax/libs/highlight.js/10.3.2/styles/default.min.css"].forEach((href) => {
  const l = document.createElement("link")
  l.type = "text/css"
  l.rel = "stylesheet"
  l.href = href
  document.getElementsByTagName("head")[0].appendChild(l)
})
</script>
<style>
.hljs {
  background-color: transparent;
}
</style>
<script src="//cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js"></script>
<script>mermaid.initialize({startOnLoad:true});</script>
${render(content).html.trimLeft()}
  `
}

function md() {
  return src(['./**/*.md', '!dist/**/*', "!node_modules/**/*"])
    .pipe(transform('utf8', renderMd))
    .pipe(rename({ extname: ".html" }))
    .pipe(dest('dist'))
}

series(md)()
