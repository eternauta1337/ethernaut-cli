import {Args, Command, Flags} from '@oclif/core'

export default class Units extends Command {
  static args = {
    amount: Args.integer({description: 'amount to be converted'}),
  }

  static description = 'Converts between different units of ether'

  static examples = ['<%= config.bin %> <%= command.id %> units 1 --from ether --to wei']

  static flags = {
    from: Flags.string({char: 'f', description: 'unit to convert from'}), // TODO: Use Flags.custom to show options
    to: Flags.string({char: 't', description: 'unit to convert to'}), // TODO: Use Flags.custom to show options
  }

  public async run(): Promise<void> {
    const {args, flags} = await this.parse(Units)

    const amount = args.amount ?? 0
    const from = flags.from ?? 'ether'
    const to = flags.to ?? 'wei'

    const result = amount * 1000 // TODO: Implement conversion logic

    this.log(`${amount} ${from} = ${result} ${to}`)
  }
}
