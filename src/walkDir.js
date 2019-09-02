const path = require('path')
const fs = require('fs')
const flatMap = require('flatmap')

const ignoreDir = (d) => d.startsWith('.') || d.startsWith('node_modules')

function walkDir(dir) {
  var obj = {}; // an object similar to { dir: { subdir: { subsub: {} } } }
  var list = []; // a list similar to bash $ find .

  list = flatMap(fs.readdirSync(dir), f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      if (dir != '.' && ignoreDir(dir)) {
        return []
      }
      const [obj2, list] = walkDir(dirPath);
      obj[dirPath] = obj2;
      return list;
    }
    else {
      obj[dirPath] = {};
      return dirPath;
    }
  });
  return [obj, list];
}
exports.walkDir = walkDir;
