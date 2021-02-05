import ajv from 'ajv';
import { validatorServiceFactory } from '@foci2020/shared/services/validator-service';

const ajvValidator = new ajv({
  allErrors: true,
  format: 'full'
});

export const validatorService = validatorServiceFactory(ajvValidator);
