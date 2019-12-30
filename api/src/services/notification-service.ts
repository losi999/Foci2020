import { SNS } from 'aws-sdk';
import { TeamUpdatedNotification, TournamentUpdatedNotification } from '@/types/types';

export interface INotificationService {
  teamDeleted(teamId: string): Promise<any>;
  teamUpdated(notification: TeamUpdatedNotification): Promise<any>;
  tournamentDeleted(tournamentId: string): Promise<any>;
  tournamentUpdated(notification: TournamentUpdatedNotification): Promise<any>;
}

export const snsNotificationService = (sns: SNS): INotificationService => {
  return {
    teamDeleted(teamId) {
      return sns.publish({
        TopicArn: process.env.DELETE_TEAM_TOPIC,
        Message: teamId,
      }).promise();
    },
    teamUpdated(notification) {
      return sns.publish({
        TopicArn: process.env.TEAM_UPDATED_TOPIC,
        Message: JSON.stringify(notification)
      }).promise();
    },
    tournamentDeleted(tournamentId) {
      return sns.publish({
        TopicArn: process.env.DELETE_TOURNAMENT_TOPIC,
        Message: tournamentId
      }).promise();
    },
    tournamentUpdated(notification) {
      return sns.publish({
        TopicArn: process.env.TOURNAMENT_UPDATED_TOPIC,
        Message: JSON.stringify(notification)
      }).promise();
    }
  };
};
