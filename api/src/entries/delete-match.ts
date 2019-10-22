import { default as handler } from '@/handlers/delete-match-handler';
import { databaseService } from '@/dependencies';
import { deleteMatchServiceFactory } from '@/business-services/delete-match-service';

const deleteMatchService = deleteMatchServiceFactory(databaseService);

export default handler(deleteMatchService);
