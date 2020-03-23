import { default as handler } from '@/functions/related-document/related-document-handler';
import { relatedDocumentServiceFactory } from '@/functions/related-document/related-document-service';
import { databaseService, betDocumentConverter, standingDocumentConverter } from '@/dependencies';

const relatedDocumentService = relatedDocumentServiceFactory(databaseService, betDocumentConverter, standingDocumentConverter);

export default handler(relatedDocumentService);
