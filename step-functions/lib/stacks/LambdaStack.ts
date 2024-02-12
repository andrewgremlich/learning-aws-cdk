import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";

import * as lambda from "aws-cdk-lib/aws-lambda";
import { LambdaIntegration } from "aws-cdk-lib/aws-apigateway";
import { join } from "path";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";

import * as sfn from "aws-cdk-lib/aws-stepfunctions";
import * as tasks from "aws-cdk-lib/aws-stepfunctions-tasks";

export class LambdaStack extends cdk.Stack {
  public readonly lambdaIntegration: LambdaIntegration;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const helloFunction = new NodejsFunction(this, "MyLambdaFunction", {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: "handler",
      entry: join(__dirname, "..", "..", "src", "lambda", "hello.ts"),
    });

    const stateMachine = new sfn.StateMachine(this, "MyStateMachine", {
      definition: new tasks.LambdaInvoke(this, "MyLambdaTask", {
        lambdaFunction: helloFunction,
      }).next(new sfn.Succeed(this, "GreetedWorld")),
    });

    this.lambdaIntegration = new LambdaIntegration(helloFunction);
  }
}
