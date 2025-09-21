// https://github.com/jetbridge/cdk-nextjs/issues/250
const config = {
  default: {
    install: {
      packages: ["sharp, better-sqlite3"],
      arch: "arm64",
      additionalArgs: "--shamefully-hoist --cpu=arm64 --os=linux --libc=glibc",
    },
    copyFiles: [
      {
        from: "node_modules/better-sqlite3/build/Release/better_sqlite3.node",
        to: "node_modules/better-sqlite3/build/Release/better_sqlite3.node",
      },
    ],
  },
};

export default config;
