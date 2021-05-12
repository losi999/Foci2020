import { cognito } from '@foci2020/shared/dependencies/aws/cognito';
import { identityServiceFactory } from '@foci2020/shared/services/identity-service';

export const identityService = identityServiceFactory(process.env.USER_POOL_ID, process.env.CLIENT_ID, cognito);
