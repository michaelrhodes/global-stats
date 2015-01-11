# global-stats
global-stats is a simple module that generates URLs to query the [StatCounter Global Stats](http://gs.statcounter.com/) database.

[![Build status](https://travis-ci.org/michaelrhodes/global-stats.png?branch=master)](https://travis-ci.org/michaelrhodes/global-stats)

## Motivation
[StatCounter Global Stats](http://gs.statcounter.com/) is something of an authority on internet-usage statistics, and they kindly make their data available (in CSV format) under a [CC BY-SA 3.0](http://gs.statcounter.com/faq#credit-license) license. Unfortunately, the URLs for fetching said data are quite inelegant, so this module attempts to simplify their generation.

## Install
``` sh
$ npm install global-stats
```

### Usage
```js
var gs = require('global-stats')
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

console.log(url)
> http://gs.statcounter.com/chart.php?device_hidden=desktop%2Btablet%2Bmobile&statType_hidden=browser&region_hidden=AU&multi-device=true&csv=1&granularity=yearly&fromYear=2015&toYear=2015
```

Because `global-stats` is only concerned with generating URLs, you’ll need to call on a few more single-purpose modules in order to access the data.

``` js
var gs = require('global-stats')
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
```

## API
``` 
global-stats ({
  stat (string):
    one of the following:
      'browser',
      'browser_version',
      'browser_version_partially_combined',
      'resolution',
      'os',
      'vendor',
      'search_engine',
      'search_engine_host',
      'social_media',
      'comparison'

  platforms (array || string):
    one or more of the following:
      'desktop',
      'mobile',
      'tablet',
      'console'

  [country (string)]:
    optional ISO 3166-1 alpha-2 code
    see: http://en.wikipedia.org/wiki/ISO_3166-1_alpha-2
    if no country is specified, the data will be worldwide

  start (string):
    the desired granularity of the data is inferred
    from the format of this date. valid formats are:
      daily: '2013-12-01',
      weekly: '2013-W48',
      monthly: '2013-12',
      quarterly: '2013-Q4',
      yearly: '2013'

  end (string):
    must use the same formatting as start
})
```

### Miscellaneous
Beyond enforcing required options and ensuring consistent date formatting, `global-stats` makes no attempt to validate query parameters. Therefore, your application needs to check its own date ranges and country codes. That said, `global-stats` does provide lists of valid stat types, platforms, and granularity regular expressions. These can be consumed like so:

```js
var gs = require('global-stats')
var stats = require('global-stats/stats')
var platforms = require('global-stats/platforms')
var granularities = require('global-stats/granularities')
var yearly = granularities.yearly

var start = '2008'
var end = '2015'

if (!yearly.test(start) || !yearly.test(end)) {
  throw new Error('Bad dates') 
}

var url = gs({
  stat: stats[0],
  platforms: platforms.slice(1, 3),
  start: start,
  end: end
})

console.log(url)
> http://gs.statcounter.com/chart.php?device_hidden=mobile%2Btablet&statType_hidden=browser&region_hidden=ww&multi-device=true&csv=1&granularity=yearly&fromYear=2008&toYear=2015
```

### License
[MIT](http://opensource.org/licenses/MIT)
