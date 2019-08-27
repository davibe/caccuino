const MarkdownIt = require('markdown-it')
const Meta = require('markdown-it-meta')
const hljs = require('markdown-it-highlight').default

import diagramPlugin from './diagramPlugin'

const md = new MarkdownIt('default', {
  html: true,
  linkify: true,
  typographer: true
}).use(Meta).use(hljs).use(diagramPlugin)

const render = (string) => {
  const html = md.render(string)
  return {
    html: html,
    meta: md.meta
  }
}

export default render