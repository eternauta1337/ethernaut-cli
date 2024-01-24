import {Command} from '@oclif/core'

export default class Tools extends Command {
  static args = {}

  static description = 'Navigate tools'

  static examples = ['<%= config.bin %> <%= command.id %>']

  static flags = {}

  async run(): Promise<void> {
    // const {args, flags} = await this.parse(Tools)

    this.log(`Running tools topic command`)
  }
}
