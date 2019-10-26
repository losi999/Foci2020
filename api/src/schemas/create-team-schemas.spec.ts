import * as schemas from '@/schemas/create-team-schemas';
import { validatorService } from '@/dependencies';
import { TeamRequest } from '@/types/requests';

describe('Create team body schema', () => {
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
