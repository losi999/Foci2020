import { default as handler } from '@/functions/post-deploy/post-deploy-handler';
import { postDeployServiceFactory } from '@/functions/post-deploy/post-deploy-service';
import { cloudFormation, lambda } from '@/dependencies';

const postDeployService = postDeployServiceFactory(cloudFormation, lambda);

export default handler(postDeployService);
