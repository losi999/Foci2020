import { default as handler } from '@foci2020/api/functions/create-test-users/create-test-users-handler';
import { createTestUsersServiceFactory } from '@foci2020/api/functions/create-test-users/create-test-users-service';
import { identityService } from '@foci2020/api/dependencies';

const createTestUserService = createTestUsersServiceFactory(identityService);

export default handler(createTestUserService);
