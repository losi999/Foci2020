import { IInfrastructureService } from '@/services/infrastructure-service';

export interface IPostDeployService {
  (ctx: {
    stackName: string;
  }): Promise<void>;
}

export const postDeployServiceFactory = (infrastructureService: IInfrastructureService): IPostDeployService =>
  async ({ stackName }) => {
    await infrastructureService.executePostDeployFunctions(stackName);
  };
