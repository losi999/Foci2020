import { default as schema } from '@/schemas/team-id';
import { validatorService } from '@/dependencies';
import { validateSchemaAdditionalProperties, validateSchemaFormat, validateSchemaType, validateSchemaRequired } from '@/common/unit-testing';

describe('TeamId schema', () => {
  let data: { teamId: string };

  beforeEach(() => {
    data = {
      teamId: '36ac8b1d-856a-4449-afa9-57390d82541c'
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

    describe('if teamId', () => {
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
