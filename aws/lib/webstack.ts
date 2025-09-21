import { App, CfnOutput, Stack, StackProps } from "aws-cdk-lib";
import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { Nextjs } from "cdk-nextjs-standalone";

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
