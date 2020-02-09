import { INotificationService, snsNotificationService } from '@/services/notification-service';
import { SNS } from 'aws-sdk';
import { TeamUpdatedNotification, TournamentUpdatedNotification, TeamDocument, TournamentDocument } from '@/types/types';
import { Mock, createMockService, awsResolvedValue } from '@/common';

describe('Notification service', () => {
  let service: INotificationService;
  let mockSns: Mock<SNS>;
  const teamDeletedTopic = 'teamDeletedTopic';
  const teamUpdatedTopic = 'teamUpdatedTopic';
  const tournamentDeletedTopic = 'tournamentDeletedTopic';
  const tournamentUpdatedTopic = 'tournamentUpdatedTopic';

  beforeEach(() => {
    mockSns = createMockService('publish');

    service = snsNotificationService(teamDeletedTopic, teamUpdatedTopic, tournamentDeletedTopic, tournamentUpdatedTopic, mockSns.service);
  });

  describe('teamDeleted', () => {
    it('should call sns.publish with correct parameters', async () => {
      const teamId = 'teamId';
      mockSns.functions.publish.mockReturnValue(awsResolvedValue());

      await service.teamDeleted(teamId);
      expect(mockSns.functions.publish).toHaveBeenCalledWith({
        TopicArn: teamDeletedTopic,
        Message: teamId,
      });
    });
  });

  describe('tournamentDeleted', () => {
    it('should call sns.publish with correct parameters', async () => {
      const tournamentId = 'tournamentId';
      mockSns.functions.publish.mockReturnValue(awsResolvedValue());

      await service.tournamentDeleted(tournamentId);
      expect(mockSns.functions.publish).toHaveBeenCalledWith({
        TopicArn: tournamentDeletedTopic,
        Message: tournamentId,
      });
    });
  });

  describe('teamUpdated', () => {
    it('should call sns.publish with correct parameters', async () => {
      const message: TeamUpdatedNotification = {
        teamId: 'teamId',
        team: {
          teamName: 'teamName',
          shortName: 'shortName',
          image: 'image'
        } as TeamDocument
      };
      mockSns.functions.publish.mockReturnValue(awsResolvedValue());

      await service.teamUpdated(message);
      expect(mockSns.functions.publish).toHaveBeenCalledWith({
        TopicArn: teamUpdatedTopic,
        Message: JSON.stringify(message),
      });
    });
  });

  describe('tournamentUpdated', () => {
    it('should call sns.publish with correct parameters', async () => {
      const message: TournamentUpdatedNotification = {
        tournamentId: 'tournamentId',
        tournament: {
          tournamentName: 'tournamentName',
        } as TournamentDocument
      };
      mockSns.functions.publish.mockReturnValue(awsResolvedValue());

      await service.tournamentUpdated(message);
      expect(mockSns.functions.publish).toHaveBeenCalledWith({
        TopicArn: tournamentUpdatedTopic,
        Message: JSON.stringify(message),
      });
    });
  });
});
