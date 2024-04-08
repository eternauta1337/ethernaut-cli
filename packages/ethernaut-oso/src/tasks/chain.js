const output = require('ethernaut-common/src/ui/output')
const OpenSourceObserver = require('../internal/oso')
const types = require('ethernaut-common/src/validation/types')
const EthernautCliError = require('ethernaut-common/src/error/error')
const Strs = require('ethernaut-common/src/ui/strs')

require('../scopes/metrics')
  .task(
    'chain',
    'Prints Open Source Observer onchain metrics for a project, including number of contracts, active users, gas usage, and more',
  )
  .addPositionalParam(
    'name',
    'The name or slug of the project',
    undefined,
    types.string,
  )
  .addOptionalParam('limit', 'Number of projects to list', 10, types.int)
  .setAction(async ({ name, limit }) => {
    try {
      const oso = new OpenSourceObserver()

      const projects = await oso.getChainMetrics(name, limit)

      if (projects.length === 0) {
        throw new EthernautCliError(
          'ethernaut-oso',
          `No projects found for "${name}"`,
        )
      }

      const buffer = []
      for (const project of projects) {
        const strs = new Strs(project)
        strs.push(`Project: ${project.project_name} (${project.project_slug})`)
        strs.push(`Active users: ${project.active_users}`)
        strs.push(`First transaction date: ${project.first_txn_date}`)
        strs.push(`High frequency users: ${project.high_frequency_users}`)
        strs.push(`L2 gas (6 months): ${project.l2_gas_6_months}`)
        strs.push(`Less active users: ${project.less_active_users}`)
        strs.push(`More active users: ${project.more_active_users}`)
        strs.push(`Multi project users: ${project.multi_project_users}`)
        strs.push(`Network: ${project.network}`)
        strs.push(`New user count: ${project.new_user_count}`)
        strs.push(`Number of contracts: ${project.num_contracts}`)
        strs.push(`Total L2 gas: ${project.total_l2_gas}`)
        strs.push(`Total transactions: ${project.total_txns}`)
        strs.push(`Total users: ${project.total_users}`)
        strs.push(`Transactions (6 months): ${project.txns_6_months}`)
        strs.push(`Users (6 months): ${project.users_6_months}`)
        const str = strs.print()
        output.resultBox(str)
        buffer.push(str)
      }

      return buffer
    } catch (err) {
      return output.errorBox(err)
    }
  })
