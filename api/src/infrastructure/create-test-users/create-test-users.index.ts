import { default as handler } from '@/infrastructure/create-test-users/create-test-users-handler';
import { createTestUsersServiceFactory } from '@/infrastructure/create-test-users/create-test-users-service';
import { identityService } from '@/shared/dependencies';

const createTestUserService = createTestUsersServiceFactory(identityService);

export default handler(createTestUserService);
