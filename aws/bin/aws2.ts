#!/usr/bin/env node
//import * as cdk from 'aws-cdk-lib';
//import { Aws2Stack } from '../lib/aws2-stack';
//
//const app = new cdk.App();
//new Aws2Stack(app, 'Aws2Stack', {
//  /* If you don't specify 'env', this stack will be environment-agnostic.
//   * Account/Region-dependent features and context lookups will not work,
//   * but a single synthesized template can be deployed anywhere. */
//
//  /* Uncomment the next line to specialize this stack for the AWS Account
//   * and Region that are implied by the current CLI configuration. */
//  // env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
//
//  /* Uncomment the next line if you know exactly what Account and Region you
//   * want to deploy the stack to. */
//  // env: { account: '123456789012', region: 'us-east-1' },
//
//  /* For more information, see https://docs.aws.amazon.com/cdk/latest/guide/environments.html */
//});
//
import * as cdk from "aws-cdk-lib";
import { WebStack } from "../lib/webstack";
const app = new cdk.App();

new WebStack(app, "kanjikka-web", {
  env: {
    account: process.env.AWS_ACCOUNT,
    region: process.env.AWS_REGION,
  },
  domainName: "kanjikka.com",
  alternativeDomainNames: ["www.kanjikka.com"],
  publicURL: "https://kanjikka.com",
});
