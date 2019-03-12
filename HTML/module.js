const fs = require('fs');

const jsonPk_ = require('./source.json');

module.exports.aryPkRead = (limit=100) => {
  fs.readFile('./source.json', (err,content) => {
    obj = JSON.parse(content)
    console.log(obj);
    // console.log(String(content));
  })
  // return fs.readFile('./source.json', (err,content) => {
  //   return content.refPk
  // })
  // return Math.floor(Math.random()*limit)
}

module.exports.json_ = jsonPk_.refPk;