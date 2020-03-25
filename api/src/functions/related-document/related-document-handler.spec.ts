import { default as handler } from '@/functions/related-document/related-document-handler';
import { DynamoDBStreamEvent, DynamoDBRecord } from 'aws-lambda';
import { IRelatedDocumentService } from '@/functions/related-document/related-document-service';
import { Mock, createMockService, validateFunctionCall } from '@/common/unit-testing';
import { DynamoDB } from 'aws-sdk';
import { tournamentDocument, teamDocument, betDocument, matchDocument } from '@/converters/test-data-factory';

describe('Match related handler', () => {
  let apiHandler: ReturnType<typeof handler>;
  let mockRelatedDocumentService: Mock<IRelatedDocumentService>;

  beforeEach(() => {
    mockRelatedDocumentService = createMockService('teamDeleted', 'teamUpdated', 'tournamentUpdated', 'tournamentDeleted', 'matchDeleted', 'matchFinalScoreUpdated', 'betResultCalculated');

    apiHandler = handler(mockRelatedDocumentService.service);
  });

  it('should process modified team document', async () => {
    const document = teamDocument();
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
    validateFunctionCall(mockRelatedDocumentService.functions.teamUpdated, document);
    validateFunctionCall(mockRelatedDocumentService.functions.tournamentDeleted);
    validateFunctionCall(mockRelatedDocumentService.functions.teamDeleted);
    validateFunctionCall(mockRelatedDocumentService.functions.tournamentUpdated);
    validateFunctionCall(mockRelatedDocumentService.functions.matchDeleted);
    validateFunctionCall(mockRelatedDocumentService.functions.matchFinalScoreUpdated);
    validateFunctionCall(mockRelatedDocumentService.functions.betResultCalculated);
    expect.assertions(7);
  });

  it('should process modified tournament document', async () => {
    const document = tournamentDocument();
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
    validateFunctionCall(mockRelatedDocumentService.functions.tournamentUpdated, document);
    validateFunctionCall(mockRelatedDocumentService.functions.tournamentDeleted);
    validateFunctionCall(mockRelatedDocumentService.functions.teamDeleted);
    validateFunctionCall(mockRelatedDocumentService.functions.teamUpdated);
    validateFunctionCall(mockRelatedDocumentService.functions.matchDeleted);
    validateFunctionCall(mockRelatedDocumentService.functions.matchFinalScoreUpdated);
    validateFunctionCall(mockRelatedDocumentService.functions.betResultCalculated);
    expect.assertions(7);
  });

  it('should process modified bet document', async () => {
    const document = betDocument();
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
    validateFunctionCall(mockRelatedDocumentService.functions.betResultCalculated, document.tournamentId, document.userId);
    validateFunctionCall(mockRelatedDocumentService.functions.tournamentUpdated);
    validateFunctionCall(mockRelatedDocumentService.functions.tournamentDeleted);
    validateFunctionCall(mockRelatedDocumentService.functions.teamDeleted);
    validateFunctionCall(mockRelatedDocumentService.functions.teamUpdated);
    validateFunctionCall(mockRelatedDocumentService.functions.matchDeleted);
    validateFunctionCall(mockRelatedDocumentService.functions.matchFinalScoreUpdated);
    expect.assertions(7);
  });

  it('should process deleted team document', async () => {
    const document = teamDocument();
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
    validateFunctionCall(mockRelatedDocumentService.functions.teamDeleted, document.id);
    validateFunctionCall(mockRelatedDocumentService.functions.tournamentDeleted);
    validateFunctionCall(mockRelatedDocumentService.functions.teamUpdated);
    validateFunctionCall(mockRelatedDocumentService.functions.tournamentUpdated);
    validateFunctionCall(mockRelatedDocumentService.functions.matchDeleted);
    validateFunctionCall(mockRelatedDocumentService.functions.matchFinalScoreUpdated);
    validateFunctionCall(mockRelatedDocumentService.functions.betResultCalculated);
    expect.assertions(7);
  });

  it('should process deleted tournament document', async () => {
    const document = tournamentDocument();
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
    validateFunctionCall(mockRelatedDocumentService.functions.tournamentDeleted, document.id);
    validateFunctionCall(mockRelatedDocumentService.functions.teamDeleted);
    validateFunctionCall(mockRelatedDocumentService.functions.teamUpdated);
    validateFunctionCall(mockRelatedDocumentService.functions.tournamentUpdated);
    validateFunctionCall(mockRelatedDocumentService.functions.matchDeleted);
    validateFunctionCall(mockRelatedDocumentService.functions.matchFinalScoreUpdated);
    validateFunctionCall(mockRelatedDocumentService.functions.betResultCalculated);
    expect.assertions(7);
  });

  it('should process deleted match document', async () => {
    const document = matchDocument();
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
    validateFunctionCall(mockRelatedDocumentService.functions.matchDeleted, document.id);
    validateFunctionCall(mockRelatedDocumentService.functions.teamDeleted);
    validateFunctionCall(mockRelatedDocumentService.functions.teamUpdated);
    validateFunctionCall(mockRelatedDocumentService.functions.tournamentUpdated);
    validateFunctionCall(mockRelatedDocumentService.functions.tournamentDeleted);
    validateFunctionCall(mockRelatedDocumentService.functions.matchFinalScoreUpdated);
    validateFunctionCall(mockRelatedDocumentService.functions.betResultCalculated);
    expect.assertions(7);
  });

  it('should process modified match document with finalScore', async () => {
    const document = matchDocument({
      finalScore: {
        homeScore: 1,
        awayScore: 2
      }
    });
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
    validateFunctionCall(mockRelatedDocumentService.functions.matchFinalScoreUpdated, document);
    validateFunctionCall(mockRelatedDocumentService.functions.teamDeleted);
    validateFunctionCall(mockRelatedDocumentService.functions.teamUpdated);
    validateFunctionCall(mockRelatedDocumentService.functions.tournamentUpdated);
    validateFunctionCall(mockRelatedDocumentService.functions.tournamentDeleted);
    validateFunctionCall(mockRelatedDocumentService.functions.matchDeleted);
    validateFunctionCall(mockRelatedDocumentService.functions.betResultCalculated);
    expect.assertions(7);
  });

  it('should skip processing modified match document without finalScore', async () => {
    const document = matchDocument();
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
    validateFunctionCall(mockRelatedDocumentService.functions.matchFinalScoreUpdated);
    validateFunctionCall(mockRelatedDocumentService.functions.teamDeleted);
    validateFunctionCall(mockRelatedDocumentService.functions.teamUpdated);
    validateFunctionCall(mockRelatedDocumentService.functions.tournamentUpdated);
    validateFunctionCall(mockRelatedDocumentService.functions.tournamentDeleted);
    validateFunctionCall(mockRelatedDocumentService.functions.matchDeleted);
    validateFunctionCall(mockRelatedDocumentService.functions.betResultCalculated);
    expect.assertions(7);
  });

  it('should skip processing otherwise', async () => {
    const document = matchDocument();
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
    validateFunctionCall(mockRelatedDocumentService.functions.tournamentDeleted);
    validateFunctionCall(mockRelatedDocumentService.functions.teamDeleted);
    validateFunctionCall(mockRelatedDocumentService.functions.teamUpdated);
    validateFunctionCall(mockRelatedDocumentService.functions.tournamentUpdated);
    validateFunctionCall(mockRelatedDocumentService.functions.matchDeleted);
    validateFunctionCall(mockRelatedDocumentService.functions.matchFinalScoreUpdated);
    validateFunctionCall(mockRelatedDocumentService.functions.betResultCalculated);
    expect.assertions(7);
  });
});
