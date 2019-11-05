import { default as handler } from '@/handlers/delete-match-with-tournament-handler';
import { matchDocumentService } from '@/dependencies';
import { deleteMatchWithTournamentServiceFactory } from '@/business-services/delete-match-with-tournament-service';

const deleteMatchWithTournamentService = deleteMatchWithTournamentServiceFactory(matchDocumentService);

export default handler(deleteMatchWithTournamentService);
