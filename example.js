var gs = require('./')
var hyperquest = require('hyperquest')
var parse = require('csv-parser')
var JSON = require('JSONStream')

var url = gs({
  stat: 'browser',
  platforms: [
    'desktop',
    'tablet',
    'mobile'
  ],
  country: 'AU',
  start: '2015',
  end: '2015'
})

hyperquest(url)
  .pipe(parse())
  .pipe(JSON.stringify())
  .pipe(process.stdout)
