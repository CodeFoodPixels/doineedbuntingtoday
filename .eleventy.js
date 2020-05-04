module.exports = function (config) {
  config.addPassthroughCopy("src/images");
  config.addPassthroughCopy("src/fonts");
  config.addPassthroughCopy("src/favicon.ico");
  return {
    dir: {
      input: "src",
      output: "dist",
    },
    passthroughFileCopy: true,
  };
};
