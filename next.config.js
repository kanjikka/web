module.exports = {
  //  basePath:
  //    process.env.NODE_ENV === "development"
  //      ? undefined
  //      : "/japanese-writing-practice",
  //  output: "export",
  output: "standalone",
  typescript: {
    // TODO: fix this
    // ignoreBuildErrors: true,
  },

  // TODO: only ignore aws folder
  //  eslint: {
  //    ignoreBuildErrors: true,
  //  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};
