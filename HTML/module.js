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
  })
  // .then(function (value) {
  //   console.log(value.refPk);
  // })
  .catch();
}
module.exports.aryPkRead = loadJSON




// module.exports.aryPkRead = (limit=100) => {
//   fs.readFile('./source.json', (err,content) => {
//     obj = JSON.parse(content)
//     console.log(obj.date);
//   })
// }
