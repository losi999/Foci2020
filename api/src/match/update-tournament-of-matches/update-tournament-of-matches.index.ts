import { default as handler } from '@/match/update-tournament-of-matches/update-tournament-of-matches-handler';
import { matchDocumentService } from '@/shared/dependencies';
import { updateTournamentOfMatchesServiceFactory } from '@/match/update-tournament-of-matches/update-tournament-of-matches-service';

const updateTournamentOfMatchesService = updateTournamentOfMatchesServiceFactory(matchDocumentService);

export default handler(updateTournamentOfMatchesService);
