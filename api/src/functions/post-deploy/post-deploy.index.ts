import { default as handler } from '@foci2020/api/functions/post-deploy/post-deploy-handler';
import { postDeployServiceFactory } from '@foci2020/api/functions/post-deploy/post-deploy-service';
import { infrastructureService } from '@foci2020/shared/dependencies/services/infrastructure-service';

const postDeployService = postDeployServiceFactory(infrastructureService);

export default handler(postDeployService);
