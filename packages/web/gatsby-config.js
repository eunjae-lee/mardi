require('ts-node').register({ files: true });

module.exports = {
  siteMetadata: {
    title: `Mardi`,
  },
  plugins: [`gatsby-plugin-typescript`, `gatsby-plugin-postcss`],
};
