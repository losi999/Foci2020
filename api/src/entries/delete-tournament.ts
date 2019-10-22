import { default as handler } from '@/handlers/delete-tournament-handler';
import { databaseService } from '@/dependencies';
import { deleteTournamentServiceFactory } from '@/business-services/delete-tournament-service';

const deleteTournamentService = deleteTournamentServiceFactory(databaseService);

export default handler(deleteTournamentService);
