import { ITournamentDeletedService } from '@foci2020/api/functions/tournament-deleted/tournament-deleted-service';
import { TournamentDeletedEvent } from '@foci2020/shared/types/events';

export default (tournamentDeleted: ITournamentDeletedService): AWSLambda.Handler<TournamentDeletedEvent> => event => tournamentDeleted(event);
