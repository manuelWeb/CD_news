// exec rubyLib.rb
const exec = require('child_process').exec
console.log('Ruby is running ;)!!!')

exec('ruby rubyLib.rb', function(error, stdout, stderr) {
  if (stdout) {
    console.log('RUBY: ' + stdout)
    // une fois les Lib + price recup on lance le CB
    cb()
  } else if (stderr) {
    console.log('Rubylib stderr: ' + stderr)
  } else if (error) {
    console.log('Rubylib error: ' + error)
  } else {
    console.log(
      '\x1b[30m\x1b[42m%s\x1b[0m', 'ref OK::rubyLib.rb finsh, start Gulp', ' 👍'
    )
    cb()
  }
})

// import des taches gulp
require('./tasks/img.js')()
require('./tasks/slim.js')()
require('./tasks/sass.js')()
require('./tasks/premailer.js')()
require('./tasks/prettify.js')()

// prettier-ignore
const gulp   = require('gulp'),
      bs     = require('browser-sync'),
      rimraf = require('rimraf'),
      fs     = require('fs');

let jsonObj = require('./source.json')

const cb = () => gulp.start('dev1')

gulp.task('dev', function() {
  gulp.start('destroy')
})

function showDestroy(img, cp, imgLen) {
  // console.log(typeof img)
  console.log(`img:${img} est detruite…cp:${imgLen - cp}`)
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
// destroy task when finsih call dev1
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

// src & output
var src = 'src/'

// browser-sync task !attention index.html obligatoire
gulp.task('bs', function() {
  bs.init({
    server: {
      baseDir: 'render/FR',
      index: 'index.html',
    },
  })
})

// diff between 2 obj => lodash
const mod_pk = require('./module.js');
var _ = require('lodash');

// callback on watch task dev1
const reportChange = (event) => {
  // diff source.json
  mod_pk.aryPkRead('./source.json')
    .then(function (value) {
      console.log( value.refPk === jsonObj.refPk ? true : false );
      console.log( value.refPk, jsonObj.refPk );
      console.log( _.difference(value.refPk, jsonObj.refPk) );
    // console.log(_.difference(["1", "2", "3"], ["5", "2", "10"])) // [ '1', '3' ]
    })
  console.log(
    '\x1b[30m\x1b[43m%s\x1b[0m',
    `File: ${event.path}, type was ${event.type}, running tasks...`
  )
}

gulp.task('dev1', ['img', 'slim'], function() {
  gulp.start('build')
})

// ifdebug use
// gulp.task('build', function() {
gulp.task('build', ['bs'], function() {
  gulp
    .watch(
      ['source.json', src + '**/**/*.slim', src + '**/scss/*.scss'],
      ['slim']
    )
    .on('change', reportChange)
  gulp
    .watch(src + '**/images/*.{png,jpg,gif}', ['img'])
    .on('change', reportChange)
})
