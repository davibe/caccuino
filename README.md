# caccuino

I use this to serve simple technical wikis that are purely based on markdown, the good old filesystem and no configuration


    sudo npm install -g caccuino --unsafe-perm=true # or `npm link .` from this repo
    cd /folder/with/markdown/files # for example `example` dir in this repo
    caccuino

![screenshot](screenshot.png)

The spawned server will serve 

- searchable file listing for directories
- a rendered version of the markdown files
  - using `style.css` from the root directory
  - with codeblock syntax hilight
  - with rendering of mermaidjs diagrams
  - including a responsive sidebar with
    - an outline of the current document
    - a pdf download link
    - a list of adjacent files
- a PDF rendered version of the markdown files
  - using puppeteer serverside for consistent results
  - automatically hiding sidebar and other styles that are not printable
  - still using `style.css` from the root directory (printable media)
- serve any other static file as is (images, artifacts..)

#### Under development

- [x] render an outline of the current document
- [x] render a filetree of adiacent documents
- [x] better printable css media
- [x] Pdf rendering
- [ ] hotreload changes (?)
