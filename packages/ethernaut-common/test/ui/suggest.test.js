const assert = require('assert')
const suggest = require('../../src/ui/suggest')

describe('suggest', function () {
  describe('with a simple array of choices', function () {
    const choices = [
      {
        value: 'one',
      },
      {
        value: 'two',
      },
      {
        value: 'three',
      },
    ]

    describe('when the input is one char', function () {
      it('displays two results', async function () {
        assert.deepEqual(suggest('t', choices), [
          {
            value: 'two',
          },
          {
            value: 'three',
          },
        ])
      })

      describe('when the input is two chars', function () {
        it('displays one result', async function () {
          assert.deepEqual(suggest('th', choices), [
            {
              value: 'three',
            },
          ])
        })

        describe('when the input is three chars', function () {
          it('displays no results', async function () {
            assert.deepEqual(suggest('thx', choices), [])
          })
        })
      })
    })
  })
})
