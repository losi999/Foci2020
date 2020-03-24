import { default as schema } from '@/schemas/match-id';
import { validatorService } from '@/dependencies';
import { validateSchemaAdditionalProperties, validateSchemaFormat, validateSchemaType, validateSchemaRequired } from '@/common/unit-testing';

describe('MatchId schema', () => {
  let data: { matchId: string };

  beforeEach(() => {
    data = {
      matchId: '36ac8b1d-856a-4449-afa9-57390d82541c'
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

    describe('if data.matchId', () => {
      it('is missing', () => {
        data.matchId = undefined;
        const result = validatorService.validate(data, schema);
        validateSchemaRequired(result, 'matchId');
      });

      it('is not string', () => {
        (data.matchId as any) = 1;
        const result = validatorService.validate(data, schema);
        validateSchemaType(result, 'matchId', 'string');
      });

      it('is wrong format', () => {
        data.matchId = 'not-uuid';
        const result = validatorService.validate(data, schema);
        validateSchemaFormat(result, 'matchId', 'uuid');
      });
    });
  });
});
