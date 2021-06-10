import { default as schema } from '@foci2020/shared/schemas/match';
import { validatorService } from '@foci2020/shared/dependencies/services/validator-service';
import { validateSchemaAdditionalProperties, validateSchemaRequired, validateSchemaType, validateSchemaFormat, validateSchemaMinLength } from '@foci2020/shared/common/unit-testing';
import { MatchRequest } from '@foci2020/shared/types/requests';
import { TeamIdType, TournamentIdType } from '@foci2020/shared/types/common';

describe('Match schema', () => {
  let data: MatchRequest;

  beforeEach(() => {
    data = {
      awayTeamId: '3fa85f64-5717-4562-b3fc-2c963f66afa6' as TeamIdType,
      tournamentId: '3fa85f64-5717-4562-b3fc-2c963f66afa6' as TournamentIdType,
      startTime: '2019-10-08T18:25:07.291Z',
      group: 'Döntő',
      city: 'Budapest',
      stadium: 'Arena',
      homeTeamId: '3fa85f64-5717-4562-b3fc-2c963f66afa6' as TeamIdType,
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

    describe('if data.startTime', () => {
      it('is missing', () => {
        data.startTime = undefined;
        const result = validatorService.validate(data, schema);
        validateSchemaRequired(result, 'startTime');
      });

      it('is not string', () => {
        (data.startTime as any) = 2;
        const result = validatorService.validate(data, schema);
        validateSchemaType(result, 'startTime', 'string');
      });

      it('is wrong format', () => {
        data.startTime = 'not-date';
        const result = validatorService.validate(data, schema);
        validateSchemaFormat(result, 'startTime', 'date-time');
      });
    });

    describe('if data.group', () => {
      it('is not string', () => {
        (data.group as any) = 2;
        const result = validatorService.validate(data, schema);
        validateSchemaType(result, 'group', 'string');
      });

      it('is too short', () => {
        data.group = '';
        const result = validatorService.validate(data, schema);
        validateSchemaMinLength(result, 'group', 1);
      });
    });

    describe('if data.stadium', () => {
      it('is not string', () => {
        (data.stadium as any) = 2;
        const result = validatorService.validate(data, schema);
        validateSchemaType(result, 'stadium', 'string');
      });

      it('is too short', () => {
        data.stadium = '';
        const result = validatorService.validate(data, schema);
        validateSchemaMinLength(result, 'stadium', 1);
      });
    });

    describe('if data.city', () => {
      it('is missing', () => {
        data.city = undefined;
        const result = validatorService.validate(data, schema);
        validateSchemaRequired(result, 'city');
      });

      it('is not string', () => {
        (data.city as any) = 2;
        const result = validatorService.validate(data, schema);
        validateSchemaType(result, 'city', 'string');
      });

      it('is too short', () => {
        data.city = '';
        const result = validatorService.validate(data, schema);
        validateSchemaMinLength(result, 'city', 1);
      });
    });

    describe('if data.homeTeamId', () => {
      it('is missing', () => {
        data.homeTeamId = undefined;
        const result = validatorService.validate(data, schema);
        validateSchemaRequired(result, 'homeTeamId');
      });

      it('is not string', () => {
        (data.homeTeamId as any) = 2;
        const result = validatorService.validate(data, schema);
        validateSchemaType(result, 'homeTeamId', 'string');
      });

      it('is wrong format', () => {
        data.homeTeamId = 'not-date' as TeamIdType;
        const result = validatorService.validate(data, schema);
        validateSchemaFormat(result, 'homeTeamId', 'uuid');
      });
    });

    describe('if data.awayTeamId', () => {
      it('is missing', () => {
        data.awayTeamId = undefined;
        const result = validatorService.validate(data, schema);
        validateSchemaRequired(result, 'awayTeamId');
      });

      it('is not string', () => {
        (data.awayTeamId as any) = 2;
        const result = validatorService.validate(data, schema);
        validateSchemaType(result, 'awayTeamId', 'string');
      });

      it('is wrong format', () => {
        data.awayTeamId = 'not-date' as TeamIdType;
        const result = validatorService.validate(data, schema);
        validateSchemaFormat(result, 'awayTeamId', 'uuid');
      });
    });

    describe('if data.tournamentId', () => {
      it('is missing', () => {
        data.tournamentId = undefined;
        const result = validatorService.validate(data, schema);
        validateSchemaRequired(result, 'tournamentId');
      });

      it('is not string', () => {
        (data.tournamentId as any) = 2;
        const result = validatorService.validate(data, schema);
        validateSchemaType(result, 'tournamentId', 'string');
      });

      it('is wrong format', () => {
        data.tournamentId = 'not-date' as TournamentIdType;
        const result = validatorService.validate(data, schema);
        validateSchemaFormat(result, 'tournamentId', 'uuid');
      });
    });
  });
});
