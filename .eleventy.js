module.exports = function (config) {
  config.addPassthroughCopy("src/images");
  config.addPassthroughCopy("src/fonts");
  config.addPassthroughCopy("src/favicon.ico");

  config.addFilter("sentencejoin", (items, finalJoiner) => {
    return items.length > 1
      ? `${items.slice(0, -1).join(", ")} ${finalJoiner} ${items.slice(-1)}`
      : items[0];
  });

  config.addFilter("debug", (data) => {
    debugger;
  });

  return {
    dir: {
      input: "src",
      output: "dist",
    },
    passthroughFileCopy: true,
  };
};
