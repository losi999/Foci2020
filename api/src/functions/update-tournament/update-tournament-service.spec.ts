import { IUpdateTournamentService, updateTournamentServiceFactory } from '@/functions/update-tournament/update-tournament-service';
import { ITournamentDocumentService } from '@/services/tournament-document-service';
import { Mock, createMockService, validateError } from '@/common';
import { ITournamentDocumentConverter } from '@/converters/tournament-document-converter';
import { TournamentRequest, TournamentDocument } from '@/types/types';

describe('Update tournament service', () => {
  let service: IUpdateTournamentService;
  let mockTournamentDocumentService: Mock<ITournamentDocumentService>;
  let mockTournamentDocumentConverter: Mock<ITournamentDocumentConverter>;

  beforeEach(() => {
    mockTournamentDocumentConverter = createMockService('update');
    mockTournamentDocumentService = createMockService('updateTournament');

    service = updateTournamentServiceFactory(mockTournamentDocumentService.service, mockTournamentDocumentConverter.service);
  });

  it('should return with with undefined if tournament is updated successfully', async () => {
    const tournamentId = 'tournamentId';
    const tournamentName = 'tournamentName';
    const body: TournamentRequest = {
      tournamentName
    };

    const converted = {
      tournamentName
    } as TournamentDocument;

    mockTournamentDocumentConverter.functions.update.mockReturnValue(converted);
    mockTournamentDocumentService.functions.updateTournament.mockResolvedValue(undefined);

    const result = await service({
      tournamentId,
      body
    });
    expect(result).toBeUndefined();
    expect(mockTournamentDocumentConverter.functions.update).toHaveBeenCalledWith(tournamentId, body);
    expect(mockTournamentDocumentService.functions.updateTournament).toHaveBeenCalledWith(converted);
    expect.assertions(3);
  });

  it('should throw error if unable to update tournament', async () => {
    const tournamentId = 'tournamentId';
    const tournamentName = 'tournamentName';
    const body: TournamentRequest = {
      tournamentName
    };

    const converted = {
      tournamentName
    } as TournamentDocument;

    mockTournamentDocumentConverter.functions.update.mockReturnValue(converted);
    mockTournamentDocumentService.functions.updateTournament.mockRejectedValue('This is a dynamo error');

    await service({
      tournamentId,
      body
    }).catch(validateError('Error while updating tournament', 500));

    expect(mockTournamentDocumentConverter.functions.update).toHaveBeenCalledWith(tournamentId, body);
    expect(mockTournamentDocumentService.functions.updateTournament).toHaveBeenCalledWith(converted);
    expect.assertions(4);
  });
});
