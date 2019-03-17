/* eslint-disable indent */
const rimraf = require('rimraf'),
      gulp   = require('gulp'),
      fs     = require('fs');

function showDestroy(img, cp, imgLen) {
  // console.log(typeof img)
  console.log(`src/FR/img/${img} est detruite…cp:${imgLen - cp}`)
  if (cp == imgLen) {
    console.log(
      '\x1b[30m\x1b[43m%s\x1b[0m',
      'destruction completed'
    )
  }
}
let cptPrive = 0
function callback(img, imgLen) {
  let inc = val => (cptPrive += val)
  return function() {
    inc(1)
    return showDestroy(img, cptPrive, imgLen)
  }
}

module.exports = function() {
  gulp.task('destroy', function() {
    rimraf('./src/FR/var/_varLib.slim', function cb() {
      console.log('_varLib.slim file have been destroyed!')

      rimraf('render', function cb() {
        console.log('render folder have been destroyed!')

        fs.readdir('./src/FR/images/', (err, files) => {
          let pki = files
            .filter(function(name) {
              if (!name.match(/pk.\.jpg/)) {
                return false
              } else {
                return true
              }
            })
            .map(i => i)
          let ilen = pki.length
          pki.map(i => rimraf('./src/FR/images/' + i, callback(i, ilen)))
        })
      })
    })
  })
}

