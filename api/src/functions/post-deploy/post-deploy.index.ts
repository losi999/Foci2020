import { default as handler } from '@/functions/post-deploy/post-deploy-handler';
import { postDeployServiceFactory } from '@/functions/post-deploy/post-deploy-service';
import { infrastructureService } from '@/dependencies';

const postDeployService = postDeployServiceFactory(infrastructureService);

export default handler(postDeployService);
