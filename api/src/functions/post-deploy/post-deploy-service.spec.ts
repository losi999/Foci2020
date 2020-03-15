import { IPostDeployService, postDeployServiceFactory } from '@/functions/post-deploy/post-deploy-service';
import { Mock, createMockService, validateError } from '@/common/unit-testing';
import { IInfrastructureService } from '@/services/infrastructure-service';

describe('Post deploy service', () => {
  let service: IPostDeployService;
  let mockInfrastructureService: Mock<IInfrastructureService>;

  beforeEach(() => {
    mockInfrastructureService = createMockService('executePostDeployFunctions');

    service = postDeployServiceFactory(mockInfrastructureService.service);
  });

  const stackName = 'stackName';

  it('should return undefined if every post deploy function is executed successfully', async () => {
    mockInfrastructureService.functions.executePostDeployFunctions.mockResolvedValue(undefined);

    const result = await service({
      stackName
    });
    expect(result).toBeUndefined();
    expect(mockInfrastructureService.functions.executePostDeployFunctions).toHaveBeenCalledWith(stackName);
    expect.assertions(2);
  });

  it('should throw error if a post deploy function fails', async () => {
    const errorMessage = 'This is an error';
    mockInfrastructureService.functions.executePostDeployFunctions.mockRejectedValue({
      message: errorMessage
    });

    await service({
      stackName
    }).catch(validateError(errorMessage));
    expect(mockInfrastructureService.functions.executePostDeployFunctions).toHaveBeenCalledWith(stackName);
    expect.assertions(2);
  });
});
