import { Handler } from 'aws-lambda';
import { IArchiveDocumentService } from '@foci2020/api/functions/archive-document/archive-document-service';
import { ArchiveDocumentEvent } from '@foci2020/shared/types/events';

export default (archiveDocument: IArchiveDocumentService): Handler<ArchiveDocumentEvent> => event => archiveDocument(event);
