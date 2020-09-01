import { default as schema } from '@foci2020/shared/schemas/match-score';
import { IValidatorService, validatorServiceFactory } from '@foci2020/shared/services/validator-service';
import ajv from 'ajv';
import { validateSchemaAdditionalProperties, validateSchemaRequired, validateSchemaType, validateSchemaMinimum } from '@foci2020/shared/common/unit-testing';
import { MatchFinalScoreRequest } from '@foci2020/shared/types/requests';

describe('Match score schema', () => {
  let data: MatchFinalScoreRequest;
  let validatorService: IValidatorService;

  beforeEach(() => {
    validatorService = validatorServiceFactory(new ajv({
      allErrors: true,
      format: 'full'
    }));

    data = {
      homeScore: 1,
      awayScore: 0
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

    describe('if data.homeScore', () => {
      it('is missing', () => {
        data.homeScore = undefined;
        const result = validatorService.validate(data, schema);
        validateSchemaRequired(result, 'homeScore');
      });

      it('is not integer', () => {
        data.homeScore = 1.5;
        const result = validatorService.validate(data, schema);
        validateSchemaType(result, 'homeScore', 'integer');
      });

      it('is less than 0', () => {
        data.homeScore = -1;
        const result = validatorService.validate(data, schema);
        validateSchemaMinimum(result, 'homeScore', 0);
      });
    });

    describe('if data.awayScore', () => {
      it('is missing', () => {
        data.awayScore = undefined;
        const result = validatorService.validate(data, schema);
        validateSchemaRequired(result, 'awayScore');
      });

      it('is not integer', () => {
        data.awayScore = 1.5;
        const result = validatorService.validate(data, schema);
        validateSchemaType(result, 'awayScore', 'integer');
      });

      it('is less than 0', () => {
        data.awayScore = -1;
        const result = validatorService.validate(data, schema);
        validateSchemaMinimum(result, 'awayScore', 0);
      });
    });
  });
});
