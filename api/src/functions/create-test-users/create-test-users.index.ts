import { default as handler } from '@/functions/create-test-users/create-test-users-handler';
import { createTestUsersServiceFactory } from '@/functions/create-test-users/create-test-users-service';
import { identityService } from '@/dependencies';

const createTestUserService = createTestUsersServiceFactory(identityService);

export default handler(createTestUserService);
