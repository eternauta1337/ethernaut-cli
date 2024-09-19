const axios = require('axios')
const debug = require('ethernaut-common/src/ui/debug')
const { checkEnvVar } = require('ethernaut-common/src/io/env')

// See GraphQL playground for this API here: https://www.opensource.observer/graphql

class OpenSourceObserver {
  constructor() {
    this.graphqlUrl = 'https://www.opensource.observer/api/v1/graphql'
  }

  async getProjects(filter = '', limit = 1000) {
    const data = await this.makeGraphQLRequest(
      `
        query GetProjects {
          oso_projectsV1(
            where: {projectName: {_ilike: "%${filter}%"}}
            limit: ${limit}
          ) {
            description
            displayName
            projectId
            projectName
            projectNamespace
            projectSource
          }
        }
    `,
      {},
    )

    return data['oso_projectsV1']
  }

  static getCodeMetricsFields() {
    return [
      'activeDeveloperCount6Months',
      'closedIssueCount6Months',
      'commitCount6Months',
      'contributorCount',
      'contributorCount6Months',
      'displayName',
      'eventSource',
      'firstCommitDate',
      'forkCount',
      'fulltimeDeveloperAverage6Months',
      'lastCommitDate',
      'mergedPullRequestCount6Months',
      'newContributorCount6Months',
      'openedIssueCount6Months',
      'openedPullRequestCount6Months',
      'projectId',
      'projectName',
      'projectNamespace',
      'projectSource',
      'repositoryCount',
      'starCount',
    ]
  }

  async getCodeMetrics(filter = '', limit = 1000, sort = 'starCount') {
    const data = await this.makeGraphQLRequest(
      `
        query GetCodeMetrics {
          oso_codeMetricsByProjectV1(
            where: { projectName: { _ilike: "%${filter}%" } }
            order_by: { ${sort}: Desc }
            limit: ${limit}
          ) {
            ${OpenSourceObserver.getCodeMetricsFields().join('\n')}
          }
        }
    `,
      {},
    )

    return data['oso_codeMetricsByProjectV1']
  }

  static getChainMetricsFields() {
    return [
      'activeContractCount90Days',
      'addressCount',
      'addressCount90Days',
      'daysSinceFirstTransaction',
      'displayName',
      'eventSource',
      'gasFeesSum',
      'gasFeesSum6Months',
      'highActivityAddressCount90Days',
      'lowActivityAddressCount90Days',
      'mediumActivityAddressCount90Days',
      'multiProjectAddressCount90Days',
      'newAddressCount90Days',
      'projectId',
      'projectName',
      'projectNamespace',
      'projectSource',
      'returningAddressCount90Days',
      'transactionCount',
      'transactionCount6Months',
    ]
  }

  async getChainMetrics(
    filter = '',
    limit = 1000,
    sort = 'addressCount90Days',
  ) {
    const data = await this.makeGraphQLRequest(
      `
        query GetChainMetrics {
          oso_onchainMetricsByProjectV1(
            where: {projectName: {_ilike: "%${filter}%"}}
            order_by: { ${sort}: Desc }
            limit: ${limit}
          ) {
            ${OpenSourceObserver.getChainMetricsFields().join('\n')}
          }
        }
    `,
      {},
    )

    return data['oso_onchainMetricsByProjectV1']
  }

  async makeGraphQLRequest(query) {
    await checkEnvVar(
      'OSO_DEVELOPER_API_KEY',
      'This is required by the oso package to interact with the oso API.',
    )

    const response = await axios.post(
      this.graphqlUrl,
      {
        query,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OSO_DEVELOPER_API_KEY}`,
          'Content-Type': 'application/json',
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
