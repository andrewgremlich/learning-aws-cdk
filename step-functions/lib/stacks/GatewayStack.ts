import * as cdk from "aws-cdk-lib";
import { LambdaIntegration, RestApi } from "aws-cdk-lib/aws-apigateway";
import { Construct } from "constructs";

interface GatewayStackProps extends cdk.StackProps {
  lambdaIntegration: LambdaIntegration;
}

export class GatewayStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: GatewayStackProps) {
    super(scope, id, props);

    const api = new RestApi(this, "StepFunctionsApi");
    const helloResource = api.root.addResource("hello");

    helloResource.addMethod("GET", props.lambdaIntegration);
  }
}
