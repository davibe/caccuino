const path = require('path')
const fs = require('fs').promises

const ignoreDir = (d) => d.startsWith('.') || d.startsWith('node_modules')


const walkDir = async (dir) => {
  var obj = {}; // an object similar to { dir: { subdir: { subsub: {} } } }
  var list = []; // a list similar to bash $ find .

  const files = await fs.readdir(dir, { withFileTypes: true })

  for (const dirEnt of files) {
    const f = dirEnt.name
    const isDirectory = dirEnt.isDirectory()
    let dirPath = path.join(dir, f);

    if (isDirectory) {
      if (dir != '.' && ignoreDir(dir)) {
        continue
      }
      const [obj2, list2] = await walkDir(dirPath);
      obj[dirPath] = obj2;
      list = list.concat(list2)
    } else {
      obj[dirPath] = {};
      list = list.concat(dirPath)
    }
  }

  return [obj, list];
}


if (!module.parent) {
  (async () => {
    const [o, l] = await walkDir('.')
    console.log('object', o)
    console.log('list', l)
  })()
}

exports.walkDir = walkDir;
