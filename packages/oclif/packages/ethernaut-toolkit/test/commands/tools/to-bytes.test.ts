import {expect, test} from '@oclif/test'

describe('to-bytes', () => {
  test
  .stdout()
  .command(['to-bytes'])
  .it('runs hello', ctx => {
    expect(ctx.stdout).to.contain('hello world')
  })

  test
  .stdout()
  .command(['to-bytes', '--name', 'jeff'])
  .it('runs hello --name jeff', ctx => {
    expect(ctx.stdout).to.contain('hello jeff')
  })
})
