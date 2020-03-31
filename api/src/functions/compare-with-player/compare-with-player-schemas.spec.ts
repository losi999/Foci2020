import { pathParameters } from '@/functions/compare-with-player/compare-with-player-schemas';
import { validatorService } from '@/dependencies';
import { validateSchemaAdditionalProperties, validateSchemaRequired } from '@/common/unit-testing';

describe('UserId pathParameters', () => {
  let data: {
    userId: string;
    tournamentId: string;
  };

  beforeEach(() => {
    data = {
      userId: '36ac8b1d-856a-4449-afa9-57390d82541c',
      tournamentId: '36ac8b1d-856a-4449-afa9-57390d82541c'
    };
  });

  it('should accept valid data', () => {
    const result = validatorService.validate(data, pathParameters);
    expect(result).toBeUndefined();
  });

  describe('should deny', () => {
    describe('if data', () => {
      it('has additional property', () => {
        (data as any).extra = 'asd';
        const result = validatorService.validate(data, pathParameters);
        validateSchemaAdditionalProperties(result, 'data');
      });
    });

    describe('if data.userId', () => {
      it('is missing', () => {
        data.userId = undefined;
        const result = validatorService.validate(data, pathParameters);
        validateSchemaRequired(result, 'userId');
      });
    });

    describe('if data.tournamentId', () => {
      it('is missing', () => {
        data.tournamentId = undefined;
        const result = validatorService.validate(data, pathParameters);
        validateSchemaRequired(result, 'tournamentId');
      });
    });
  });
});
