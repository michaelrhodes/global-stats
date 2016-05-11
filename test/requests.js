var fs = require('fs')
var path = require('path')
var hyperquest = require('hyperquest')
var concat = require('concat-stream')
var series = require('run-series')
var test = require('tape')
var gs = require('../')

test('urls return expected data', function (assert) {
  var options = [{
    stat: 'browser',
    platforms: 'desktop',
    start: '2014-01',
    end: '2014-12'
  }, {
    stat: 'os',
    platforms: 'mobile',
    start: '2012-Q3',
    end: '2013-Q1'
  }, {
    stat: 'vendor',
    platforms: 'console',
    country: 'JP',
    start: '2012',
    end: '2015' 
  }, {
    stat: 'search_engine',
    platforms: ['desktop', 'mobile', 'tablet', 'console'],
    country: 'us',
    start: '2013-W22',
    end: '2013-W32'
  }, {
    stat: 'resolution',
    platforms: ['mobile', 'tablet'],
    start: '2014-12-12',
    end: '2015-01-09'
  },{
    stat: 'resolution',
    platforms: ['mobile', 'tablet'],
    start: '2014-12',
    end: '2015-01',
    bar: true
  }]

  var tests = []

  function handle (assert, option) {
    var segments = []
    for (var key in option) {
      if (option.hasOwnProperty(key)) {
        segments.push(
          Array.isArray(option[key]) ?
            option[key].join('+') :
            option[key]
        )
      }
    }

    return function (callback) {
      var filename = segments.join('-').toLowerCase() + '.csv'
      var filepath = path.join(__dirname, '/data/', filename)
      var expected = fs.existsSync(filepath) ?
        fs.readFileSync(filepath) :
        null

      hyperquest(gs(option))
        .pipe(concat(function (csv) {
          assert.deepEqual(csv, expected, segments.join(' '))
          callback()
        }))
    }
  }

  assert.plan(options.length)

  options.forEach(function (option) {
    tests.push(handle(assert, option))
  })

  series(tests)
})
