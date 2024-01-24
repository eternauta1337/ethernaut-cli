import {Hook} from '@oclif/core'

const hook: Hook<'command_not_found'> = async function (opts) {
  console.log('Command not found hook')
}

export default hook
