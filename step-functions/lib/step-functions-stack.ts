import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { LambdaStack } from "./stacks/LambdaStack";
import { GatewayStack } from "./stacks/GatewayStack";

export class StepFunctionsStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const lambdaStack = new LambdaStack(this, "LambdaStack");

    new GatewayStack(this, "GatewayStack", {
      lambdaIntegration: lambdaStack.lambdaIntegration,
    });
  }
}
