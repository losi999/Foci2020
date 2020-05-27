import { default as schema } from '@foci2020/shared/schemas/user-id';
import { IValidatorService, validatorServiceFactory } from '@foci2020/shared/services/validator-service';
import ajv from 'ajv';
import { validateSchemaAdditionalProperties, validateSchemaFormat, validateSchemaType, validateSchemaRequired } from '@foci2020/shared/common/unit-testing';

describe('UserId schema', () => {
  let data: { userId: string };
  let validatorService: IValidatorService;

  beforeEach(() => {
    validatorService = validatorServiceFactory(new ajv({
      allErrors: true,
      format: 'full'
    }));

    data = {
      userId: '36ac8b1d-856a-4449-afa9-57390d82541c'
    };
  });

  it('should accept valid data', () => {
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

    describe('if data.userId', () => {
      it('is missing', () => {
        data.userId = undefined;
        const result = validatorService.validate(data, schema);
        validateSchemaRequired(result, 'userId');
      });

      it('is not string', () => {
        (data.userId as any) = 1;
        const result = validatorService.validate(data, schema);
        validateSchemaType(result, 'userId', 'string');
      });

      it('is wrong format', () => {
        data.userId = 'not-uuid';
        const result = validatorService.validate(data, schema);
        validateSchemaFormat(result, 'userId', 'uuid');
      });
    });
  });
});
