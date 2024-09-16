const assert = require('assert')

// Helper function to mock the current timestamp (avoiding sinon)
function mockDateNow(mockedTime) {
  const originalDateNow = Date.now
  Date.now = () => mockedTime
  return () => {
    Date.now = originalDateNow // Restore original Date.now after test
  }
}

describe('timestamp', function () {
  let restoreDateNow

  beforeEach(function () {
    // Mock the current timestamp to 1 January 2024 00:00:00 UTC before each test
    restoreDateNow = mockDateNow(1704067200000) // 1704067200 seconds in milliseconds
  })

  afterEach(function () {
    // Restore original Date.now after each test
    restoreDateNow()
  })

  it('should return correct future timestamp in seconds', async function () {
    const result = await hre.run(
      { scope: 'util', task: 'timestamp' },
      {
        value: '10',
        unit: 'seconds',
      },
    )
    assert.equal(result, '1704067210') // 10 seconds after 1 January 2024 00:00:00 UTC
  })

  it('should return correct future timestamp in days', async function () {
    const result = await hre.run(
      { scope: 'util', task: 'timestamp' },
      {
        value: '1',
        unit: 'days',
      },
    )
    assert.equal(result, '1704153600') // 1 day (86400 seconds) after 1 January 2024 00:00:00 UTC
  })

  it('should return correct future timestamp in weeks', async function () {
    const result = await hre.run(
      { scope: 'util', task: 'timestamp' },
      {
        value: '2',
        unit: 'weeks',
      },
    )
    assert.equal(result, '1705276800') // 2 weeks (1209600 seconds) after 1 January 2024 00:00:00 UTC
  })

  it('should return correct future timestamp in years', async function () {
    const result = await hre.run(
      { scope: 'util', task: 'timestamp' },
      {
        value: '1',
        unit: 'years',
      },
    )
    assert.equal(result, '1735603200') // 1 year (31,536,000 seconds) after 1 January 2024 00:00:00 UTC
  })
})
