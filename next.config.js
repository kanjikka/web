module.exports = {
  basePath:
    process.env.NODE_ENV === "development"
      ? undefined
      : "/japanese-writing-practice",
  output: "export",
  typescript: {
    // TODO: fix this
    // ignoreBuildErrors: true,
  },
};
