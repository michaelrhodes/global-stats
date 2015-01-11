var qs = require('querystring')
var granularities = require('./lib/granularity-patterns')
var validate = require('./lib/validate')

var base = 'http://gs.statcounter.com/chart.php'

module.exports = function (options) {
  validate(options)

  if (!Array.isArray(options.platforms)) {
    options.platforms = [options.platforms]
  }
   
  var query = {
    'device_hidden': options.platforms.join('+'),
    'statType_hidden': options.stat,
    'region_hidden': options.country || 'ww',
    'multi-device': true,
    'csv': 1
  }

  var granularity
  var pattern
  for (var type in granularities) {
    if (!granularities.hasOwnProperty(type)) {
      continue
    }

    if (granularities[type].test(options.start)) {
      granularity = type
      pattern = granularities[type]
      break
    }
  }

  if (!granularity) {
    throw new Error('Unrecognised date format') 
  }

  var from = options.start.match(pattern)
  var to = options.end.match(pattern)

  if (!to) {
    throw new Error('Inconsistent date formatting')
  }

  query.granularity = granularity
  from = from.slice(1)
  to = to.slice(1)

  if (/yearly/.test(granularity)) {
    query.fromYear = from
    query.toYear = to
  }

  else if (/daily|monthly/.test(granularity)) {
    query.fromMonthYear = from.slice(0, 2).join('-')
    query.toMonthYear = to.slice(0, 2).join('-')

    if (/daily/.test(granularity)) {
      query.fromDay = from[2]
      query.toDay = to[2]
    }
  }

  else if (/weekly/.test(granularity)) {
    query.fromWeekYear = from.join('-')
    query.toWeekYear = to.join('-')
  }

  else if (/quarterly/.test(granularity)) {
    query.fromQuarterYear = from.join('-')
    query.toQuarterYear = to.join('-')
  }
   
  return base + '?' + qs.stringify(query)
}
