import { DynamoDBStreamEvent, Handler } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';
import { TeamDocument } from '@/types/documents';
import { IUpdateMatchWithTeamService } from '@/business-services/update-match-with-team-service';

export default (updateMatchWithTeam: IUpdateMatchWithTeamService): Handler<DynamoDBStreamEvent> => {
  return async (event) => {
    await Promise.all(
      event.Records.map(async (record) => {
        if (record.eventName === 'MODIFY') {
          const team = DynamoDB.Converter.unmarshall(record.dynamodb.NewImage) as TeamDocument;
          if (team.documentType === 'team') {
            try {
              await updateMatchWithTeam({ team });
            } catch (error) {
              console.log('ERROR updateMatchWithTeam', error);
            }
          }
        }
      })
    );
  };
};
