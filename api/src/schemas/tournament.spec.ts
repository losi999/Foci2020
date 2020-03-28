import { default as schema } from '@/schemas/tournament';
import { validatorService } from '@/dependencies';
import { TournamentRequest } from '@/types/types';
import { validateSchemaAdditionalProperties, validateSchemaRequired, validateSchemaType, validateSchemaMinLength } from '@/common/unit-testing';

describe('Tournament schema', () => {
  let data: TournamentRequest;

  beforeEach(() => {
    data = {
      tournamentName: 'Magyarország'
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

    describe('if data.tournamentName', () => {
      it('is missing', () => {
        data.tournamentName = undefined;
        const result = validatorService.validate(data, schema);
        validateSchemaRequired(result, 'tournamentName');
      });

      it('is not string', () => {
        (data.tournamentName as any) = 2;
        const result = validatorService.validate(data, schema);
        validateSchemaType(result, 'tournamentName', 'string');
      });

      it('is too short', () => {
        data.tournamentName = '';
        const result = validatorService.validate(data, schema);
        validateSchemaMinLength(result, 'tournamentName', 1);
      });
    });
  });
});
