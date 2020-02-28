import { default as handler } from '@/infrastructure/related-document/related-document-handler';
import { relatedDocumentServiceFactory } from '@/infrastructure/related-document/related-document-service';
import { matchDocumentService, betDocumentService } from '@/shared/dependencies';

const relatedDocumentService = relatedDocumentServiceFactory(matchDocumentService, betDocumentService);

export default handler(relatedDocumentService);
