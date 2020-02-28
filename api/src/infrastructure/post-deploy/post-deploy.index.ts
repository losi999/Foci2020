import { default as handler } from '@/infrastructure/post-deploy/post-deploy-handler';
import { postDeployServiceFactory } from '@/infrastructure/post-deploy/post-deploy-service';
import { cloudFormation, lambda } from '@/shared/dependencies';

const postDeployService = postDeployServiceFactory(cloudFormation, lambda);

export default handler(postDeployService);
