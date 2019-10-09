import { httpError, addMinutes } from '@/common';
import { advanceTo, clear } from 'jest-date-mock';

describe('httpError common function', () => {
  it('should return an error object', () => {
    const statusCode = 418;
    const message = 'I\'m a teapot';
    const error = httpError(statusCode, message);
    expect(error).toEqual({
      statusCode,
      message
    });
  });
});

describe('addMinutes common function', () => {
  const now = new Date(2019, 1, 1, 1, 1, 1);
  beforeEach(() => {
    advanceTo(now);
  });

  afterEach(() => {
    clear();
  });
  it('should add minutes to the given date parameter', () => {
    const from = new Date(2019, 10, 9, 22, 11, 0);
    const result = addMinutes(5, from);
    expect(result).toEqual(new Date(2019, 10, 9, 22, 16, 0));
  });

  it('should add minutes to now', () => {
    const result = addMinutes(5);
    expect(result).toEqual(new Date(2019, 1, 1, 1, 6, 1));
  });
});
