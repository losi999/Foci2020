import { Ajv } from 'ajv';
import { JSONSchema7 } from 'json-schema';

export interface IValidatorService {
  validate(instance: object | string, schema: JSONSchema7, instanceType: string): string | undefined;
}

export const ajvValidatorService = (validator: Ajv): IValidatorService => {
  return {
    validate: (instance: object | string, schema: JSONSchema7, instanceType: string) => {
      const obj = typeof instance === 'string' ? JSON.parse(instance) : instance || {};
      const isValid = validator.validate(schema, obj);
      if (!isValid) {
        return `The ${instanceType} has ${validator.errors.length} validation error(s): ${validator.errorsText()}.`;
      }
    },
  };
};
