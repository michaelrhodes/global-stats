var required = ['stat', 'platforms', 'start', 'end']

module.exports = function (options) {
  if (!options || typeof options != 'object') {
    throw new Error('No options specified')
  }
  required.forEach(function (name) {
    if (!options[name]) {
      throw new Error('No ' + name + ' option specified')
    }
  })
}
