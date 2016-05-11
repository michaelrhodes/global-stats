var test = require('tape')
var omit = require('object.omit')
var copy = require('shallow-copy')
var url = require('url')
var gs = require('../')

var defaults = {
  stat: 'browser',
  platforms: ['desktop'],
  start: '2015',
  end: '2015'
}

function without (option) {
  return function (assert) {
    assert.plan(1)
    try {
      gs(omit(defaults, option))
    }
    catch (e) {
      assert.equal(e.message,
        'No ' + option + ' option specified')
    }
  }
}

function query (options) {
  return url.parse(gs(options), true).query
}

test('it requires options', function (assert) {
  assert.plan(1)
  try { gs() }
  catch (e) {
    assert.equal(e.message, 'No options specified')
  }
})

test('it requires options.stat', without('stat'))
test('it requires options.platforms', without('platforms'))
test('it requires options.start', without('start'))
test('it requires options.end', without('end'))

test('options.platforms accepts an array', function (assert) {
  assert.plan(1)

  var options = omit(defaults, 'platforms')
  options.platforms = ['desktop', 'tablet']

  var query = url.parse(gs(options), true).query
  assert.equal(query.device_hidden, 'desktop+tablet')
})

test('options.platforms accepts a string', function (assert) {
  assert.plan(1)

  var options = omit(defaults, 'platforms')
  options.platforms = 'desktop'
  assert.equal(query(options).device_hidden, 'desktop')
})

test('options.bar accepts a truthy', function (assert) {
  assert.plan(1)

  var options = defaults
  options.bar = true
  assert.equal(query(options).bar, '1')
})


test('infer granularity from options.start', function (assert) {
  var dates = {
    'daily': '2013-12-01',
    'weekly': '2013-W48',
    'monthly': '2013-12',
    'quarterly': '2013-Q4',
    'yearly': '2013'
  }

  var granularities = Object.keys(dates)
  assert.plan(granularities.length)

  granularities.forEach(function (granularity) {
    var options = omit(defaults, ['start', 'end'])
    options.start = dates[granularity]
    options.end = dates[granularity]
    assert.equal(query(options).granularity, granularity)
  })
})

test('start and end dates to be of the same granularity', function (assert) {
  var dates = {
    'daily': { start: '2013-12-01', end: '2013' },
    'weekly': { start: '2013-W48', end: '2013' },
    'monthly': { start: '2013-12', end: '2013' },
    'quarterly': { start: '2013-Q4', end: '2013' },
    'yearly': { start: '2013', end: '2013-Q4' }
  }

  var granularities = Object.keys(dates)
  assert.plan(granularities.length)

  granularities.forEach(function (granularity) {
    var options = omit(defaults, ['start', 'end'])
    options.start = dates[granularity].start
    options.end = dates[granularity].end
    try { gs(options) }
    catch (e) {
      assert.equal(e.message, 'Inconsistent date formatting')
    }
  })
})

test('granularities translate to correct query params', function (assert) {
  var dates = {
    'daily': { start: '2009-12-01', end: '2013-12-01' },
    'weekly': { start: '2013-W48', end: '2013-W52' },
    'monthly': { start: '2013-01', end: '2013-12' },
    'quarterly': { start: '2012-Q3', end: '2013-Q2' },
    'yearly': { start: '2008', end: '2015' }
  }

  var params = {
    'daily': ['fromMonthYear', 'fromDay', 'toMonthYear', 'toDay'],
    'weekly': ['fromWeekYear', 'toWeekYear'],
    'monthly': ['fromMonthYear', 'toMonthYear'],
    'quarterly': ['fromQuarterYear', 'toQuarterYear'],
    'yearly': ['fromYear', 'toYear']
  }

  var granularities = Object.keys(dates)
  assert.plan(granularities.length)

  granularities.forEach(function (granularity) {
    var options = omit(defaults, ['start', 'end'])
    options.start = dates[granularity].start
    options.end = dates[granularity].end

    var result = query(options)

    params[granularity].forEach(function (param) {
      if (!result.hasOwnProperty(param)) {
        assert.ok(false, 'missing param')
      }
    })
    
    assert.ok(true, 'has correct params')
  })
})

test('country defaults to worldwide', function (assert) {
  assert.plan(2)
  assert.equal(query(defaults).region_hidden, 'ww')

  var options = copy(defaults)
  options.country = 'AU'
  assert.equal(query(options).region_hidden, 'AU')
})
