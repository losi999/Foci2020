import { eventService } from '@foci2020/shared/dependencies/services/event-service';
import { default as handler } from '@foci2020/api/functions/primary-table-trigger/primary-table-trigger-handler';
import { primaryTableTriggerServiceFactory } from '@foci2020/api/functions/primary-table-trigger/primary-table-trigger-service';

const primaryTableTrigger = primaryTableTriggerServiceFactory(eventService);

export default handler(primaryTableTrigger);
