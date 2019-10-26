import * as schemas from '@/schemas/create-tournament-schemas';
import { validatorService } from '@/dependencies';
import { TournamentRequest } from '@/types/requests';

describe('Create tournament body schema', () => {
  const instanceType = 'body';
  let body: TournamentRequest;

  beforeEach(() => {
    body = {
      tournamentName: 'Magyarország'
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
