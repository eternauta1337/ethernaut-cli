const output = require('ethernaut-common/src/ui/output')
const OpenSourceObserver = require('../internal/oso')
const types = require('ethernaut-common/src/validation/types')
const EthernautCliError = require('ethernaut-common/src/error/error')

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
  .setAction(async ({ name }) => {
    try {
      const oso = new OpenSourceObserver()

      const projects = await oso.getChainMetrics(name)

      if (projects.length === 0) {
        throw new EthernautCliError(
          'ethernaut-oso',
          `No projects found for "${name}"`,
        )
      }

      const project = projects[0]

      const strs = []
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

      return output.resultBox(strs.join('\n'))
    } catch (err) {
      return output.errorBox(err)
    }
  })
