const path = require("path");
const fs = require("fs");

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

  webpack(config) {
    // Copy sqlite.db into the standalone folder
    const dbSource = path.resolve(__dirname, "data", "sqlite.db");
    const dbDest = path.resolve(__dirname, ".next/standalone/data/sqlite.db");

    if (!fs.existsSync(path.dirname(dbDest))) {
      fs.mkdirSync(path.dirname(dbDest), { recursive: true });
    }
    fs.copyFileSync(dbSource, dbDest);

    return config;
  },

  // TODO: only ignore aws folder
  //  eslint: {
  //    ignoreBuildErrors: true,
  //  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};
