import { default as handler } from '@/handlers/update-match-with-tournament-handler';
import { databaseService } from '@/dependencies';
import { updateMatchWithTournamentServiceFactory } from '@/business-services/update-match-with-tournament-service';

const updateMatchWithTournamentService = updateMatchWithTournamentServiceFactory(databaseService);

export default handler(updateMatchWithTournamentService);
