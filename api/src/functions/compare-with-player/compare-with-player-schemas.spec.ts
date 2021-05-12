import { pathParameters } from '@foci2020/api/functions/compare-with-player/compare-with-player-schemas';
import { validateSchemaAdditionalProperties, validateSchemaRequired } from '@foci2020/shared/common/unit-testing';
import { validatorService } from '@foci2020/shared/dependencies/services/validator-service';

describe('Compary with player schemas', () => {
  let data: {
    userId: string;
    tournamentId: string;
  };

  beforeEach(() => {
    data = {
      userId: '36ac8b1d-856a-4449-afa9-57390d82541c',
      tournamentId: '36ac8b1d-856a-4449-afa9-57390d82541c',
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
