import * as schemas from '@/schemas/get-match-schemas';
import { validatorService } from '@/dependencies';

describe('Get match schemas', () => {
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

    it('should deny if matchId is missing from pathParameters', () => {
      pathParameters.matchId = undefined;
      const result = validatorService.validate(pathParameters, schemas.pathParameters, instanceType);
      expect(result).toContain('matchId');
      expect(result).toContain('required');
    });

    it('should deny if matchId is not string', () => {
      (pathParameters.matchId as any) = 1;
      const result = validatorService.validate(pathParameters, schemas.pathParameters, instanceType);
      expect(result).toContain('matchId');
      expect(result).toContain('string');
    });

    it('should deny if matchId is wrong format', () => {
      pathParameters.matchId = 'not-uuid';
      const result = validatorService.validate(pathParameters, schemas.pathParameters, instanceType);
      expect(result).toContain('matchId');
      expect(result).toContain('format');
    });
  });
});
