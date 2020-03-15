import * as schemas from '@/functions/set-final-score-of-match/set-final-score-of-match-schemas';
import { validatorService } from '@/dependencies';
import { Score } from '@/types/types';

describe('Set final score of match schema', () => {
  describe('body', () => {
    const instanceType = 'body';
    let body: Score;

    beforeEach(() => {
      body = {
        homeScore: 1,
        awayScore: 0
      };
    });

    it('should accept valid body', () => {
      const result = validatorService.validate(body, schemas.body, instanceType);
      expect(result).toBeUndefined();
    });

    describe('should deny', () => {
      describe('if data', () => {
        it('should deny if body has additional property', () => {
          (body as any).extra = 'asd';
          const result = validatorService.validate(body, schemas.body, instanceType);
          expect(result).toContain('additional');
        });
      });

      describe('if data.homeScore', () => {
        it('is missing', () => {
          body.homeScore = undefined;
          const result = validatorService.validate(body, schemas.body, instanceType);
          expect(result).toContain('homeScore');
          expect(result).toContain('required');
        });

        it('is not integer', () => {
          body.homeScore = 1.5;
          const result = validatorService.validate(body, schemas.body, instanceType);
          expect(result).toContain('homeScore');
          expect(result).toContain('integer');
        });

        it('is less than 0', () => {
          body.homeScore = -1;
          const result = validatorService.validate(body, schemas.body, instanceType);
          expect(result).toContain('homeScore');
          expect(result).toContain('>= 0');
        });
      });

      describe('if data.awayScore', () => {
        it('is missing', () => {
          body.awayScore = undefined;
          const result = validatorService.validate(body, schemas.body, instanceType);
          expect(result).toContain('awayScore');
          expect(result).toContain('required');
        });

        it('is not integer', () => {
          body.awayScore = 1.5;
          const result = validatorService.validate(body, schemas.body, instanceType);
          expect(result).toContain('awayScore');
          expect(result).toContain('integer');
        });

        it('is less than 0', () => {
          body.awayScore = -1;
          const result = validatorService.validate(body, schemas.body, instanceType);
          expect(result).toContain('awayScore');
          expect(result).toContain('>= 0');
        });
      });
    });
  });

  describe('pathParameters', () => {
    const instanceType = 'pathParameters';
    let pathParameters: { matchId: string };

    beforeEach(() => {
      pathParameters = {
        matchId: '36ac8b1d-856a-4449-afa9-57390d82541c'
      };
    });

    it('should accept valid pathParameters', () => {
      const result = validatorService.validate(pathParameters, schemas.pathParameters, instanceType);
      expect(result).toBeUndefined();
    });

    describe('should deny', () => {
      describe('if data', () => {
        it('has additional property', () => {
          (pathParameters as any).extra = 'asd';
          const result = validatorService.validate(pathParameters, schemas.pathParameters, instanceType);
          expect(result).toContain('additional');
        });
      });

      describe('if data.matchId', () => {
        it('is missing from pathParameters', () => {
          pathParameters.matchId = undefined;
          const result = validatorService.validate(pathParameters, schemas.pathParameters, instanceType);
          expect(result).toContain('matchId');
          expect(result).toContain('required');
        });

        it('is not string', () => {
          (pathParameters.matchId as any) = 1;
          const result = validatorService.validate(pathParameters, schemas.pathParameters, instanceType);
          expect(result).toContain('matchId');
          expect(result).toContain('string');
        });

        it('is wrong format', () => {
          pathParameters.matchId = 'not-uuid';
          const result = validatorService.validate(pathParameters, schemas.pathParameters, instanceType);
          expect(result).toContain('matchId');
          expect(result).toContain('format');
        });
      });
    });
  });
});
