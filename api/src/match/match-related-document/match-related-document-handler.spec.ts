import { default as handler } from '@/match/match-related-document/match-related-document-handler';
import { DynamoDBStreamEvent, DynamoDBRecord } from 'aws-lambda';
import { IMatchRelatedDocumentService } from '@/match/match-related-document/match-related-document-service';
import { Mock, createMockService } from '@/shared/common';
import { Document } from '@/shared/types/types';
import { DynamoDB } from 'aws-sdk';

describe('Match related handler', () => {
  let apiHandler: ReturnType<typeof handler>;
  let mockMatchRelatedDocumentService: Mock<IMatchRelatedDocumentService>;

  beforeEach(() => {
    mockMatchRelatedDocumentService = createMockService('deleteMatchByTeam', 'deleteMatchByTournament', 'updateTeamOfMatch', 'updateTournamentOfMatch');

    apiHandler = handler(mockMatchRelatedDocumentService.service);
  });

  it('should process modified team document', async () => {
    const document = {
      documentType: 'team'
    } as Document;
    const event: DynamoDBStreamEvent = {
      Records: [
        {
          eventName: 'MODIFY',
          dynamodb: {
            NewImage: DynamoDB.Converter.marshall(document)
          }
        } as DynamoDBRecord
      ]
    };

    mockMatchRelatedDocumentService.functions.updateTeamOfMatch.mockResolvedValue(undefined);

    await apiHandler(event, undefined, undefined);
    expect(mockMatchRelatedDocumentService.functions.updateTeamOfMatch).toHaveBeenCalledWith(document);
    expect(mockMatchRelatedDocumentService.functions.deleteMatchByTournament).not.toHaveBeenCalled();
    expect(mockMatchRelatedDocumentService.functions.deleteMatchByTeam).not.toHaveBeenCalled();
    expect(mockMatchRelatedDocumentService.functions.updateTournamentOfMatch).not.toHaveBeenCalled();
    expect.assertions(4);
  });

  it('should process modified tournament document', async () => {
    const document = {
      documentType: 'tournament'
    } as Document;
    const event: DynamoDBStreamEvent = {
      Records: [
        {
          eventName: 'MODIFY',
          dynamodb: {
            NewImage: DynamoDB.Converter.marshall(document)
          }
        } as DynamoDBRecord
      ]
    };

    mockMatchRelatedDocumentService.functions.updateTournamentOfMatch.mockResolvedValue(undefined);

    await apiHandler(event, undefined, undefined);
    expect(mockMatchRelatedDocumentService.functions.updateTournamentOfMatch).toHaveBeenCalledWith(document);
    expect(mockMatchRelatedDocumentService.functions.deleteMatchByTournament).not.toHaveBeenCalled();
    expect(mockMatchRelatedDocumentService.functions.deleteMatchByTeam).not.toHaveBeenCalled();
    expect(mockMatchRelatedDocumentService.functions.updateTeamOfMatch).not.toHaveBeenCalled();
    expect.assertions(4);
  });

  it('should process deleted team document', async () => {
    const document = {
      documentType: 'team',
      id: 'id1'
    } as Document;
    const event: DynamoDBStreamEvent = {
      Records: [
        {
          eventName: 'REMOVE',
          dynamodb: {
            OldImage: DynamoDB.Converter.marshall(document)
          }
        } as DynamoDBRecord
      ]
    };

    mockMatchRelatedDocumentService.functions.deleteMatchByTeam.mockResolvedValue(undefined);

    await apiHandler(event, undefined, undefined);
    expect(mockMatchRelatedDocumentService.functions.deleteMatchByTeam).toHaveBeenCalledWith(document.id);
    expect(mockMatchRelatedDocumentService.functions.deleteMatchByTournament).not.toHaveBeenCalled();
    expect(mockMatchRelatedDocumentService.functions.updateTeamOfMatch).not.toHaveBeenCalled();
    expect(mockMatchRelatedDocumentService.functions.updateTournamentOfMatch).not.toHaveBeenCalled();
    expect.assertions(4);
  });

  it('should process deleted tournament document', async () => {
    const document = {
      documentType: 'tournament',
      id: 'id1'
    } as Document;
    const event: DynamoDBStreamEvent = {
      Records: [
        {
          eventName: 'REMOVE',
          dynamodb: {
            OldImage: DynamoDB.Converter.marshall(document)
          }
        } as DynamoDBRecord
      ]
    };

    mockMatchRelatedDocumentService.functions.deleteMatchByTournament.mockResolvedValue(undefined);

    await apiHandler(event, undefined, undefined);
    expect(mockMatchRelatedDocumentService.functions.deleteMatchByTournament).toHaveBeenCalledWith(document.id);
    expect(mockMatchRelatedDocumentService.functions.deleteMatchByTeam).not.toHaveBeenCalled();
    expect(mockMatchRelatedDocumentService.functions.updateTeamOfMatch).not.toHaveBeenCalled();
    expect(mockMatchRelatedDocumentService.functions.updateTournamentOfMatch).not.toHaveBeenCalled();
    expect.assertions(4);
  });

  it('should skip processing otherwise', async () => {
    const document = {
      documentType: 'match',
      id: 'id1'
    } as Document;
    const event: DynamoDBStreamEvent = {
      Records: [
        {
          eventName: 'INSERT',
          dynamodb: {
            OldImage: DynamoDB.Converter.marshall(document)
          }
        } as DynamoDBRecord
      ]
    };

    mockMatchRelatedDocumentService.functions.updateTeamOfMatch.mockResolvedValue(undefined);

    await apiHandler(event, undefined, undefined);
    expect(mockMatchRelatedDocumentService.functions.deleteMatchByTournament).not.toHaveBeenCalled();
    expect(mockMatchRelatedDocumentService.functions.deleteMatchByTeam).not.toHaveBeenCalled();
    expect(mockMatchRelatedDocumentService.functions.updateTeamOfMatch).not.toHaveBeenCalled();
    expect(mockMatchRelatedDocumentService.functions.updateTournamentOfMatch).not.toHaveBeenCalled();
    expect.assertions(4);
  });
});
