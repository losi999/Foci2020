import { default as schema } from '@/schemas/list-matches-schemas';
import { validatorService } from '@/dependencies';

describe('List matches query schema', () => {
  const instanceType = 'queryStringParameters';
  let query: { tournamentId: string };

  beforeEach(() => {
    query = {
      tournamentId: '36ac8b1d-856a-4449-afa9-57390d82541c'
    };
  });

  it('should accept empty object query', () => {
    const result = validatorService.validate({}, schema, instanceType);
    expect(result).toBeUndefined();
  });

  it('should accept valid query', () => {
    const result = validatorService.validate(query, schema, instanceType);
    expect(result).toBeUndefined();
  });

  it('should deny if query has additional property', () => {
    (query as any).extra = 'asd';
    const result = validatorService.validate(query, schema, instanceType);
    expect(result).toContain('additional');
  });

  it('should deny if tournamentId is not string', () => {
    (query.tournamentId as any) = 1;
    const result = validatorService.validate(query, schema, instanceType);
    expect(result).toContain('tournamentId');
    expect(result).toContain('string');
  });

  it('should deny if tournamentId is wrong format', () => {
    query.tournamentId = 'not-uuid';
    const result = validatorService.validate(query, schema, instanceType);
    expect(result).toContain('tournamentId');
    expect(result).toContain('format');
  });
});
