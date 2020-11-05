const { src, dest, series, parallel } = require('gulp')
const transform = require('gulp-transform')
const rename = require('gulp-rename')

import { initializeRenderer, render } from './renderer'

function renderMd(content: String, file: String) {
  return `
  <html>
    <head>
      <link rel="stylesheet" href="http://cdnjs.cloudflare.com/ajax/libs/highlight.js/10.3.2/styles/default.min.css">
    </head>
    <body>
      <script src="https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js"></script>
      <script>mermaid.initialize({startOnLoad:true});</script>

      ${render(content).html}

    </body>
  </html>
  `
}

async function md() {
  await initializeRenderer()
  return src(['./**/*.md', '!dist/**/*'])
    .pipe(transform('utf8', renderMd))
    .pipe(dest('dist'))
}

series(md)()
