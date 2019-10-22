import { default as handler } from '@/handlers/delete-match-with-tournament-handler';
import { databaseService } from '@/dependencies';
import { deleteMatchWithTournamentServiceFactory } from '@/business-services/delete-match-with-tournament-service';

const deleteMatchWithTournamentService = deleteMatchWithTournamentServiceFactory(databaseService);

export default handler(deleteMatchWithTournamentService);
