import { default as schema } from '@/schemas/create-match-body-schema';
import { validatorService } from '@/dependencies';
import { MatchRequest } from '@/types';

describe('Create match body schema', () => {
  const instanceType = 'body';
  let body: MatchRequest;

  beforeEach(() => {
    body = {
      awayTeamId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      tournamentId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      startTime: '2019-10-08T18:25:07.291Z',
      group: 'Döntő',
      homeTeamId: '3fa85f64-5717-4562-b3fc-2c963f66afa6'
    };
  });

  it('should accept valid body', () => {
    const result = validatorService.validate(body, schema, instanceType);
    expect(result).toBeUndefined();
  });

  it('should deny if body has additional property', () => {
    (body as any).extra = 'asd';
    const result = validatorService.validate(body, schema, instanceType);
    expect(result).toContain('additional');
  });

  it('should deny if startTime is missing from body', () => {
    body.startTime = undefined;
    const result = validatorService.validate(body, schema, instanceType);
    expect(result).toContain('startTime');
    expect(result).toContain('required');
  });

  it('should deny if group is missing from body', () => {
    body.group = undefined;
    const result = validatorService.validate(body, schema, instanceType);
    expect(result).toContain('group');
    expect(result).toContain('required');
  });

  it('should deny if homeTeamId is missing from body', () => {
    body.homeTeamId = undefined;
    const result = validatorService.validate(body, schema, instanceType);
    expect(result).toContain('homeTeamId');
    expect(result).toContain('required');
  });

  it('should deny if awayTeamId is missing from body', () => {
    body.awayTeamId = undefined;
    const result = validatorService.validate(body, schema, instanceType);
    expect(result).toContain('awayTeamId');
    expect(result).toContain('required');
  });

  it('should deny if tournamentId is missing from body', () => {
    body.tournamentId = undefined;
    const result = validatorService.validate(body, schema, instanceType);
    expect(result).toContain('tournamentId');
    expect(result).toContain('required');
  });

  it('should deny if startTime is not string', () => {
    (body.startTime as any) = 2;
    const result = validatorService.validate(body, schema, instanceType);
    expect(result).toContain('startTime');
    expect(result).toContain('string');
  });

  it('should deny if startTime is wrong format', () => {
    body.startTime = 'not-date';
    const result = validatorService.validate(body, schema, instanceType);
    expect(result).toContain('startTime');
    expect(result).toContain('format');
  });

  it('should deny if group is not string', () => {
    (body.group as any) = 2;
    const result = validatorService.validate(body, schema, instanceType);
    expect(result).toContain('group');
    expect(result).toContain('string');
  });

  it('should deny if group is too short', () => {
    body.group = '';
    const result = validatorService.validate(body, schema, instanceType);
    expect(result).toContain('group');
    expect(result).toContain('shorter');
  });

  it('should deny if homeTeamId is not string', () => {
    (body.homeTeamId as any) = 2;
    const result = validatorService.validate(body, schema, instanceType);
    expect(result).toContain('homeTeamId');
    expect(result).toContain('string');
  });

  it('should deny if homeTeamId is wrong format', () => {
    body.homeTeamId = 'not-date';
    const result = validatorService.validate(body, schema, instanceType);
    expect(result).toContain('homeTeamId');
    expect(result).toContain('format');
  });

  it('should deny if awayTeamId is not string', () => {
    (body.awayTeamId as any) = 2;
    const result = validatorService.validate(body, schema, instanceType);
    expect(result).toContain('awayTeamId');
    expect(result).toContain('string');
  });

  it('should deny if awayTeamId is wrong format', () => {
    body.awayTeamId = 'not-date';
    const result = validatorService.validate(body, schema, instanceType);
    expect(result).toContain('awayTeamId');
    expect(result).toContain('format');
  });

  it('should deny if tournamentId is not string', () => {
    (body.tournamentId as any) = 2;
    const result = validatorService.validate(body, schema, instanceType);
    expect(result).toContain('tournamentId');
    expect(result).toContain('string');
  });

  it('should deny if tournamentId is wrong format', () => {
    body.tournamentId = 'not-date';
    const result = validatorService.validate(body, schema, instanceType);
    expect(result).toContain('tournamentId');
    expect(result).toContain('format');
  });
});
