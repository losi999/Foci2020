import { default as handler } from '@/match/match-related-document/match-related-document-handler';
import { matchRelatedDocumentServiceFactory } from '@/match/match-related-document/match-related-document-service';
import { matchDocumentService } from '@/shared/dependencies';

const matchRelatedDocumentService = matchRelatedDocumentServiceFactory(matchDocumentService);

export default handler(matchRelatedDocumentService);
