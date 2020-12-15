import { IDatabaseService } from '@foci2020/shared/services/database-service';
import { ArchiveDocumentEvent } from '@foci2020/shared/types/events';

export interface IArchiveDocumentService {
  (ctx: ArchiveDocumentEvent): Promise<void>;
}

export const archiveDocumentServiceFactory = (databaseService: IDatabaseService): IArchiveDocumentService => {
  return async ({ document }) => {
    await databaseService.archiveDocument(document).catch((error) => {
      console.error('Archive document', error, document);
      throw error;
    });
  };
};
