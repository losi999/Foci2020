import { concatenate } from '@foci2020/shared/common/utils';
import { KeyType } from '@foci2020/shared/types/common';
import { SettingDocument, SettingKey } from '@foci2020/shared/types/documents';

export interface ISettingDocumentConverter {
  create(key: SettingKey, value: string): SettingDocument;
}

export const settingDocumentConverterFactory = (): ISettingDocumentConverter => {
  const documentType: SettingDocument['documentType'] = 'setting';

  const instance: ISettingDocumentConverter = {
    create: (key, value): SettingDocument => {

      return {
        documentType,
        value,
        id: key,
        'documentType-id': concatenate(documentType, key) as KeyType,
        expiresAt: undefined,
        modifiedAt: new Date().toISOString(),
        orderingValue: key,
      };
    },
  };

  return instance;
};
