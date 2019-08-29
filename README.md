# caccuino

I use this to generate simple technical wikis that are git and markdown based

    npm install -g caccuino # or `npm link .` from this repo
    cd /folder/with/markdown/files # for example `pages` dir in this repo
    caccuino
  
The spawned server will automatically serve 

- an index for the directory and subdirs
- a rendered version of the markdown files
  - using `style.css` from the root directory
  - with codeblock syntax hilight
  - with rendering of mermaidjs diagrams
- serve any other static file (images, artifacts..)

TODOs:

- render an outline of the current document
- render a filetree of adiacent documents
- better printable css media
- hotreload changes (?)
