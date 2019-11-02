import { default as handler } from '@/handlers/update-match-with-tournament-handler';
import { matchDocumentService } from '@/dependencies';
import { updateMatchWithTournamentServiceFactory } from '@/business-services/update-match-with-tournament-service';

const updateMatchWithTournamentService = updateMatchWithTournamentServiceFactory(matchDocumentService);

export default handler(updateMatchWithTournamentService);
