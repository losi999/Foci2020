import { DynamoDBStreamEvent, Handler } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';
import { TeamDocument } from '@/types/documents';
import { IDeleteMatchWithTeamService } from '@/business-services/delete-match-with-team-service';

export default (deleteMatchWithTeam: IDeleteMatchWithTeamService): Handler<DynamoDBStreamEvent> => {
  return async (event) => {
    await Promise.all(
      event.Records.map(async (record) => {
        if (record.eventName === 'REMOVE') {
          const team = DynamoDB.Converter.unmarshall(record.dynamodb.OldImage) as TeamDocument;
          if (team.documentType === 'team') {
            try {
              await deleteMatchWithTeam({ team });
            } catch (error) {
              console.log('ERROR deleteMatchWithTeam', error);
            }
          }
        }
      })
    );
  };
};
