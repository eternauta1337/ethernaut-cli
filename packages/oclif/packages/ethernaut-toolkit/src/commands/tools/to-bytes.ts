import {Args, Command} from '@oclif/core'

export default class ToBytes extends Command {
  static args = {
    value: Args.string({description: 'value to convert to bytes'}),
  }

  static description = 'Converts a string value to its utf8 bytes representation'

  static examples = ['<%= config.bin %> <%= command.id %> "SNX"']

  static flags = {}

  public async run(): Promise<void> {
    const {args} = await this.parse(ToBytes)

    const value = args.value ?? ''

    const result = '0x123...'

    this.log(`${value} to bytes is ${result}`)
  }
}
