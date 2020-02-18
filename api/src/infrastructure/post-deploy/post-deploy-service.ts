import { CloudFormation, Lambda } from 'aws-sdk';

export interface IPostDeployService {
  (ctx: {
    stackName: string;
  }): Promise<void>;
}

export const postDeployServiceFactory = (cloudFormation: CloudFormation, lambda: Lambda): IPostDeployService =>
  async ({ stackName }) => {

    const infraStack = (await cloudFormation.describeStacks({
      StackName: stackName
    }).promise()).Stacks[0];
    const steps = infraStack.Outputs.filter(output => output.OutputKey.startsWith('PostDeploy') && !!output.OutputValue);

    await Promise.all(steps.map(s => lambda.invoke({
      FunctionName: s.OutputValue
    }).promise()));
  };
