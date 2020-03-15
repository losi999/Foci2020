import { Handler } from 'aws-lambda';
import { ICreateTestUsersService } from '@/functions/create-test-users/create-test-users-service';

export default (createTestUsers: ICreateTestUsersService): Handler =>
  async () => {
    await createTestUsers({
      numberOfAdmins: Number(process.env.ADMIN_COUNT),
      numberOfPlayers: Number(process.env.PLAYER_COUNT)
    });
  };
