import { IValidatorService, ajvValidatorService } from '@/services/validator-service';
import { JSONSchema7 } from 'json-schema';
import ajv, { Ajv, ErrorObject } from 'ajv';

describe('Validator service', () => {
  let service: IValidatorService;
  let validateSpy: jest.SpyInstance;
  let ajvValidator: Ajv;

  beforeEach(() => {
    ajvValidator = new ajv();
    validateSpy = jest.spyOn(ajvValidator, 'validate');
    service = ajvValidatorService(ajvValidator);
  });
  describe('validate', () => {
    it('should call ajv.validate with parsed string', () => {
      const instance = { id: 'id' };
      const schema = { type: 'object' } as JSONSchema7;

      validateSpy.mockReturnValue(true);

      service.validate(JSON.stringify(instance), schema);
      expect(validateSpy).toHaveBeenCalledWith(schema, instance);
    });

    it('should return undefined if validation is true', () => {
      const instance = { id: 'id' };
      const schema = { type: 'object' } as JSONSchema7;

      validateSpy.mockReturnValue(true);

      const result = service.validate(instance, schema);
      expect(result).toBeUndefined();
    });

    it('should return with error text if validation is false', () => {
      const instance = { id: 'id' };
      const schema = { type: 'object' } as JSONSchema7;

      validateSpy.mockImplementation(() => {
        ajvValidator.errors = [{
        } as ErrorObject];
        ajvValidator.errorsText = () => 'some validation error';
        return false;
      });

      const result = service.validate(instance, schema);
      expect(result).toEqual('some validation error');
    });
  });
});
