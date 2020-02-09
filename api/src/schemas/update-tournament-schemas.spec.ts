import * as schemas from '@/schemas/update-tournament-schemas';
import { validatorService } from '@/dependencies';
import { TournamentRequest } from '@/types/types';

describe('Update tournament schemas', () => {
  describe('body', () => {
    const instanceType = 'body';
    let body: TournamentRequest;

    beforeEach(() => {
      body = {
        tournamentName: 'tournament'
      };
    });

    it('should accept valid body', () => {
      const result = validatorService.validate(body, schemas.body, instanceType);
      expect(result).toBeUndefined();
    });

    it('should deny if body has additional property', () => {
      (body as any).extra = 'asd';
      const result = validatorService.validate(body, schemas.body, instanceType);
      expect(result).toContain('additional');
    });

    it('should deny if tournamentName is missing from body', () => {
      body.tournamentName = undefined;
      const result = validatorService.validate(body, schemas.body, instanceType);
      expect(result).toContain('tournamentName');
      expect(result).toContain('required');
    });

    it('should deny if tournamentName is not string', () => {
      (body.tournamentName as any) = 2;
      const result = validatorService.validate(body, schemas.body, instanceType);
      expect(result).toContain('tournamentName');
      expect(result).toContain('string');
    });

    it('should deny if tournamentName is too short', () => {
      body.tournamentName = '';
      const result = validatorService.validate(body, schemas.body, instanceType);
      expect(result).toContain('tournamentName');
      expect(result).toContain('shorter');
    });
  });
  describe('pathParameters', () => {
    const instanceType = 'pathParameters';
    let pathParameters: { tournamentId: string };

    beforeEach(() => {
      pathParameters = {
        tournamentId: '36ac8b1d-856a-4449-afa9-57390d82541c'
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

    it('should deny if tournamentId is missing from pathParameters', () => {
      pathParameters.tournamentId = undefined;
      const result = validatorService.validate(pathParameters, schemas.pathParameters, instanceType);
      expect(result).toContain('tournamentId');
      expect(result).toContain('required');
    });

    it('should deny if tournamentId is not string', () => {
      (pathParameters.tournamentId as any) = 1;
      const result = validatorService.validate(pathParameters, schemas.pathParameters, instanceType);
      expect(result).toContain('tournamentId');
      expect(result).toContain('string');
    });

    it('should deny if tournamentId is wrong format', () => {
      pathParameters.tournamentId = 'not-uuid';
      const result = validatorService.validate(pathParameters, schemas.pathParameters, instanceType);
      expect(result).toContain('tournamentId');
      expect(result).toContain('format');
    });
  });
});
