import { Handler } from 'aws-lambda';
import { IBetResultCalculatedService } from '@foci2020/api/functions/bet-result-calculated/bet-result-calculated-service';
import { BetResultCalculatedEvent } from '@foci2020/shared/types/events';

export default (betResultCalculated: IBetResultCalculatedService): Handler<BetResultCalculatedEvent> => event => betResultCalculated(event);
