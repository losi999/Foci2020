import { default as schema } from '@foci2020/shared/schemas/login';
import { validateSchemaAdditionalProperties, validateSchemaRequired, validateSchemaType, validateSchemaFormat, validateSchemaMinLength } from '@foci2020/shared/common/unit-testing';
import { LoginRequest } from '@foci2020/shared/types/requests';
import { IValidatorService, validatorServiceFactory } from '@foci2020/shared/services/validator-service';
import ajv from 'ajv';

describe('Login schema', () => {
  let data: LoginRequest;
  let validatorService: IValidatorService;

  beforeEach(() => {
    validatorService = validatorServiceFactory(new ajv({
      allErrors: true,
      format: 'full',
    }));

    data = {
      email: 'aaa@aaa.com',
      password: 'asdfghjk',
    };
  });

  it('should accept valid body', () => {
    const result = validatorService.validate(data, schema);
    expect(result).toBeUndefined();
  });

  describe('should deny', () => {
    describe('if data', () => {
      it('has additional property', () => {
        (data as any).extra = 'asd';
        const result = validatorService.validate(data, schema);
        validateSchemaAdditionalProperties(result, 'data');
      });
    });

    describe('if data.email', () => {
      it('is missing', () => {
        data.email = undefined;
        const result = validatorService.validate(data, schema);
        validateSchemaRequired(result, 'email');
      });

      it('is not string', () => {
        (data.email as any) = 2;
        const result = validatorService.validate(data, schema);
        validateSchemaType(result, 'email', 'string');
      });

      it('is not email', () => {
        data.email = 'abcd';
        const result = validatorService.validate(data, schema);
        validateSchemaFormat(result, 'email', 'email');
      });
    });

    describe('if data.password', () => {
      it('is missing', () => {
        data.password = undefined;
        const result = validatorService.validate(data, schema);
        validateSchemaRequired(result, 'password');
      });

      it('is not string', () => {
        (data.password as any) = 2;
        const result = validatorService.validate(data, schema);
        validateSchemaType(result, 'password', 'string');
      });

      it('is too short', () => {
        data.password = 'ab';
        const result = validatorService.validate(data, schema);
        validateSchemaMinLength(result, 'password', 6);
      });
    });
  });
});
