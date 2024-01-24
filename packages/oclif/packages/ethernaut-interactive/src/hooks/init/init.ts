import {Hook} from '@oclif/core'

const hook: Hook<'init'> = async function (opts) {
  console.log('Init hook')
  // console.log(opts)
  console.log(opts.config.pjson.oclif)
}

export default hook
