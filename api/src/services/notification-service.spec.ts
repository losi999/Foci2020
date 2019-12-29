import { INotificationService, snsNotificationService } from '@/services/notification-service';
import { SNS } from 'aws-sdk';
import { UpdateTeamNotification, UpdateTournamentNotification } from '@/types/types';
import { TeamDocument, TournamentDocument } from '@/types/documents';

describe('Notification service', () => {
  let service: INotificationService;
  let snsPublishSpy: jest.SpyInstance;
  const deleteTeamTopic = 'deleteTeamTopic';
  const updateTeamTopic = 'updateTeamTopic';
  const deleteTournamentTopic = 'deleteTournamentTopic';
  const updateTournamentTopic = 'updateTournamentTopic';

  beforeEach(() => {
    const sns = new SNS();
    snsPublishSpy = jest.spyOn(sns, 'publish');

    process.env.DELETE_TEAM_TOPIC = deleteTeamTopic;
    process.env.UPDATE_TEAM_TOPIC = updateTeamTopic;
    process.env.DELETE_TOURNAMENT_TOPIC = deleteTournamentTopic;
    process.env.UPDATE_TOURNAMENT_TOPIC = updateTournamentTopic;

    service = snsNotificationService(sns);
  });

  afterEach(() => {
    process.env.DELETE_TEAM_TOPIC = undefined;
    process.env.UPDATE_TEAM_TOPIC = undefined;
    process.env.DELETE_TOURNAMENT_TOPIC = undefined;
    process.env.UPDATE_TOURNAMENT_TOPIC = undefined;
  });

  describe('teamDeleted', () => {
    it('should call sns.publish with correct parameters', async () => {
      const teamId = 'teamId';
      snsPublishSpy.mockReturnValue({
        promise() {
          return Promise.resolve(undefined);
        }
      });
      await service.teamDeleted(teamId);
      expect(snsPublishSpy).toHaveBeenCalledWith({
        TopicArn: deleteTeamTopic,
        Message: teamId,
      });
    });
  });

  describe('tournamentDeleted', () => {
    it('should call sns.publish with correct parameters', async () => {
      const tournamentId = 'tournamentId';
      snsPublishSpy.mockReturnValue({
        promise() {
          return Promise.resolve(undefined);
        }
      });
      await service.tournamentDeleted(tournamentId);
      expect(snsPublishSpy).toHaveBeenCalledWith({
        TopicArn: deleteTournamentTopic,
        Message: tournamentId,
      });
    });
  });

  describe('teamUpdated', () => {
    it('should call sns.publish with correct parameters', async () => {
      const message: UpdateTeamNotification = {
        teamId: 'teamId',
        team: {
          teamName: 'teamName',
          shortName: 'shortName',
          image: 'image'
        } as TeamDocument
      };
      snsPublishSpy.mockReturnValue({
        promise() {
          return Promise.resolve(undefined);
        }
      });
      await service.teamUpdated(message);
      expect(snsPublishSpy).toHaveBeenCalledWith({
        TopicArn: updateTeamTopic,
        Message: JSON.stringify(message),
      });
    });
  });

  describe('tournamentUpdated', () => {
    it('should call sns.publish with correct parameters', async () => {
      const message: UpdateTournamentNotification = {
        tournamentId: 'tournamentId',
        tournament: {
          tournamentName: 'tournamentName',
        } as TournamentDocument
      };
      snsPublishSpy.mockReturnValue({
        promise() {
          return Promise.resolve(undefined);
        }
      });
      await service.tournamentUpdated(message);
      expect(snsPublishSpy).toHaveBeenCalledWith({
        TopicArn: updateTournamentTopic,
        Message: JSON.stringify(message),
      });
    });
  });
});
