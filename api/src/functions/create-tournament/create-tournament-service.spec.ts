import { createTournamentServiceFactory, ICreateTournamentService } from '@/functions/create-tournament/create-tournament-service';
import { ITournamentDocumentService } from '@/services/tournament-document-service';
import { ITournamentDocumentConverter } from '@/converters/tournament-document-converter';
import { Mock, createMockService, validateError } from '@/common/unit-testing';
import { TournamentDocument, TournamentRequest } from '@/types/types';

describe('Create tournament service', () => {
  let mockTournamentDocumentService: Mock<ITournamentDocumentService>;
  let mockTournamentDocumentConverter: Mock<ITournamentDocumentConverter>;
  let service: ICreateTournamentService;

  beforeEach(() => {
    mockTournamentDocumentService = createMockService('saveTournament');
    mockTournamentDocumentConverter = createMockService('create');

    service = createTournamentServiceFactory(mockTournamentDocumentService.service, mockTournamentDocumentConverter.service);
  });

  type TestDataInput = {
    tournamentId: string;
    convertedTournament: TournamentDocument,
  };

  type TestData = TestDataInput & {
    body: TournamentRequest,
  };

  const setup = (input?: Partial<TestDataInput> & { minutesFromNow?: number }): TestData => {
    const tournamentId = input?.tournamentId ?? 'tournamentId';

    const convertedTournament = input?.convertedTournament ?? {
      id: tournamentId
    } as TournamentDocument;

    return {
      convertedTournament,
      tournamentId,
      body: {
        tournamentName: 'tournamentName'
      } as TournamentRequest
    };
  };

  it('should throw error if unable to save tournament', async () => {
    const { body, convertedTournament } = setup();

    mockTournamentDocumentConverter.functions.create.mockReturnValue(convertedTournament);
    mockTournamentDocumentService.functions.saveTournament.mockRejectedValue({});

    await service({ body }).catch(validateError('Error while saving tournament', 500));
    expect(mockTournamentDocumentConverter.functions.create).toHaveBeenCalledWith(body);
    expect(mockTournamentDocumentService.functions.saveTournament).toHaveBeenCalledWith(convertedTournament);
    expect.assertions(4);
  });

  it('should return with tournamentId if tournament is saved', async () => {
    const { body, convertedTournament, tournamentId } = setup();

    mockTournamentDocumentConverter.functions.create.mockReturnValue(convertedTournament);
    mockTournamentDocumentService.functions.saveTournament.mockResolvedValue(undefined);

    const result = await service({ body });

    expect(result).toEqual(tournamentId);
    expect(mockTournamentDocumentConverter.functions.create).toHaveBeenCalledWith(body);
    expect(mockTournamentDocumentService.functions.saveTournament).toHaveBeenCalledWith(convertedTournament);
  });
});
