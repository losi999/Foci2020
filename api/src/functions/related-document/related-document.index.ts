import { default as handler } from '@/functions/related-document/related-document-handler';
import { relatedDocumentServiceFactory } from '@/functions/related-document/related-document-service';
import { matchDocumentService, betDocumentService } from '@/dependencies';

const relatedDocumentService = relatedDocumentServiceFactory(matchDocumentService, betDocumentService);

export default handler(relatedDocumentService);
