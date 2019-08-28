const path = require('path');
const fs = require('fs');
function walkDir(dir) {
  var obj = {}; // an object similar to { dir: { subdir: { subsub: {} } } }
  var list = []; // a list similar to bash $ find .
  list = fs.readdirSync(dir).flatMap(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
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
