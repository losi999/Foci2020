// import { default as handler } from '@foci2020/api/functions/primary-table-trigger/primary-table-trigger-handler';
// import { DynamoDBStreamEvent, DynamoDBRecord } from 'aws-lambda';
// import { MockBusinessService, validateFunctionCall } from '@foci2020/shared/common/unit-testing';
// import { DynamoDB } from 'aws-sdk';
// import { betDocument, matchDocument, teamDocument, tournamentDocument } from '@foci2020/shared/common/test-data-factory';
// import { advanceTo, clear } from 'jest-date-mock';
// import { ITeamUpdatedService } from '@foci2020/api/functions/team-updated/team-updated-service';
// import { ITeamDeletedService } from '@foci2020/api/functions/team-deleted/team-deleted-service';
// import { ITournamentDeletedService } from '@foci2020/api/functions/tournament-deleted/tournament-deleted-service';
// import { ITournamentUpdatedService } from '@foci2020/api/functions/tournament-updated/tournament-updated-service';
// import { IMatchDeletedService } from '@foci2020/api/functions/match-deleted/match-deleted-service';
// import { IMatchFinalScoreUpdatedService } from '@foci2020/api/functions/match-final-score-updated/match-final-score-updated-service';
// import { IBetResultCalculatedService } from '@foci2020/api/functions/bet-result-calculated/bet-result-calculated-service';
// import { addSeconds } from '@foci2020/shared/common/utils';
// import { IArchiveDocumentService } from '@foci2020/api/functions/archive-document/archive-document-service';

// describe('Primary table trigger handler', () => {
//   let apiHandler: ReturnType<typeof handler>;
//   let teamUpdated: MockBusinessService<ITeamUpdatedService>;
//   let teamDeleted: MockBusinessService<ITeamDeletedService>;
//   let tournamentUpdated: MockBusinessService<ITournamentUpdatedService>;
//   let tournamentDeleted: MockBusinessService<ITournamentDeletedService>;
//   let matchDeleted: MockBusinessService<IMatchDeletedService>;
//   let matchFinalScoreUpdated: MockBusinessService<IMatchFinalScoreUpdatedService>;
//   let betResultCalculated: MockBusinessService<IBetResultCalculatedService>;
//   let archiveDocument: MockBusinessService<IArchiveDocumentService>;

//   const now = new Date(2019, 3, 21, 19, 0, 0);

//   beforeEach(() => {
//     teamUpdated = jest.fn();
//     teamDeleted = jest.fn();
//     tournamentUpdated = jest.fn();
//     tournamentDeleted = jest.fn();
//     matchDeleted = jest.fn();
//     matchFinalScoreUpdated = jest.fn();
//     betResultCalculated = jest.fn();
//     archiveDocument: jest.fn();

//     apiHandler = handler(
//       matchDeleted,
//       betResultCalculated,
//       teamUpdated,
//       tournamentUpdated,
//       matchFinalScoreUpdated,
//       teamDeleted,
//       tournamentDeleted,
//       archiveDocument,
//     );
//     advanceTo(now);
//   });

//   afterEach(() => {
//     clear();
//   });

//   it('should process modified team document', async () => {
//     const document = teamDocument();
//     const event: DynamoDBStreamEvent = {
//       Records: [
//         {
//           eventName: 'MODIFY',
//           dynamodb: {
//             NewImage: DynamoDB.Converter.marshall(document)
//           }
//         } as DynamoDBRecord
//       ]
//     };

//     teamUpdated.mockResolvedValue(undefined);

//     await apiHandler(event, undefined, undefined);
//     validateFunctionCall(teamUpdated, { team: document });
//     validateFunctionCall(tournamentDeleted);
//     validateFunctionCall(teamDeleted);
//     validateFunctionCall(tournamentUpdated);
//     validateFunctionCall(matchDeleted);
//     validateFunctionCall(matchFinalScoreUpdated);
//     validateFunctionCall(betResultCalculated);
//     expect.assertions(7);
//   });

//   it('should process modified tournament document', async () => {
//     const document = tournamentDocument();
//     const event: DynamoDBStreamEvent = {
//       Records: [
//         {
//           eventName: 'MODIFY',
//           dynamodb: {
//             NewImage: DynamoDB.Converter.marshall(document)
//           }
//         } as DynamoDBRecord
//       ]
//     };

//     tournamentUpdated.mockResolvedValue(undefined);

//     await apiHandler(event, undefined, undefined);
//     validateFunctionCall(tournamentUpdated, { tournament: document });
//     validateFunctionCall(tournamentDeleted);
//     validateFunctionCall(teamDeleted);
//     validateFunctionCall(teamUpdated);
//     validateFunctionCall(matchDeleted);
//     validateFunctionCall(matchFinalScoreUpdated);
//     validateFunctionCall(betResultCalculated);
//     expect.assertions(7);
//   });

//   it('should process modified bet document', async () => {
//     const expiresIn = 30;
//     const document = betDocument({ expiresAt: addSeconds(expiresIn, now).getTime() / 1000 });
//     const event: DynamoDBStreamEvent = {
//       Records: [
//         {
//           eventName: 'MODIFY',
//           dynamodb: {
//             NewImage: DynamoDB.Converter.marshall(document)
//           }
//         } as DynamoDBRecord
//       ]
//     };

//     tournamentUpdated.mockResolvedValue(undefined);

