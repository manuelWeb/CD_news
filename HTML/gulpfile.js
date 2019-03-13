// exec rubyLib.rb
var exec = require('child_process').exec
console.log('Ruby is running ;)!!!')

exec('ruby rubyLib.rb', function(error, stdout, stderr) {
  if (stdout) {
    console.log('RUBY: ' + stdout)
    // une fois les Lib + price recup on lance le CB
    cb()
  } else if (stderr) {
    console.log('stderr: ' + stderr)
  } else if (error) {
    console.log('error: ' + error)
  }
})

require('./tasks/img.js')()
require('./tasks/slim.js')()
require('./tasks/sass.js')() // lire note dependance sass.js
require('./tasks/premailer.js')()
require('./tasks/prettify.js')()
// sys protection contre réécriture avant fin de slim,sass,premailer,prettify.
var global_end = ''

/*==================================================
=            npm install gulp --sav-dev            =
==================================================*/
// to disable>dest path replace fs
/*----------  dependance  > package.json > node_modules  ----------*/
// prettier-ignore
var gulp         = require('gulp'),
    bs           = require('browser-sync'),
    // slim         = require('gulp-slim'),
    sass         = require('gulp-sass'),
    plumber      = require('gulp-plumber'),
    premailer    = require('gulp-premailer'),
    autoprefixer = require('gulp-autoprefixer'),
    rename       = require('gulp-rename'),
    using        = require('gulp-using'),
    rm           = require('gulp-rimraf'),
    rimraf       = require('rimraf'),
    prettify     = require('gulp-prettify'),
    changed      = require('gulp-changed'),
    fs           = require('fs'),
    imageResize  = require('gulp-image-resize')

const notifier = require('node-notifier')
let jsonObj = require('./source.json')

function cb() {
  console.log('ruby code is Okay guy!')
  gulp.start('dev1')
}

gulp.task('dev', function(cb) {
  gulp.start('destroy')
})

function showDestroy(img, cp, imgLen) {
  // console.log(typeof img)
  console.log(`img:${img} est detruite…cp:${imgLen - cp}`)
  if (cp == imgLen) {
    console.log(
      'yep!!!!!!!!!!!!!Now run what you want guy!!! thisisCallbackHEll'
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


const mod_pk = require('./module.js');

mod_pk.aryPkRead('./source.json')
.then(function (value) {
  console.log(value.refPk)
})


const reportChange = (event, ref) => {
  console.log(
    '\x1b[30m\x1b[43m%s\x1b[0m',
    `File: ${event.path}, type was ${event.type}, running tasks...`
  )
}

gulp.task('dev1', ['img', 'slim'], function() {
  gulp.start('build')
})

// gulp.task('build', ['bs'], function() {
gulp.task('build', function() {
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
