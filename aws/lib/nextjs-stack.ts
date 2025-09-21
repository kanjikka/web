import { App, Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { NextjsGlobalFunctions } from "cdk-nextjs";
import { join } from "node:path";
import { FckNatInstanceProvider } from "cdk-fck-nat";
import {
  InstanceClass,
  InstanceSize,
  InstanceType,
  Peer,
  Port,
  Vpc,
} from "aws-cdk-lib/aws-ec2";
import { readdirSync } from "node:fs";
import { PriceClass } from "aws-cdk-lib/aws-cloudfront";

export class NextjsStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const vpc = this.#createVpc();
    new NextjsGlobalFunctions(this, "Nextjs", {
      healthCheckPath: "/api/health",
      buildContext: join(__dirname, "../.."),
      overrides: {
        nextjsDistribution: {
          distributionProps: {
            priceClass: PriceClass.PRICE_CLASS_100,
          },
        },
        nextjsGlobalFunctions: {
          //          nextjsBuildProps: {
          //            builderImageProps: {
          //              exclude: getBuilderImageExcludeDirectories(),
          //            },
          //          },
          nextjsVpcProps: {
            vpc,
          },
        },
      },
    });
  }

  #createVpc() {
    const natGatewayProvider = new FckNatInstanceProvider({
      instanceType: InstanceType.of(InstanceClass.T4G, InstanceSize.NANO),
    });
    const vpcName = this.stackName + "FckNatVpc";
    const vpc = new Vpc(this, vpcName, {
      natGatewayProvider,
      vpcName,
    });
    natGatewayProvider.securityGroup.addIngressRule(
      Peer.ipv4(vpc.vpcCidrBlock),
      Port.allTraffic()
    );
    return vpc;
  }
}

function getBuilderImageExcludeDirectories(): string[] {
  const include = [
    "app-playground",
    "pnpm-lock.yaml",
    "pnpm-workspace.yaml",
    "tsconfig.json",
    "package.json",
    "package-lock.json",
  ];
  const dirname = __dirname;

  return [
    "**/node_modules",
    "**/.next",
    ...readdirSync(join(dirname, "../..")).filter(
      (name) => !include.includes(name)
    ),
  ];
}
