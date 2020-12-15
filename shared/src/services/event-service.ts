import { ArchiveDocumentEvent, BetResultCalculatedEvent, MatchDeletedEvent, MatchFinalScoreUpdatedEvent, TeamDeletedEvent, TeamUpdatedEvent, TournamentDeletedEvent, TournamentUpdatedEvent } from '@foci2020/shared/types/events';
import { default as Lambda } from 'aws-sdk/clients/lambda';

export interface IEventService {
  invokeTournamentUpdated(event: TournamentUpdatedEvent): Promise<unknown>;
  invokeTournamentDeleted(event: TournamentDeletedEvent): Promise<unknown>;
  invokeTeamUpdated(event: TeamUpdatedEvent): Promise<unknown>;
  invokeTeamDeleted(event: TeamDeletedEvent): Promise<unknown>;
  invokeMatchDeleted(event: MatchDeletedEvent): Promise<unknown>;
  invokeBetResultCalculated(event: BetResultCalculatedEvent): Promise<unknown>;
  invokeMatchFinalScoreUpdated(event: MatchFinalScoreUpdatedEvent): Promise<unknown>;
  invokeArchiveDocument(event: ArchiveDocumentEvent): Promise<unknown>;
}

export const eventServiceFactory = (config: {
  tournamentUpdatedLambda: string;
  tournamentDeletedLambda: string;
  teamUpdatedLambda: string;
  teamDeletedLambda: string;
  matchDeletedLambda: string;
  betResultCalculatedLambda: string;
  matchFinalScoreUpdatedLambda: string;
  archiveDocumentLambda: string;
}, lambda: Lambda): IEventService => {
  const instance: IEventService = {
    invokeArchiveDocument: event => lambda.invoke({
      FunctionName: config.archiveDocumentLambda,
      InvocationType: 'Event',
      Payload: JSON.stringify(event)
    }).promise(),
    invokeBetResultCalculated: event => lambda.invoke({
      FunctionName: config.betResultCalculatedLambda,
      InvocationType: 'Event',
      Payload: JSON.stringify(event)
    }).promise(),
    invokeMatchDeleted: event => lambda.invoke({
      FunctionName: config.matchDeletedLambda,
      InvocationType: 'Event',
      Payload: JSON.stringify(event)
    }).promise(),
    invokeMatchFinalScoreUpdated: event => lambda.invoke({
      FunctionName: config.matchFinalScoreUpdatedLambda,
      InvocationType: 'Event',
      Payload: JSON.stringify(event)
    }).promise(),
    invokeTeamDeleted: event => lambda.invoke({
      FunctionName: config.teamDeletedLambda,
      InvocationType: 'Event',
      Payload: JSON.stringify(event)
    }).promise(),
    invokeTeamUpdated: event => lambda.invoke({
      FunctionName: config.teamUpdatedLambda,
      InvocationType: 'Event',
      Payload: JSON.stringify(event)
    }).promise(),
    invokeTournamentDeleted: event => lambda.invoke({
      FunctionName: config.tournamentDeletedLambda,
      InvocationType: 'Event',
      Payload: JSON.stringify(event)
    }).promise(),
    invokeTournamentUpdated: event => lambda.invoke({
      FunctionName: config.tournamentDeletedLambda,
      InvocationType: 'Event',
      Payload: JSON.stringify(event)
    }).promise(),
  };

  return instance;
};
