import { default as schema } from '@foci2020/shared/schemas/team-id';
import { IValidatorService, validatorServiceFactory } from '@foci2020/shared/services/validator-service';
import ajv from 'ajv';
import { validateSchemaAdditionalProperties, validateSchemaFormat, validateSchemaType, validateSchemaRequired } from '@foci2020/shared/common/unit-testing';

describe('TeamId schema', () => {
  let data: { teamId: string };
  let validatorService: IValidatorService;

  beforeEach(() => {
    validatorService = validatorServiceFactory(new ajv({
      allErrors: true,
      format: 'full',
    }));

    data = {
      teamId: '36ac8b1d-856a-4449-afa9-57390d82541c', 
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

    describe('if data.teamId', () => {
      it('is missing', () => {
        data.teamId = undefined;
        const result = validatorService.validate(data, schema);
        validateSchemaRequired(result, 'teamId');
      });

      it('is not string', () => {
        (data.teamId as any) = 1;
        const result = validatorService.validate(data, schema);
        validateSchemaType(result, 'teamId', 'string');
      });

      it('is wrong format', () => {
        data.teamId = 'not-uuid';
        const result = validatorService.validate(data, schema);
        validateSchemaFormat(result, 'teamId', 'uuid');
      });
    });
  });
});
