const axios = require('axios')
const debug = require('ethernaut-common/src/ui/debug')

// See GraphQL playground for this API here: https://cloud.hasura.io/public/graphiql?endpoint=https://opensource-observer.hasura.app/v1/graphql

class OpenSourceObserver {
  constructor() {
    this.graphqlUrl = 'https://opensource-observer.hasura.app/v1/graphql'
  }

  async getProjects(filter = '', limit = 1000) {
    const data = await this.makeGraphQLRequest(
      `
        query GetProjects {
          projects(
            where: {project_name: {_ilike: "%${filter}%"}}
            limit: ${limit}
          ) {
            count_blockchain_artifacts
            count_github_artifacts
            count_npm_artifacts
            project_id
            project_name
            project_slug
            user_namespace
          }
        }
    `,
      {},
    )

    return data.projects
  }

  async getChainMetrics(filter = '', limit = 1000) {
    const data = await this.makeGraphQLRequest(
      `
        query GetChainMetrics {
          onchain_metrics_by_project(
            where: {project_name: {_ilike: "%${filter}%"}}
            limit: ${limit}
          ) {
            active_users
            first_txn_date
            high_frequency_users
            l2_gas_6_months
            less_active_users
            more_active_users
            multi_project_users
            network
            new_user_count
            num_contracts
            project_id
            project_name
            project_slug
            total_l2_gas
            total_txns
            total_users
            txns_6_months
            users_6_months
          }
        }
    `,
      {},
    )

    return data.onchain_metrics_by_project
  }

  async getCodeMetrics(filter = '', limit = 1000) {
    const data = await this.makeGraphQLRequest(
      `
        query GetCodeMetrics {
          code_metrics_by_project(
            where: { project_name: { _ilike: "%${filter}%" } }
            order_by: { avg_active_devs_6_months: desc_nulls_last }
            limit: ${limit}
          ) {
            project_id
            project_name
            project_slug
            repositories
            avg_active_devs_6_months
            avg_fulltime_devs_6_months
            contributors
            contributors_6_months
            new_contributors_6_months
            first_commit_date
            last_commit_date
            forks
            stars
            issues_closed_6_months
            issues_opened_6_months
            pull_requests_merged_6_months
            pull_requests_opened_6_months
            commits_6_months
          }
        }
    `,
      {},
    )

    return data.code_metrics_by_project
  }

  async makeGraphQLRequest(query) {
    const response = await axios.post(
      this.graphqlUrl,
      {
        query,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          // Include the Authorization header if needed
          // 'Authorization': 'Bearer YOUR_AUTH_TOKEN',
        },
      },
    )

    debug.log(
      `GraphQL response: ${JSON.stringify(response.data, null, 2)}`,
      'oso',
    )

    return response.data.data
  }
}

module.exports = OpenSourceObserver
