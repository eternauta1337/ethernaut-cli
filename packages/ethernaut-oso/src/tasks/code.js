const output = require('ethernaut-common/src/ui/output')
const OpenSourceObserver = require('../internal/oso')
const types = require('ethernaut-common/src/validation/types')
const EthernautCliError = require('ethernaut-common/src/error/error')
const Strs = require('ethernaut-common/src/ui/strs')

require('../scopes/metrics')
  .task(
    'code',
    'Prints Open Source Observer code metrics for a project, including number of Github stars, commits, contributors, and more',
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

      const projects = await oso.getCodeMetrics(name)

      if (projects.length === 0) {
        throw new EthernautCliError(
          'ethernaut-oso',
          `No projects found for "${name}"`,
        )
      }

      const project = projects[0]

      const strs = new Strs(project)
      strs.push(`Project: ${project.project_name} (${project.project_slug})`)
      strs.push(`Stars: ${project.stars}`)
      strs.push(`Last commit date: ${project.last_commit_date}`)
      strs.push(`Commits (6 months): ${project.commits_6_months}`)
      strs.push(`Number of repositories: ${project.repositories}`)
      strs.push(
        `Average active devs (6 months): ${project.avg_active_devs_6_months}`,
      )
      strs.push(`Contributors: ${project.contributors}`)
      strs.push(`Contributors (6 months): ${project.contributors_6_months}`)
      strs.push(
        `New contributors (6 months): ${project.new_contributors_6_months}`,
      )
      strs.push(`Forks: ${project.forks}`)
      strs.push(`Issues closed (6 months): ${project.issues_closed_6_months}`)
      strs.push(`Issues opened (6 months): ${project.issues_opened_6_months}`)
      strs.push(
        `Pull requests merged (6 months): ${project.pull_requests_merged_6_months}`,
      )
      strs.push(
        `Pull requests opened (6 months): ${project.pull_requests_opened_6_months}`,
      )

      return output.resultBox(strs.print())
    } catch (err) {
      return output.errorBox(err)
    }
  })
