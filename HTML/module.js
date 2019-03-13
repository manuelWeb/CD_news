const fs = require('fs');

// const loadJSON = (filepath) => {
//   return new Promise((resolve, reject) => {
//     fs.readFile(filepath, 'utf8', (err, content) => {
//       if(err) {
//         reject(err)
//       } else {
//         try {
//           resolve(
//             JSON.parse(content)
//             );
//         } catch(err) {
//           reject(err)
//         }
//       }
//     })
//   });
// }

// module.exports.aryPkRead = loadJSON('./source.json')
// .then(console.log)
// .catch(console.log);

module.exports.aryPkRead = (limit=100) => {
  fs.readFile('./source.json', (err,content) => {
    obj = JSON.parse(content)
    console.log(obj.date);
  })
}
