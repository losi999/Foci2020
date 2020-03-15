import * as schemas from '@/functions/list-bets-of-match/list-bets-of-match-schemas';
import { validatorService } from '@/dependencies';

describe('List bets of match schema', () => {
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

    it('should deny if pathParameters has additional property', () => {
      (pathParameters as any).extra = 'asd';
      const result = validatorService.validate(pathParameters, schemas.pathParameters, instanceType);
      expect(result).toContain('additional');
    });

    describe('should deny if matchId is', () => {
      it('missing from pathParameters', () => {
        pathParameters.matchId = undefined;
        const result = validatorService.validate(pathParameters, schemas.pathParameters, instanceType);
        expect(result).toContain('matchId');
        expect(result).toContain('required');
      });

      it('not string', () => {
        (pathParameters.matchId as any) = 1;
        const result = validatorService.validate(pathParameters, schemas.pathParameters, instanceType);
        expect(result).toContain('matchId');
        expect(result).toContain('string');
      });

      it('wrong format', () => {
        pathParameters.matchId = 'not-uuid';
        const result = validatorService.validate(pathParameters, schemas.pathParameters, instanceType);
        expect(result).toContain('matchId');
        expect(result).toContain('format');
      });
    });
  });
});
