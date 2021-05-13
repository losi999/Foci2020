
import { ICreateTestUsersService } from '@foci2020/api/functions/create-test-users/create-test-users-service';

export default (createTestUsers: ICreateTestUsersService): AWSLambda.Handler =>
  async () => {
    await createTestUsers({
      numberOfAdmins: Number(process.env.ADMIN_COUNT),
      numberOfPlayers: Number(process.env.PLAYER_COUNT),
    });
  };
