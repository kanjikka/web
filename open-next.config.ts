// https://github.com/jetbridge/cdk-nextjs/issues/250
const config = {
  default: {
    install: {
      packages: ["sharp, better-sqlite3"],
      arch: "arm64",
      additionalArgs: "--shamefully-hoist --cpu=arm64 --os=linux --libc=glibc",
    },
  },
};

export default config;
