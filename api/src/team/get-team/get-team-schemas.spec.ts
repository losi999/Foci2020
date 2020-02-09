import * as schemas from '@/team/get-team/get-team-schemas';
import { validatorService } from '@/shared/dependencies';

describe('Get team schemas', () => {
  describe('pathParameters', () => {
    const instanceType = 'pathParameters';
    let pathParameters: { teamId: string };

    beforeEach(() => {
      pathParameters = {
        teamId: '36ac8b1d-856a-4449-afa9-57390d82541c'
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

    it('should deny if teamId is missing from pathParameters', () => {
      pathParameters.teamId = undefined;
      const result = validatorService.validate(pathParameters, schemas.pathParameters, instanceType);
      expect(result).toContain('teamId');
      expect(result).toContain('required');
    });

    it('should deny if teamId is not string', () => {
      (pathParameters.teamId as any) = 1;
      const result = validatorService.validate(pathParameters, schemas.pathParameters, instanceType);
      expect(result).toContain('teamId');
      expect(result).toContain('string');
    });

    it('should deny if teamId is wrong format', () => {
      pathParameters.teamId = 'not-uuid';
      const result = validatorService.validate(pathParameters, schemas.pathParameters, instanceType);
      expect(result).toContain('teamId');
      expect(result).toContain('format');
    });
  });
});
