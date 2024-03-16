const camelToKebabCase = require('../src/util/kebab')
const assert = require('assert')

describe('kebab', function () {
  it('can convert mySimpleFunction to my_simple_function', async function () {
    assert.equal(camelToKebabCase('mySimpleFunction'), 'my-simple-function')
  })
})
