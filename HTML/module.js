import { readFile } from 'fs'

const loadJSON = (filepath) => {
  return new Promise((resolve, reject) => {
    readFile(filepath, 'utf8', (err, content) => {
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
  }).catch()
}
export const aryPkRead = loadJSON
