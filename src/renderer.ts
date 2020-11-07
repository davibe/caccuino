const MarkdownIt = require('markdown-it')
const Meta = require('markdown-it-meta')
const hljs = require('markdown-it-highlight')
const toc = require('markdown-it-table-of-contents')
const markdownReplaceLink = require('markdown-it-replace-link')
// const anchor = require('markdown-it-anchor')

const diagramPlugin = require('./diagramPlugin')

const getLocalConfiguration = (): { replaceLink?: () => void } => {
  const path = require('path')
  const process = require('process')
  try {
    return require(
      path.join(process.cwd(), '.deltapaguro.conf.js')
    )
  } catch (e) {
    return {}
  }
}
const { replaceLink } = getLocalConfiguration()

const mdGen = () => {
  return new MarkdownIt('default', {
    html: true,
    linkify: true,
    typographer: true,
    replaceLink
  }).use(Meta)
    .use(hljs.default)
    .use(diagramPlugin.default)
    .use(toc, { 
      includeLevel: [1, 2, 3] 
    })
    .use(markdownReplaceLink)
    // .use(anchor.default)
}

const render = (string) => {
  const md = mdGen()
  const html = md.render(string)
  return {
    html: html,
    meta: md.meta
  }
}

export { render  }