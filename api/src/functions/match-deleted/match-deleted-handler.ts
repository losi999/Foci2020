import { IMatchDeletedService } from '@foci2020/api/functions/match-deleted/match-deleted-service';
import { MatchDeletedEvent } from '@foci2020/shared/types/events';

export default (matchDeleted: IMatchDeletedService): AWSLambda.Handler<MatchDeletedEvent> => event => matchDeleted(event);
