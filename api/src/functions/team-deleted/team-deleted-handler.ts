import { Handler } from 'aws-lambda';
import { ITeamDeletedService } from '@foci2020/api/functions/team-deleted/team-deleted-service';
import { TeamDeletedEvent } from '@foci2020/shared/types/events';

export default (teamDeleted: ITeamDeletedService): Handler<TeamDeletedEvent> => event => teamDeleted(event);
