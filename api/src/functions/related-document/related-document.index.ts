import { default as handler } from '@/functions/related-document/related-document-handler';
import { relatedDocumentServiceFactory } from '@/functions/related-document/related-document-service';
import { matchDocumentService, betDocumentService, betDocumentConverter, standingDocumentConverter, standingDocumentService } from '@/dependencies';

const relatedDocumentService = relatedDocumentServiceFactory(matchDocumentService, betDocumentService, betDocumentConverter, standingDocumentConverter, standingDocumentService);

export default handler(relatedDocumentService);
