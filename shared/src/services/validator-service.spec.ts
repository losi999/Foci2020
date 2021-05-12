import { IValidatorService, validatorServiceFactory } from '@foci2020/shared/services/validator-service';
import { JSONSchema7 } from 'json-schema';
import ajv, { Ajv, ErrorObject } from 'ajv';

describe('Validator service', () => {
  let service: IValidatorService;
  let validateSpy: jest.SpyInstance;
  let ajvValidator: Ajv;

  beforeEach(() => {
    ajvValidator = new ajv();
    validateSpy = jest.spyOn(ajvValidator, 'validate');
    service = validatorServiceFactory(ajvValidator);
  });
  describe('validate', () => {
    it('should return undefined if validation is true', () => {
      const instance = {
        id: 'id', 
      };
      const schema = {
        type: 'object', 
      } as JSONSchema7;

      validateSpy.mockReturnValue(true);

      const result = service.validate(instance, schema);
      expect(result).toBeUndefined();
    });

    it('should return with error text if validation is false', () => {
      const instance = {
        id: 'id', 
      };
      const schema = {
        type: 'object', 
      } as JSONSchema7;

      validateSpy.mockImplementation(() => {
        ajvValidator.errors = [{} as ErrorObject];
        ajvValidator.errorsText = () => 'some validation error';
        return false;
      });

      const result = service.validate(instance, schema);
      expect(result).toEqual('some validation error');
    });
  });
});
