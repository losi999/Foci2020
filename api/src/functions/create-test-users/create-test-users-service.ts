import { IIdentityService } from '@foci2020/shared/services/identity-service';
import { UserType } from '@foci2020/shared/types/common';

export interface ICreateTestUsersService {
  (ctx: {
    numberOfAdmins: number;
    numberOfPlayers: number;
  }): Promise<void>;
}

export const createTestUsersServiceFactory = (identityService: IIdentityService): ICreateTestUsersService => {
  const createUser = async (userGroup: UserType, index: number) => {
    const email = `losonczil+${userGroup}${index}@gmail.com`;
    try {
      await identityService.register({
        email,
        password: process.env.TEST_USER_PASSWORD,
        displayName: `${userGroup}${index}`
      }, userGroup);
    } catch (error) {
      if (error.code !== 'UsernameExistsException') {
        throw error;
      }
    }
  };
  return async ({ numberOfAdmins, numberOfPlayers }) => {
    await Promise.all([
      ...[...Array(numberOfAdmins).keys()].map(x => createUser('admin', x + 1)),
      ...[...Array(numberOfPlayers).keys()].map(x => createUser('player', x + 1))
    ]);
  };
};
