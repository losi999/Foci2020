import { ITeamUpdatedService } from '@foci2020/api/functions/team-updated/team-updated-service';
import { TeamUpdatedEvent } from '@foci2020/shared/types/events';

export default (teamUpdated: ITeamUpdatedService): AWSLambda.Handler<TeamUpdatedEvent> => event => teamUpdated(event);
