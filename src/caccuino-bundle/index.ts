import 'markdown-it-highlight/dist/index.css'
import { render, initializeRenderer } from './renderer'

// do this dynamically so parceljs does not try to bundle the link
['/style.css'].map(url => {
  const link = document.createElement('link')
  link.rel = "stylesheet"
  link.href = url
  document.body.appendChild(link)
})

const rawFetch = async (pagePath: string): Promise<string> => {
  const res = await fetch(`/___raw___/${pagePath}`)
  const body = `${await res.text()}\n[[toc]]`
    // fix trange paths starting with tilde ~
    // .replace(/\(~\//g, `(/~`)
    // fix headings with no CommonMark space like #Heading
    .replace(/\n(#+)([A-Za-z0-9])/g, (h, a, b) => `\n${a} ${b}`)

    // transform: tolerate links with spaces -> disable because it has problem with recursive
    // https://regex101.com/r/LL9mLa/2
    // .replace(/\[(.*)\]\(([^<].* .*[^>])\)/gm, "[$1](<$2>)")

    // transform: add space before inline codeblocks if there is none 
    // this is to fix kotlin dokka output
    // https://regex101.com/r/LL9mLa/2
    // .replace(/([^ ^`])`/gm, "$1 `")
  return body
}

const dirListFetch = async (): Promise<Array<string>> => {
  const res = await fetch(`/___dirs___/`)
  const dirList: Array<string> = await res.json()
  return dirList.map((it) => it.replace(/\\/g, "/"))
}

const doit = async () => {
  const pagePath = unescape(window.location.pathname).substr(1)
  // data fetch (parallel)
  const [body, dirList] = await Promise.all([rawFetch(pagePath), dirListFetch(), initializeRenderer()])

  const page = render(body)

  if (page) {
    document.querySelector(".content").innerHTML = page.html || "not found"

    // manipulate the document outline (table of contents)
    const sidebar = document.querySelector(".sidebar")
    const tocEl = (_ => {
      const els = document.querySelectorAll(".table-of-contents")
      return els[els.length - 1]
    })()
    if (tocEl) {
      tocEl.innerHTML = "<h4>Outline</h4>" + tocEl.innerHTML
    }
    sidebar.innerHTML = tocEl.innerHTML
    tocEl.remove()

    // generate pdf download link
    sidebar.innerHTML += render(`#### [Pdf ♨](/___pdf___/${pagePath})`).html

    // generate the  "files" section
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
      .reverse().concat('[⤾](..)').reverse()
    const otherDocsMd = `#### files\n\n - ${ otherDocs.join('\n - ') }`
    const otherDocsHtml = render(otherDocsMd).html
    // sidebar.innerHTML += `<hr/>${otherDocsHtml}`
    sidebar.innerHTML += '<a onclick="window.history.back()">⤾</a>'

  } else {
    document.querySelector(".content").innerHTML = "page not found"
  }

  // restore scroll after renderin7
  window.location.hash && document.querySelector(window.location.hash).scrollIntoView()

}
doit()