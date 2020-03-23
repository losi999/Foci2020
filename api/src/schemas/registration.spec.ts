import { default as schema } from '@/schemas/registration';
import { validatorService } from '@/dependencies';
import { RegistrationRequest } from '@/types/types';

describe('Registration schema', () => {
  let data: RegistrationRequest;

  beforeEach(() => {
    data = {
      email: 'aaa@aaa.com',
      displayName: 'John',
      password: 'asdfghjk'
    };
  });

  it('should accept valid body', () => {
    const result = validatorService.validate(data, schema);
    expect(result).toBeUndefined();
  });

  it('should deny if body has additional property', () => {
    (data as any).extra = 'asd';
    const result = validatorService.validate(data, schema);
    expect(result).toContain('additional');
  });

  it('should deny if email is missing from body', () => {
    data.email = undefined;
    const result = validatorService.validate(data, schema);
    expect(result).toContain('email');
    expect(result).toContain('required');
  });

  it('should deny if email is not string', () => {
    (data.email as any) = 2;
    const result = validatorService.validate(data, schema);
    expect(result).toContain('email');
    expect(result).toContain('string');
  });

  it('should deny if email is not email', () => {
    data.email = 'abcd';
    const result = validatorService.validate(data, schema);
    expect(result).toContain('email');
    expect(result).toContain('format');
  });

  it('should deny if displayName is missing from body', () => {
    data.displayName = undefined;
    const result = validatorService.validate(data, schema);
    expect(result).toContain('displayName');
    expect(result).toContain('required');
  });

  it('should deny if displayName is not string', () => {
    (data.displayName as any) = 2;
    const result = validatorService.validate(data, schema);
    expect(result).toContain('displayName');
    expect(result).toContain('string');
  });

  it('should deny if displayName is too short', () => {
    data.displayName = '';
    const result = validatorService.validate(data, schema);
    expect(result).toContain('displayName');
    expect(result).toContain('shorter');
  });

  it('should deny if password is missing from body', () => {
    data.password = undefined;
    const result = validatorService.validate(data, schema);
    expect(result).toContain('password');
    expect(result).toContain('required');
  });

  it('should deny if password is not string', () => {
    (data.password as any) = 2;
    const result = validatorService.validate(data, schema);
    expect(result).toContain('password');
    expect(result).toContain('string');
  });

  it('should deny if password is too short', () => {
    data.password = 'ab';
    const result = validatorService.validate(data, schema);
    expect(result).toContain('password');
    expect(result).toContain('shorter');
  });
});
