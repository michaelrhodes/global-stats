var concat = require('concat-regexp')

module.exports = (function () {
  var g = {}

  g.yearly = /^([0-9]{4})/
  g.monthly = concat(g.yearly, /-([0-1][0-9])/)
  g.daily = concat(g.monthly, /-([0-3][0-9])/)
  g.quarterly = concat(g.yearly, /-(Q[1-4])/)
  g.weekly = concat(g.yearly, /-W([0-5][0-9])/)

  for (var type in g) {
    if (g.hasOwnProperty(type)) {
      g[type] = concat(g[type], /$/i)
    }
  }

  return g
})()
