import {Hook} from '@oclif/core'

const hook: Hook<'postrun'> = async function (opts) {
  console.log('Postrun hook')
}

export default hook
