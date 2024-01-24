import {Hook} from '@oclif/core'

const hook: Hook<'prerun'> = async function (opts) {
  console.log('Prerun hook')
}

export default hook
