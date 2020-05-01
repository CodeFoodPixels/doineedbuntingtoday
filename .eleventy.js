module.exports = function (config) {
  config.addPassthroughCopy("src/images");
  config.addPassthroughCopy("src/fonts");
  return {
    dir: {
      input: "src",
      output: "dist",
    },
    passthroughFileCopy: true,
  };
};
