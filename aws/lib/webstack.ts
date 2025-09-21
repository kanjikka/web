import { CfnOutput, Stack, StackProps } from "aws-cdk-lib";
import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { Nextjs } from "cdk-nextjs-standalone";
import * as lambda from "aws-cdk-lib/aws-lambda";

type Props = StackProps & {
  domainName: string;
  alternativeDomainNames: string[];
  publicURL: string;
};
export class WebStack extends Stack {
  constructor(scope: Construct, id: string, props: Props) {
    super(scope, id, props);

    const zone = cdk.aws_route53.HostedZone.fromLookup(
      this,
      "ZoneCertificate",
      {
        domainName: props.domainName,
      }
    );

    const certificate = new cdk.aws_certificatemanager.DnsValidatedCertificate(
      this,
      "SiteCertificate",
      {
        domainName: props.domainName,
        subjectAlternativeNames: props.alternativeDomainNames,
        hostedZone: zone,
        // It needs to be us-east-1 so that cloudfront works
        region: "us-east-1",
        validation:
          cdk.aws_certificatemanager.CertificateValidation.fromDns(zone),
      }
    );

    const nextjs = new Nextjs(this, "Nextjs", {
      nextjsPath: "../", // relative path from your project root to NextJS
      //      architecture: lambda.Architecture.X86_64, // 👈 force x86_64
      overrides: {
        nextjsServer: {
          functionProps: {
            // So that it uses the same as from asdf (.tool-versions)
            runtime: lambda.Runtime.NODEJS_22_X,
            // It uses ARM_64 by default, but just to make it crystal clear
            architecture: lambda.Architecture.ARM_64,
          },
        },
      },
      domainProps: {
        domainName: props.domainName,
        certificate: certificate,
        hostedZone: zone,
      },
      environment: {
        NEXT_PUBLIC_BASE_URL: props.publicURL,
      },
    });
    new CfnOutput(this, "CloudFrontDistributionDomain", {
      value: nextjs.distribution.distributionDomain,
    });
  }
}
