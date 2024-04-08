const output = require('ethernaut-common/src/ui/output')
const OpenSourceObserver = require('../internal/oso')
const types = require('ethernaut-common/src/validation/types')
const EthernautCliError = require('ethernaut-common/src/error/error')

require('../scopes/oso')
  .task(
    'metrics',
    'Prints Open Source Observer code metrics for a project, including number of Github stars, commits, contributors, and more',
  )
  .addPositionalParam(
    'name',
    'The name or slug of the project',
    '',
    types.string,
  )
  .setAction(async ({ name }) => {
    try {
      const oso = new OpenSourceObserver()

      const projects = await oso.getCodeMetrics(name)

      if (projects.length === 0) {
        throw new EthernautCliError(
          'ethernaut-oso',
          `No projects found for "${name}"`,
        )
      }

      const project = projects[0]

      let str = ''
      str += `Project: ${project.project_name} (${project.project_slug})\n`
      str += `Stars: ${project.stars}\n`
      str += `Last commit date: ${project.last_commit_date}\n`
      str += `Commits (6 months): ${project.commits_6_months}\n`
      str += `Number of repositories: ${project.repositories}\n`
      str += `Average active devs (6 months): ${project.avg_active_devs_6_months}\n`
      str += `Contributors: ${project.contributors}\n`
      str += `Contributors (6 months): ${project.contributors_6_months}\n`
      str += `New contributors (6 months): ${project.new_contributors_6_months}\n`
      str += `Forks: ${project.forks}\n`
      str += `Issues closed (6 months): ${project.issues_closed_6_months}\n`
      str += `Issues opened (6 months): ${project.issues_opened_6_months}\n`
      str += `Pull requests merged (6 months): ${project.pull_requests_merged_6_months}\n`
      str += `Pull requests opened (6 months): ${project.pull_requests_opened_6_months}`

      return output.resultBox(str)
    } catch (err) {
      return output.errorBox(err)
    }
  })
