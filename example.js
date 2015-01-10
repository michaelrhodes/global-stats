var hyperquest = require('hyperquest')
var parse = require('csv-parser')
var JSON = require('JSONStream')
var gs = require('./')

var url = gs({
  stat: 'browser',
  platforms: 'desktop',
  country: 'AU',
  start: '2015',
  end: '2015'
})

hyperquest(url)
  .pipe(parse())
  .pipe(JSON.stringify())
  .pipe(process.stdout)
