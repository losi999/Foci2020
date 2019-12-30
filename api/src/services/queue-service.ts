import { SQS } from 'aws-sdk';
import { UpdateMatchWithTeamMessage } from '@/types/types';

export interface IQueueService {
  updateMatchWithTeam(message: UpdateMatchWithTeamMessage): Promise<any>;
}

export const sqsQueueService = (sqs: SQS): IQueueService => {
  return {
    updateMatchWithTeam(message) {
      return sqs.sendMessage({
        QueueUrl: process.env.UPDATE_MATCH_WITH_TEAM_QUEUE,
        MessageBody: JSON.stringify(message)
      }).promise();
    }
  };
};
