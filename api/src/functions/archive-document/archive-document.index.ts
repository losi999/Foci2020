import { databaseService } from '@foci2020/shared/dependencies/services/database-service';
import { default as handler } from '@foci2020/api/functions/archive-document/archive-document-handler';
import { archiveDocumentServiceFactory } from '@foci2020/api/functions/archive-document/archive-document-service';

const archiveDocumentService = archiveDocumentServiceFactory(databaseService);

export default handler(archiveDocumentService);
