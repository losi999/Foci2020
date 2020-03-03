import { default as handler } from '@/functions/related-document/related-document-handler';
import { DynamoDBStreamEvent, DynamoDBRecord } from 'aws-lambda';
import { IRelatedDocumentService } from '@/functions/related-document/related-document-service';
import { Mock, createMockService } from '@/common';
import { Document, BetDocument } from '@/types/types';
import { DynamoDB } from 'aws-sdk';

describe('Match related handler', () => {
  let apiHandler: ReturnType<typeof handler>;
  let mockRelatedDocumentService: Mock<IRelatedDocumentService>;

  beforeEach(() => {
    mockRelatedDocumentService = createMockService('teamDeleted', 'teamUpdated', 'tournamentUpdated', 'tournamentDeleted', 'matchDeleted', 'matchFinalScoreUpdated', 'betResultCalculated');

    apiHandler = handler(mockRelatedDocumentService.service);
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

    mockRelatedDocumentService.functions.teamUpdated.mockResolvedValue(undefined);

    await apiHandler(event, undefined, undefined);
    expect(mockRelatedDocumentService.functions.teamUpdated).toHaveBeenCalledWith(document);
    expect(mockRelatedDocumentService.functions.tournamentDeleted).not.toHaveBeenCalled();
    expect(mockRelatedDocumentService.functions.teamDeleted).not.toHaveBeenCalled();
    expect(mockRelatedDocumentService.functions.tournamentUpdated).not.toHaveBeenCalled();
    expect(mockRelatedDocumentService.functions.matchDeleted).not.toHaveBeenCalled();
    expect(mockRelatedDocumentService.functions.matchFinalScoreUpdated).not.toHaveBeenCalled();
    expect(mockRelatedDocumentService.functions.betResultCalculated).not.toHaveBeenCalled();
    expect.assertions(7);
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

    mockRelatedDocumentService.functions.tournamentUpdated.mockResolvedValue(undefined);

    await apiHandler(event, undefined, undefined);
    expect(mockRelatedDocumentService.functions.tournamentUpdated).toHaveBeenCalledWith(document);
    expect(mockRelatedDocumentService.functions.tournamentDeleted).not.toHaveBeenCalled();
    expect(mockRelatedDocumentService.functions.teamDeleted).not.toHaveBeenCalled();
    expect(mockRelatedDocumentService.functions.teamUpdated).not.toHaveBeenCalled();
    expect(mockRelatedDocumentService.functions.matchDeleted).not.toHaveBeenCalled();
    expect(mockRelatedDocumentService.functions.matchFinalScoreUpdated).not.toHaveBeenCalled();
    expect(mockRelatedDocumentService.functions.betResultCalculated).not.toHaveBeenCalled();
    expect.assertions(7);
  });

  it('should process modified bet document', async () => {
    const document = {
      documentType: 'bet',
      'tournamentId-userId': 'tournamentIdUserId'
    } as BetDocument;
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

    mockRelatedDocumentService.functions.tournamentUpdated.mockResolvedValue(undefined);

    await apiHandler(event, undefined, undefined);
    expect(mockRelatedDocumentService.functions.betResultCalculated).toHaveBeenCalledWith(document['tournamentId-userId']);
    expect(mockRelatedDocumentService.functions.tournamentUpdated).not.toHaveBeenCalled();
    expect(mockRelatedDocumentService.functions.tournamentDeleted).not.toHaveBeenCalled();
    expect(mockRelatedDocumentService.functions.teamDeleted).not.toHaveBeenCalled();
    expect(mockRelatedDocumentService.functions.teamUpdated).not.toHaveBeenCalled();
    expect(mockRelatedDocumentService.functions.matchDeleted).not.toHaveBeenCalled();
    expect(mockRelatedDocumentService.functions.matchFinalScoreUpdated).not.toHaveBeenCalled();
    expect.assertions(7);
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

    mockRelatedDocumentService.functions.teamDeleted.mockResolvedValue(undefined);

    await apiHandler(event, undefined, undefined);
    expect(mockRelatedDocumentService.functions.teamDeleted).toHaveBeenCalledWith(document.id);
    expect(mockRelatedDocumentService.functions.tournamentDeleted).not.toHaveBeenCalled();
    expect(mockRelatedDocumentService.functions.teamUpdated).not.toHaveBeenCalled();
    expect(mockRelatedDocumentService.functions.tournamentUpdated).not.toHaveBeenCalled();
    expect(mockRelatedDocumentService.functions.matchDeleted).not.toHaveBeenCalled();
    expect(mockRelatedDocumentService.functions.matchFinalScoreUpdated).not.toHaveBeenCalled();
    expect(mockRelatedDocumentService.functions.betResultCalculated).not.toHaveBeenCalled();
    expect.assertions(7);
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

    mockRelatedDocumentService.functions.tournamentDeleted.mockResolvedValue(undefined);

    await apiHandler(event, undefined, undefined);
    expect(mockRelatedDocumentService.functions.tournamentDeleted).toHaveBeenCalledWith(document.id);
    expect(mockRelatedDocumentService.functions.teamDeleted).not.toHaveBeenCalled();
    expect(mockRelatedDocumentService.functions.teamUpdated).not.toHaveBeenCalled();
    expect(mockRelatedDocumentService.functions.tournamentUpdated).not.toHaveBeenCalled();
    expect(mockRelatedDocumentService.functions.matchDeleted).not.toHaveBeenCalled();
    expect(mockRelatedDocumentService.functions.matchFinalScoreUpdated).not.toHaveBeenCalled();
    expect(mockRelatedDocumentService.functions.betResultCalculated).not.toHaveBeenCalled();
    expect.assertions(7);
  });

  it('should process deleted match document', async () => {
    const document = {
      documentType: 'match',
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

    mockRelatedDocumentService.functions.matchDeleted.mockResolvedValue(undefined);

    await apiHandler(event, undefined, undefined);
    expect(mockRelatedDocumentService.functions.matchDeleted).toHaveBeenCalledWith(document.id);
    expect(mockRelatedDocumentService.functions.teamDeleted).not.toHaveBeenCalled();
    expect(mockRelatedDocumentService.functions.teamUpdated).not.toHaveBeenCalled();
    expect(mockRelatedDocumentService.functions.tournamentUpdated).not.toHaveBeenCalled();
    expect(mockRelatedDocumentService.functions.tournamentDeleted).not.toHaveBeenCalled();
    expect(mockRelatedDocumentService.functions.matchFinalScoreUpdated).not.toHaveBeenCalled();
    expect(mockRelatedDocumentService.functions.betResultCalculated).not.toHaveBeenCalled();
    expect.assertions(7);
  });

  it('should process modified match document with finalScore', async () => {
    const document = {
      documentType: 'match',
      id: 'id1',
      finalScore: {
        homeScore: 1,
        awayScore: 2
      }
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

    mockRelatedDocumentService.functions.matchFinalScoreUpdated.mockResolvedValue(undefined);

    await apiHandler(event, undefined, undefined);
    expect(mockRelatedDocumentService.functions.matchFinalScoreUpdated).toHaveBeenCalledWith(document);
    expect(mockRelatedDocumentService.functions.teamDeleted).not.toHaveBeenCalled();
    expect(mockRelatedDocumentService.functions.teamUpdated).not.toHaveBeenCalled();
    expect(mockRelatedDocumentService.functions.tournamentUpdated).not.toHaveBeenCalled();
    expect(mockRelatedDocumentService.functions.tournamentDeleted).not.toHaveBeenCalled();
    expect(mockRelatedDocumentService.functions.matchDeleted).not.toHaveBeenCalled();
    expect(mockRelatedDocumentService.functions.betResultCalculated).not.toHaveBeenCalled();
    expect.assertions(7);
  });

  it('should skip processing modified match document without finalScore', async () => {
    const document = {
      documentType: 'match',
      id: 'id1'
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

    await apiHandler(event, undefined, undefined);
    expect(mockRelatedDocumentService.functions.matchFinalScoreUpdated).not.toHaveBeenCalled();
    expect(mockRelatedDocumentService.functions.teamDeleted).not.toHaveBeenCalled();
    expect(mockRelatedDocumentService.functions.teamUpdated).not.toHaveBeenCalled();
    expect(mockRelatedDocumentService.functions.tournamentUpdated).not.toHaveBeenCalled();
    expect(mockRelatedDocumentService.functions.tournamentDeleted).not.toHaveBeenCalled();
    expect(mockRelatedDocumentService.functions.matchDeleted).not.toHaveBeenCalled();
    expect(mockRelatedDocumentService.functions.betResultCalculated).not.toHaveBeenCalled();
    expect.assertions(7);
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

    mockRelatedDocumentService.functions.teamUpdated.mockResolvedValue(undefined);

    await apiHandler(event, undefined, undefined);
    expect(mockRelatedDocumentService.functions.tournamentDeleted).not.toHaveBeenCalled();
    expect(mockRelatedDocumentService.functions.teamDeleted).not.toHaveBeenCalled();
    expect(mockRelatedDocumentService.functions.teamUpdated).not.toHaveBeenCalled();
    expect(mockRelatedDocumentService.functions.tournamentUpdated).not.toHaveBeenCalled();
    expect(mockRelatedDocumentService.functions.matchDeleted).not.toHaveBeenCalled();
    expect(mockRelatedDocumentService.functions.matchFinalScoreUpdated).not.toHaveBeenCalled();
    expect(mockRelatedDocumentService.functions.betResultCalculated).not.toHaveBeenCalled();
    expect.assertions(7);
  });
});
