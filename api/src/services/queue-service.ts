import { SQS } from 'aws-sdk';
import { UpdateTeamOfMatchMessage, UpdateTournamentOfMatchMessage } from '@/types/types';

export interface IQueueService {
  updateTeamOfMatch(message: UpdateTeamOfMatchMessage): Promise<any>;
  updateTournamentOfMatch(message: UpdateTournamentOfMatchMessage): Promise<any>;
}

export const sqsQueueService = (sqs: SQS): IQueueService => {
  return {
    updateTeamOfMatch(message) {
      return sqs.sendMessage({
        QueueUrl: process.env.UPDATE_TEAM_OF_MATCH_QUEUE,
        MessageBody: JSON.stringify(message)
      }).promise();
    },
    updateTournamentOfMatch(message) {
      return sqs.sendMessage({
        QueueUrl: process.env.UPDATE_TOURNAMENT_OF_MATCH_QUEUE,
        MessageBody: JSON.stringify(message)
      }).promise();
    }
  };
};
