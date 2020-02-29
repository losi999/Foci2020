import * as schemas from '@/functions/place-bet/place-bet-schemas';
import { validatorService } from '@/dependencies';
import { BetRequest } from '@/types/types';

describe('Place bet schema', () => {
  describe('body', () => {
    const instanceType = 'body';
    let body: BetRequest;

    beforeEach(() => {
      body = {
        homeScore: 1,
        awayScore: 2
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

    describe('should deny if homeScore is', () => {
      it('missing from body', () => {
        body.homeScore = undefined;
        const result = validatorService.validate(body, schemas.body, instanceType);
        expect(result).toContain('homeScore');
        expect(result).toContain('required');
      });

      it('not integer', () => {
        (body.homeScore as any) = 'asdf';
        const result = validatorService.validate(body, schemas.body, instanceType);
        expect(result).toContain('homeScore');
        expect(result).toContain('integer');
      });

      it('less than 0', () => {
        body.homeScore = -1;
        const result = validatorService.validate(body, schemas.body, instanceType);
        expect(result).toContain('homeScore');
        expect(result).toContain('>=');
        expect(result).toContain('0');
      });
    });

    describe('should deny if awayScore is', () => {
      it('missing from body', () => {
        body.awayScore = undefined;
        const result = validatorService.validate(body, schemas.body, instanceType);
        expect(result).toContain('awayScore');
        expect(result).toContain('required');
      });

      it('not integer', () => {
        (body.awayScore as any) = 'asdf';
        const result = validatorService.validate(body, schemas.body, instanceType);
        expect(result).toContain('awayScore');
        expect(result).toContain('integer');
      });

      it('less than 0', () => {
        body.awayScore = -1;
        const result = validatorService.validate(body, schemas.body, instanceType);
        expect(result).toContain('awayScore');
        expect(result).toContain('>=');
        expect(result).toContain('0');
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
