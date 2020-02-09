import * as schemas from '@/team/update-team/update-team-schemas';
import { validatorService } from '@/shared/dependencies';
import { TeamRequest } from '@/shared/types/types';

describe('Update team schemas', () => {
  describe('body', () => {
    const instanceType = 'body';
    let body: TeamRequest;

    beforeEach(() => {
      body = {
        shortName: 'HUN',
        image: 'http://image.com/hun.jpg',
        teamName: 'Magyarország'
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

    it('should deny if teamName is missing from body', () => {
      body.teamName = undefined;
      const result = validatorService.validate(body, schemas.body, instanceType);
      expect(result).toContain('teamName');
      expect(result).toContain('required');
    });

    it('should deny if teamName is not string', () => {
      (body.teamName as any) = 2;
      const result = validatorService.validate(body, schemas.body, instanceType);
      expect(result).toContain('teamName');
      expect(result).toContain('string');
    });

    it('should deny if teamName is too short', () => {
      body.teamName = '';
      const result = validatorService.validate(body, schemas.body, instanceType);
      expect(result).toContain('teamName');
      expect(result).toContain('shorter');
    });

    it('should deny if image is missing from body', () => {
      body.image = undefined;
      const result = validatorService.validate(body, schemas.body, instanceType);
      expect(result).toContain('image');
      expect(result).toContain('required');
    });

    it('should deny if image is not string', () => {
      (body.image as any) = 2;
      const result = validatorService.validate(body, schemas.body, instanceType);
      expect(result).toContain('image');
      expect(result).toContain('string');
    });

    it('should deny if image is not uri', () => {
      body.image = 'abcd';
      const result = validatorService.validate(body, schemas.body, instanceType);
      expect(result).toContain('image');
      expect(result).toContain('format');
    });

    it('should deny if shortName is missing from body', () => {
      body.shortName = undefined;
      const result = validatorService.validate(body, schemas.body, instanceType);
      expect(result).toContain('shortName');
      expect(result).toContain('required');
    });

    it('should deny if shortName is not string', () => {
      (body.shortName as any) = 2;
      const result = validatorService.validate(body, schemas.body, instanceType);
      expect(result).toContain('shortName');
      expect(result).toContain('string');
    });

    it('should deny if shortName is too short', () => {
      body.shortName = 'ab';
      const result = validatorService.validate(body, schemas.body, instanceType);
      expect(result).toContain('shortName');
      expect(result).toContain('shorter');
    });

    it('should deny if shortName is too long', () => {
      body.shortName = 'abcd';
      const result = validatorService.validate(body, schemas.body, instanceType);
      expect(result).toContain('shortName');
      expect(result).toContain('longer');
    });
  });

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
