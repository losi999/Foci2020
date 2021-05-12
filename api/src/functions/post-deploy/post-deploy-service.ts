import { IInfrastructureService } from '@foci2020/shared/services/infrastructure-service';

export interface IPostDeployService {
  (ctx: {
    stackName: string;
  }): Promise<void>;
}

export const postDeployServiceFactory = (infrastructureService: IInfrastructureService): IPostDeployService =>
  async ({ stackName }) => {
    await infrastructureService.executePostDeployFunctions(stackName);
  };