//     await apiHandler(event, undefined, undefined);
//     validateFunctionCall(betResultCalculated, {
//       expiresIn,
//       tournamentId: document.tournamentId,
//       userId: document.userId,
//     });
//     validateFunctionCall(tournamentUpdated);
//     validateFunctionCall(tournamentDeleted);
//     validateFunctionCall(teamDeleted);
//     validateFunctionCall(teamUpdated);
//     validateFunctionCall(matchDeleted);
//     validateFunctionCall(matchFinalScoreUpdated);
//     expect.assertions(7);
//   });

//   it('should process deleted team document', async () => {
//     const document = teamDocument();
//     const event: DynamoDBStreamEvent = {
//       Records: [
//         {
//           eventName: 'REMOVE',
//           dynamodb: {
//             OldImage: DynamoDB.Converter.marshall(document)
//           }
//         } as DynamoDBRecord
//       ]
//     };

//     teamDeleted.mockResolvedValue(undefined);

//     await apiHandler(event, undefined, undefined);
//     validateFunctionCall(teamDeleted, { teamId: document.id });
//     validateFunctionCall(tournamentDeleted);
//     validateFunctionCall(teamUpdated);
//     validateFunctionCall(tournamentUpdated);
//     validateFunctionCall(matchDeleted);
//     validateFunctionCall(matchFinalScoreUpdated);
//     validateFunctionCall(betResultCalculated);
//     expect.assertions(7);
//   });

//   it('should process deleted tournament document', async () => {
//     const document = tournamentDocument();
//     const event: DynamoDBStreamEvent = {
//       Records: [
//         {
//           eventName: 'REMOVE',
//           dynamodb: {
//             OldImage: DynamoDB.Converter.marshall(document)
//           }
//         } as DynamoDBRecord
//       ]
//     };

//     tournamentDeleted.mockResolvedValue(undefined);

//     await apiHandler(event, undefined, undefined);
//     validateFunctionCall(tournamentDeleted, { tournamentId: document.id });
//     validateFunctionCall(teamDeleted);
//     validateFunctionCall(teamUpdated);
//     validateFunctionCall(tournamentUpdated);
//     validateFunctionCall(matchDeleted);
//     validateFunctionCall(matchFinalScoreUpdated);
//     validateFunctionCall(betResultCalculated);
//     expect.assertions(7);
//   });

//   it('should process deleted match document', async () => {
//     const document = matchDocument();
//     const event: DynamoDBStreamEvent = {
//       Records: [
//         {
//           eventName: 'REMOVE',
//           dynamodb: {
//             OldImage: DynamoDB.Converter.marshall(document)
//           }
//         } as DynamoDBRecord
//       ]
//     };

//     matchDeleted.mockResolvedValue(undefined);

//     await apiHandler(event, undefined, undefined);
//     validateFunctionCall(matchDeleted, { matchId: document.id });
//     validateFunctionCall(teamDeleted);
//     validateFunctionCall(teamUpdated);
//     validateFunctionCall(tournamentUpdated);
//     validateFunctionCall(tournamentDeleted);
//     validateFunctionCall(matchFinalScoreUpdated);
//     validateFunctionCall(betResultCalculated);
//     expect.assertions(7);
//   });

//   it('should process modified match document with finalScore', async () => {
//     const document = matchDocument({
//       finalScore: {
//         homeScore: 1,
//         awayScore: 2
//       }
//     });
//     const event: DynamoDBStreamEvent = {
//       Records: [
//         {
//           eventName: 'MODIFY',
//           dynamodb: {
//             NewImage: DynamoDB.Converter.marshall(document)
//           }
//         } as DynamoDBRecord
//       ]
//     };

//     matchFinalScoreUpdated.mockResolvedValue(undefined);

//     await apiHandler(event, undefined, undefined);
//     validateFunctionCall(matchFinalScoreUpdated, { match: document });
//     validateFunctionCall(teamDeleted);
//     validateFunctionCall(teamUpdated);
//     validateFunctionCall(tournamentUpdated);
//     validateFunctionCall(tournamentDeleted);
//     validateFunctionCall(matchDeleted);
//     validateFunctionCall(betResultCalculated);
//     expect.assertions(7);
//   });

//   it('should skip processing modified match document without finalScore', async () => {
//     const document = matchDocument();
//     const event: DynamoDBStreamEvent = {
//       Records: [
//         {
//           eventName: 'MODIFY',
//           dynamodb: {
//             NewImage: DynamoDB.Converter.marshall(document)
//           }
//         } as DynamoDBRecord
//       ]
//     };

//     await apiHandler(event, undefined, undefined);
//     validateFunctionCall(matchFinalScoreUpdated);
//     validateFunctionCall(teamDeleted);
//     validateFunctionCall(teamUpdated);
//     validateFunctionCall(tournamentUpdated);
//     validateFunctionCall(tournamentDeleted);
//     validateFunctionCall(matchDeleted);
//     validateFunctionCall(betResultCalculated);
//     expect.assertions(7);
//   });

//   it('should skip processing otherwise', async () => {
//     const document = matchDocument();
//     const event: DynamoDBStreamEvent = {
//       Records: [
//         {
//           eventName: 'INSERT',
//           dynamodb: {
//             OldImage: DynamoDB.Converter.marshall(document)
//           }
//         } as DynamoDBRecord
//       ]
//     };

//     teamUpdated.mockResolvedValue(undefined);

//     await apiHandler(event, undefined, undefined);
//     validateFunctionCall(tournamentDeleted);
//     validateFunctionCall(teamDeleted);
//     validateFunctionCall(teamUpdated);
//     validateFunctionCall(tournamentUpdated);
//     validateFunctionCall(matchDeleted);
//     validateFunctionCall(matchFinalScoreUpdated);
//     validateFunctionCall(betResultCalculated);
//     expect.assertions(7);
//   });
// });
