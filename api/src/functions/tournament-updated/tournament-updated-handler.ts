import { ITournamentUpdatedService } from '@foci2020/api/functions/tournament-updated/tournament-updated-service';
import { TournamentUpdatedEvent } from '@foci2020/shared/types/events';

export default (tournamentUpdated: ITournamentUpdatedService): AWSLambda.Handler<TournamentUpdatedEvent> => event => tournamentUpdated(event);
