const core = require('@actions/core')
const {ConfigParser} = require('./config-parser')

// Return the settings to be passed to a {ConfigParser} for a given
// static site generator and a Pages path value to inject
function getConfigParserSettings(staticSiteGenerator, path) {
  switch (staticSiteGenerator) {
    case 'nuxt':
      return {
        configurationFile: './nuxt.config.js',
        blankConfigurationFile: `${__dirname}/blank-configurations/nuxt.js`,
        properties: {
          // Configure a base path on the router
          'router.base': path,

          // Set the target to static too
          // https://nuxtjs.org/docs/configuration-glossary/configuration-target/
          target: 'static'
        }
      }
    case 'next':
      // Next does not want a trailing slash
      if (path.endsWith('/')) {
        path = path.slice(0, -1)
      }

      return {
        configurationFile: './next.config.js',
        blankConfigurationFile: `${__dirname}/blank-configurations/next.js`,
        properties: {
          // Configure a base path
          basePath: path,

          // Disable server side image optimization too
          // https://nextjs.org/docs/api-reference/next/image#unoptimized
          'experimental.images.unoptimized': true
        }
      }
    case 'gatsby':
      return {
        configurationFile: './gatsby-config.js',
        blankConfigurationFile: `${__dirname}/blank-configurations/gatsby.js`,
        properties: {
          // Configure a path prefix
          pathPrefix: path
        }
      }
    default:
      throw `Unsupported static site generator: ${staticSiteGenerator}`
  }
}

// Inject Pages configuration in a given static site generator's configuration file
function setPagesPath({staticSiteGenerator, path}) {
  try {
    // Parse the configuration file and try to inject the Pages configuration in it
    const settings = getConfigParserSettings(staticSiteGenerator, path)
    new ConfigParser(settings).injectAll()
  } catch (error) {
    // Logging
    core.warning(
      `We were unable to determine how to inject the site metadata into your config. Generated URLs may be incorrect. The base URL for this site should be ${path}. Please ensure your framework is configured to generate relative links appropriately.`,
      error
    )
  }
}

module.exports = {getConfigParserSettings, setPagesPath}
