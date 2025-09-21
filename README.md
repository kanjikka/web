# Development
## Getting Started

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


# Things to now
`node subpath.js` to test running under a subpath


# Things to keep in mind
https://github.com/jetbridge/cdk-nextjs/issues/262

only node 22.16.0 seem to generate a .bin directory

Also had to first deploy a simple version, then increased the ephemeral storage to 1GB of the kanjikka-web-NextjsStaticAssetsBucketDeploymentFn lambda
