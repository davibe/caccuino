# caccuino

I use this to generate simple technical wikis that are git and markdown based

    npm install -g caccuino # or `npm link .` from this repo
    cd /folder/with/markdown/files # for example `example` dir in this repo
    caccuino

![screenshot](screenshot.png)

The spawned server will automatically serve 

- an index for the directory and subdirs
- a rendered version of the markdown files
  - using `style.css` from the root directory
  - with codeblock syntax hilight
  - with rendering of mermaidjs diagrams
- serve any other static file (images, artifacts..)

features and todos:

- [x] render an outline of the current document
- [x] render a filetree of adiacent documents
- [ ] better printable css media
- [ ] hotreload changes (?)
