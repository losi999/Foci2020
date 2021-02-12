import { IInfrastructureService, infrastructureServiceFactory } from '@foci2020/shared/services/infrastructure-service';
import { Mock, createMockService, awsResolvedValue, awsRejectedValue, validateError } from '@foci2020/shared/common/unit-testing';
import { CloudFormation, Lambda } from 'aws-sdk';
import { Stack } from 'aws-sdk/clients/cloudformation';

describe('Infrastructure service', () => {
  let service: IInfrastructureService;
  let mockCloudformation: Mock<CloudFormation>;
  let mockLambda: Mock<Lambda>;

  beforeEach(() => {
    mockCloudformation = createMockService('describeStacks');
    mockLambda = createMockService('invoke');

    service = infrastructureServiceFactory(mockCloudformation.service, mockLambda.service);
  });

  describe('executePostDeployFunctions', () => {
    const stackName = 'stackName';

    it('should return undefined if post deploy functions are executed', async () => {
      const lambdaArn = 'lambda.arn';
      const stacks = [
        {
          Outputs: [
            {
              OutputKey: 'PostDeploy1',
              OutputValue: lambdaArn,
            },
          ],
        },
      ] as Stack[];
      mockCloudformation.functions.describeStacks.mockReturnValue(awsResolvedValue({
        Stacks: stacks,
      }));

      mockLambda.functions.invoke.mockReturnValue(awsResolvedValue(undefined));

      const result = await service.executePostDeployFunctions(stackName);
      expect(result).toBeUndefined();
      expect(mockCloudformation.functions.describeStacks).toHaveBeenCalledWith({
        StackName: stackName,
      });
      expect(mockLambda.functions.invoke).toHaveBeenCalledWith({
        FunctionName: lambdaArn,
      });
      expect.assertions(3);
    });

    it('should throw error if unable to get stack outputs', async () => {
      const errorMessage = 'This is a cloudformation error';
      mockCloudformation.functions.describeStacks.mockReturnValue(awsRejectedValue({
        message: errorMessage,
      }));

      await service.executePostDeployFunctions(stackName).catch(validateError(errorMessage));
      expect(mockCloudformation.functions.describeStacks).toHaveBeenCalledWith({
        StackName: stackName,
      });
      expect(mockLambda.functions.invoke).not.toHaveBeenCalled();
      expect.assertions(3);
    });

    it('should throw error if unable to execute function', async () => {
      const lambdaArn = 'lambda.arn';
      const stacks = [
        {
          Outputs: [
            {
              OutputKey: 'PostDeploy1',
              OutputValue: lambdaArn,
            },
          ],
        },
      ] as Stack[];
      mockCloudformation.functions.describeStacks.mockReturnValue(awsResolvedValue({
        Stacks: stacks,
      }));

      const errorMessage = 'This is a cloudformation error';
      mockLambda.functions.invoke.mockReturnValue(awsRejectedValue({
        message: errorMessage,
      }));

      await service.executePostDeployFunctions(stackName).catch(validateError(errorMessage));
      expect(mockCloudformation.functions.describeStacks).toHaveBeenCalledWith({
        StackName: stackName,
      });
      expect(mockLambda.functions.invoke).toHaveBeenCalledWith({
        FunctionName: lambdaArn,
      });
      expect.assertions(3);
    });
  });
});
