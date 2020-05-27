import { default as handler } from '@foci2020/api/functions/related-document/related-document-handler';
import { relatedDocumentServiceFactory } from '@foci2020/api/functions/related-document/related-document-service';
import { databaseService, betDocumentConverter, standingDocumentConverter } from '@foci2020/api/dependencies';

const relatedDocumentService = relatedDocumentServiceFactory(databaseService, betDocumentConverter, standingDocumentConverter);

export default handler(relatedDocumentService);
