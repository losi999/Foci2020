import { Handler } from 'aws-lambda';
import { IMatchDeletedService } from '@foci2020/api/functions/match-deleted/match-deleted-service';
import { MatchDeletedEvent } from '@foci2020/shared/types/events';

export default (matchDeleted: IMatchDeletedService): Handler<MatchDeletedEvent> => event => matchDeleted(event);
