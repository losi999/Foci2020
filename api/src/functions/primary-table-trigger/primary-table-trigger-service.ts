import { Document } from '@foci2020/shared/types/documents';
import { IEventService } from '@foci2020/shared/services/event-service';

export interface IPrimaryTableTriggerService {
  (ctx: {
    eventName: AWSLambda.DynamoDBRecord['eventName'];
    oldDocument: Document;
    newDocument: Document;
  }): Promise<void>;
}

export const primaryTableTriggerServiceFactory = (eventService: IEventService): IPrimaryTableTriggerService => {
  return async ({ newDocument, oldDocument, eventName }) => {

    switch (eventName) {
      case 'MODIFY': {
        await eventService.invokeArchiveDocument({
          document: oldDocument, 
        });

        switch (newDocument.documentType) {
          case 'team': {
            await eventService.invokeTeamUpdated({
              team: newDocument, 
            });
          } break;
          case 'tournament': {
            await eventService.invokeTournamentUpdated({
              tournament: newDocument, 
            });
          } break;
          case 'match': {
            if (newDocument.finalScore) {
              await eventService.invokeMatchFinalScoreUpdated({
                match: newDocument, 
              });
            }
          } break;
          case 'bet': {
            await eventService.invokeBetResultCalculated({
              tournamentId: newDocument.tournamentId,
              userId: newDocument.userId,
              expiresIn: newDocument.expiresAt - (new Date().getTime() / 1000),
            });
          }
        }
      } break;
      case 'REMOVE': {
        await eventService.invokeArchiveDocument({
          document: oldDocument, 
        });

        switch (oldDocument.documentType) {
          case 'team': {
            await eventService.invokeTeamDeleted({
              teamId: oldDocument.id, 
            });
          } break;
          case 'tournament': {
            await eventService.invokeTournamentDeleted({
              tournamentId: oldDocument.id, 
            });
          } break;
          case 'match': {
            await eventService.invokeMatchDeleted({
              matchId: oldDocument.id, 
            });
          } break;
          case 'bet': {
            await eventService.invokeBetResultCalculated({
              tournamentId: oldDocument.tournamentId,
              userId: oldDocument.userId,
              expiresIn: oldDocument.expiresAt - (new Date().getTime() / 1000),
            });
          }
        }
      } break;
    }
  };
};
