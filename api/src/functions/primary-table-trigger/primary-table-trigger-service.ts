import { Document } from '@foci2020/shared/types/documents';
import { IEventService } from '@foci2020/shared/services/event-service';
import { DynamoDBRecord } from 'aws-lambda';

export interface IPrimaryTableTriggerService {
  (ctx: {
    eventName: DynamoDBRecord['eventName'];
    oldDocument: Document;
    newDocument: Document;
  }): Promise<void>;
}

export const primaryTableTriggerServiceFactory = (eventService: IEventService): IPrimaryTableTriggerService => {
  return async ({ newDocument, oldDocument, eventName }) => {

    switch (eventName) {
      case 'MODIFY': {
        switch (newDocument.documentType) {
          case 'team': {
            await eventService.invokeTeamUpdated({ team: newDocument });
          } break;
          case 'tournament': {
            await eventService.invokeTournamentUpdated({ tournament: newDocument });
          } break;
          case 'match': {
            if (newDocument.finalScore) {
              await eventService.invokeMatchFinalScoreUpdated({ match: newDocument });
            }
          } break;
          case 'bet': {
            await eventService.invokeBetResultCalculated({
              tournamentId: newDocument.tournamentId,
              userId: newDocument.userId,
              expiresIn: newDocument.expiresAt - (new Date().getTime() / 1000)
            });
          }
        }
      } break;
      case 'REMOVE': {
        switch (oldDocument.documentType) {
          case 'team': {
            await eventService.invokeTeamDeleted({ teamId: oldDocument.id });
          } break;
          case 'tournament': {
            await eventService.invokeTournamentDeleted({ tournamentId: oldDocument.id });
          } break;
          case 'match': {
            await eventService.invokeMatchDeleted({ matchId: oldDocument.id });
          } break;
        }
      } break;
    }

    await eventService.invokeArchiveDocument({ document: oldDocument });
  };
};
