const axios = require('axios')
const debug = require('ethernaut-common/src/ui/debug')

class OpenSourceObserver {
  constructor() {
    this.graphqlUrl = 'https://opensource-observer.hasura.app/v1/graphql'
  }

  async getProjects(filter, limit) {
    const data = await this.makeGraphQLRequest(
      `
        query MyQuery {
          projects(where: {project_name: {_ilike: "%${filter}%"}}, limit: ${limit}) {
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
