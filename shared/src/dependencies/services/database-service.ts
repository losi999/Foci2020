import { dynamoDbClient } from '@foci2020/shared/dependencies/aws/dynamo';
import { databaseServiceFactory } from '@foci2020/shared/services/database-service';

export const databaseService = databaseServiceFactory({
  primaryTableName: process.env.DYNAMO_TABLE,
  archiveTableName: process.env.ARCHIVE_TABLE,
}, dynamoDbClient);
