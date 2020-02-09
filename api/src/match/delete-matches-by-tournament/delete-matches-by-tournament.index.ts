import { default as handler } from '@/match/delete-matches-by-tournament/delete-matches-by-tournament-handler';
import { matchDocumentService } from '@/shared/dependencies';
import { deleteMatchesByTournamentServiceFactory } from '@/match/delete-matches-by-tournament/delete-matches-by-tournament-service';

const deleteMatchesByTournamentService = deleteMatchesByTournamentServiceFactory(matchDocumentService);

export default handler(deleteMatchesByTournamentService);
