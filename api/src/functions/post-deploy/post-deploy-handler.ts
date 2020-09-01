import { Handler } from 'aws-lambda';
import { IPostDeployService } from '@foci2020/api/functions/post-deploy/post-deploy-service';

export default (postDeploy: IPostDeployService): Handler =>
  async () => {
    await postDeploy({
      stackName: process.env.INFRASTRUCTURE_STACK
    });
  };
