require('ts-node').register({ files: true });

module.exports = {
  siteMetadata: {
    title: `Electron + Gatsby Template`,
    description: `Kick off your next, great Gatsby project with this default starter. This barebones starter ships with the main Gatsby configuration files you might need.`,
    author: `@gatsbyjs`,
  },
  plugins: [`gatsby-plugin-typescript`, `gatsby-plugin-postcss`],
};
