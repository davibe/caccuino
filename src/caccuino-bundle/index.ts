import 'markdown-it-highlight/dist/index.css'
import render from './renderer'

// do this dynamically so parcel does not try to bundle the link
const link = document.createElement('link')
link.rel = "stylesheet"
link.href = "/style.css"
document.body.appendChild(link)

const doit = async () => {
  const pagePath = unescape(window.location.pathname).substr(1)
  const res = await fetch(`/___raw___/${pagePath}`)
  const body = await res.text()
  const page = render(body)

  if (page) {
    document.querySelector(".content").innerHTML = page.html || "not found"
  } else {
    document.querySelector(".content").innerHTML = "page not found"
  }

}
doit()