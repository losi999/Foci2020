import { default as handler } from '@/infrastructure/related-document/related-document-handler';
import { relatedDocumentServiceFactory } from '@/infrastructure/related-document/related-document-service';
import { matchDocumentService } from '@/shared/dependencies';

const relatedDocumentService = relatedDocumentServiceFactory(matchDocumentService);

export default handler(relatedDocumentService);
