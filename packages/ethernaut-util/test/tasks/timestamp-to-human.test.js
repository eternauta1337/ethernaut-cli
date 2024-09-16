const assert = require('assert')

describe('timestamp-to-human', function () {
  it('should return correct UTC and local time for a given timestamp', async function () {
    const result = await hre.run(
      { scope: 'util', task: 'timestamp-to-human' },
      {
        timestamp: '1704067200', // 1 January 2024 00:00:00 UTC
      },
    )

    // Expected UTC time
    const expectedUtc = 'Mon, 01 Jan 2024 00:00:00 GMT' // Convert timestamp to UTC
    const expectedLocal = new Date(1704067200000).toString() // Local time

    // The result should include both UTC and local time
    assert(
      result.includes(`UTC: ${expectedUtc}`),
      `Expected UTC: ${expectedUtc}, but got: ${result}`,
    )
    assert(
      result.includes(`Local: ${expectedLocal}`),
      `Expected Local: ${expectedLocal}, but got: ${result}`,
    )
  })

  it('should return correct UTC and local time for another timestamp', async function () {
    const result = await hre.run(
      { scope: 'util', task: 'timestamp-to-human' },
      {
        timestamp: '1630454400', // 1 September 2021 00:00:00 UTC
      },
    )

    // Expected UTC time
    const expectedUtc = 'Wed, 01 Sep 2021 00:00:00 GMT' // Convert timestamp to UTC
    const expectedLocal = new Date(1630454400000).toString() // Local time

    // The result should include both UTC and local time
    assert(
      result.includes(`UTC: ${expectedUtc}`),
      `Expected UTC: ${expectedUtc}, but got: ${result}`,
    )
    assert(
      result.includes(`Local: ${expectedLocal}`),
      `Expected Local: ${expectedLocal}, but got: ${result}`,
    )
  })

  it('should return correct UTC and local time for a timestamp in the past', async function () {
    const result = await hre.run(
      { scope: 'util', task: 'timestamp-to-human' },
      {
        timestamp: '0', // 1 January 1970 00:00:00 UTC (Unix Epoch)
      },
    )

    // Expected UTC time
    const expectedUtc = 'Thu, 01 Jan 1970 00:00:00 GMT' // Convert timestamp to UTC
    const expectedLocal = new Date(0).toString() // Local time

    // The result should include both UTC and local time
    assert(
      result.includes(`UTC: ${expectedUtc}`),
      `Expected UTC: ${expectedUtc}, but got: ${result}`,
    )
    assert(
      result.includes(`Local: ${expectedLocal}`),
      `Expected Local: ${expectedLocal}, but got: ${result}`,
    )
  })
})
