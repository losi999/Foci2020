import * as schemas from '@/schemas/registration-schemas';
import { validatorService } from '@/dependencies';
import { RegistrationRequest } from '@/types/requests';

describe('Registration body schema', () => {
  const instanceType = 'body';
  let body: RegistrationRequest;

  beforeEach(() => {
    body = {
      email: 'aaa@aaa.com',
      displayName: 'John',
      password: 'asdfghjk'
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

  it('should deny if email is missing from body', () => {
    body.email = undefined;
    const result = validatorService.validate(body, schemas.body, instanceType);
    expect(result).toContain('email');
    expect(result).toContain('required');
  });

  it('should deny if email is not string', () => {
    (body.email as any) = 2;
    const result = validatorService.validate(body, schemas.body, instanceType);
    expect(result).toContain('email');
    expect(result).toContain('string');
  });

  it('should deny if email is not email', () => {
    body.email = 'abcd';
    const result = validatorService.validate(body, schemas.body, instanceType);
    expect(result).toContain('email');
    expect(result).toContain('format');
  });

  it('should deny if displayName is missing from body', () => {
    body.displayName = undefined;
    const result = validatorService.validate(body, schemas.body, instanceType);
    expect(result).toContain('displayName');
    expect(result).toContain('required');
  });

  it('should deny if displayName is not string', () => {
    (body.displayName as any) = 2;
    const result = validatorService.validate(body, schemas.body, instanceType);
    expect(result).toContain('displayName');
    expect(result).toContain('string');
  });

  it('should deny if displayName is too short', () => {
    body.displayName = '';
    const result = validatorService.validate(body, schemas.body, instanceType);
    expect(result).toContain('displayName');
    expect(result).toContain('shorter');
  });

  it('should deny if password is missing from body', () => {
    body.password = undefined;
    const result = validatorService.validate(body, schemas.body, instanceType);
    expect(result).toContain('password');
    expect(result).toContain('required');
  });

  it('should deny if password is not string', () => {
    (body.password as any) = 2;
    const result = validatorService.validate(body, schemas.body, instanceType);
    expect(result).toContain('password');
    expect(result).toContain('string');
  });

  it('should deny if password is too short', () => {
    body.password = 'ab';
    const result = validatorService.validate(body, schemas.body, instanceType);
    expect(result).toContain('password');
    expect(result).toContain('shorter');
  });
});
