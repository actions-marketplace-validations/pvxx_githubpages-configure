const core = require('@actions/core')

// Load variables from Actions runtime
function getRequiredVars() {
  return {
    repositoryNwo: process.env.GITHUB_REPOSITORY,
    githubToken: core.getInput('token'),
    staticSiteGenerator: core.getInput('static_site_generator')
  }
}

// Return the context object
function getContext() {
  const requiredVars = getRequiredVars()
  for (const variable in requiredVars) {
    if (requiredVars[variable] === undefined) {
      throw new Error(`${variable} is undefined. Cannot continue.`)
    }
  }
  core.debug('all variables are set')
  return requiredVars
}

module.exports = {getContext}
