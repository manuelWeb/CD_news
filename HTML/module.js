const fs = require('fs');

const loadJSON = (filepath) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filepath, 'utf8', (err, content) => {
      if(err) {
        reject(err)
      } else {
        try {
          resolve( JSON.parse(content) );
        } catch(err) {
          reject(err)
        }
      }
    })
  }).catch();
  // .then(function (value) {
  //   console.log(value.refPk);
  // })
}
module.exports.aryPkRead = loadJSON
