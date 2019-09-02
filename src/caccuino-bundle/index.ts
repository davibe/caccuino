import 'markdown-it-highlight/dist/index.css'
import render from './renderer'

// do this dynamically so parceljs does not try to bundle the link
['/style.css'].map(url => {
  const link = document.createElement('link')
  link.rel = "stylesheet"
  link.href = url
  document.body.appendChild(link)
})

const doit = async () => {
  const pagePath = unescape(window.location.pathname).substr(1)
  const res = await fetch(`/___raw___/${pagePath}`)
  const body = `${ await res.text() }\n[[toc]]`
  const page = render(body)

  if (page) {
    document.querySelector(".content").innerHTML = page.html || "not found"

    // manipulate the document outline
    const sidebar = document.querySelector(".sidebar")
    const tocEl = document.querySelector(".table-of-contents")
    if (tocEl) {
      tocEl.innerHTML = "<h4>Outline</h4>" + tocEl.innerHTML
    }
    sidebar.innerHTML = tocEl.innerHTML
    tocEl.remove()

    // generate the  "files" section
    const res = await fetch(`/___dirs___/`)
    const dirList: Array<string> = await res.json()
    const dirPath = pagePath.split("/").reverse().slice(1).reverse().join(`/`)
    const otherDocs = dirList
      .filter(s => s.endsWith('.md')) // only mds
      .filter(s => s.startsWith(dirPath)) // not current page
      .filter(s => s != pagePath) // only starting with current path
      .map(s => s.replace(dirPath, ``)) // remove current path from filename
      .map(s => s.replace(/^\//, ``)) // remove trailing slash
      .filter(s => !s.includes('/')) // exclude subdirs
      .sort()
      .map(s => `[${s.replace(/\.md$/g, ``)}](${escape(s)})`)
      .reverse().concat('[..](..)').reverse()
    const otherDocsMd = `#### files\n\n - ${ otherDocs.join('\n - ') }`
    const otherDocsHtml = render(otherDocsMd).html
    sidebar.innerHTML += `<hr/>${otherDocsHtml}`

  } else {
    document.querySelector(".content").innerHTML = "page not found"
  }

}
doit()