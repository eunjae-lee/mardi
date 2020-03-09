export const plugins = ['mardi-plugin-apps', 'mardi-plugin-color'].map(
  name => ({
    name,
    module: require(name),
  })
);
