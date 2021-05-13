import { IMatchFinalScoreUpdatedService } from '@foci2020/api/functions/match-final-score-updated/match-final-score-updated-service';
import { MatchFinalScoreUpdatedEvent } from '@foci2020/shared/types/events';

export default (matchFinalScoreUpdated: IMatchFinalScoreUpdatedService): AWSLambda.Handler<MatchFinalScoreUpdatedEvent> => event => matchFinalScoreUpdated(event);
