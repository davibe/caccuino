const MarkdownIt = require('markdown-it')
const Meta = require('markdown-it-meta')
const hljs = require('markdown-it-highlight')
const anchor = require('markdown-it-anchor')
const toc = require('markdown-it-table-of-contents')
const diagramPlugin = require('./diagramPlugin')

const mdGen = async () => {
  /*
  const [
    MarkdownIt,
    Meta, 
    hljs, 
    anchor, 
    toc,
    diagramPlugin
  ] = await Promise.all([
    import('markdown-it'),
    import('markdown-it-meta'),
    import('markdown-it-highlight'),
    import('markdown-it-anchor'),
    import('markdown-it-table-of-contents'),
    import('./diagramPlugin')
  ])
  */

  return new MarkdownIt('default', {
    html: true,
    linkify: true,
    typographer: true
  }).use(Meta)
    .use(hljs.default)
    .use(diagramPlugin.default)
    .use(anchor.default)
    .use(toc, { 
      includeLevel: [1, 2, 3] 
    }
  )
}

var md = null

const initializeRenderer = async() => {
  md = await mdGen()
}

const render = (string) => {
  const html = md.render(string)
  return {
    html: html,
    meta: md.meta
  }
}

export { render, initializeRenderer }