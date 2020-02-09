import { SNS } from 'aws-sdk';
import { TeamUpdatedNotification, TournamentUpdatedNotification } from '@/shared/types/types';

export interface INotificationService {
  teamDeleted(teamId: string): Promise<any>;
  teamUpdated(notification: TeamUpdatedNotification): Promise<any>;
  tournamentDeleted(tournamentId: string): Promise<any>;
  tournamentUpdated(notification: TournamentUpdatedNotification): Promise<any>;
}

export const snsNotificationService = (
  teamDeletedTopic: string,
  teamUpdateTopic: string,
  tournamentDeletedTopic: string,
  tournamentUpdatedTopic: string,
  sns: SNS): INotificationService => {
  return {
    teamDeleted(teamId) {
      return sns.publish({
        TopicArn: teamDeletedTopic,
        Message: teamId,
      }).promise();
    },
    teamUpdated(notification) {
      return sns.publish({
        TopicArn: teamUpdateTopic,
        Message: JSON.stringify(notification)
      }).promise();
    },
    tournamentDeleted(tournamentId) {
      return sns.publish({
        TopicArn: tournamentDeletedTopic,
        Message: tournamentId
      }).promise();
    },
    tournamentUpdated(notification) {
      return sns.publish({
        TopicArn: tournamentUpdatedTopic,
        Message: JSON.stringify(notification)
      }).promise();
    }
  };
};
