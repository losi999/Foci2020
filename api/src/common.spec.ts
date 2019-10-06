import { httpError } from '@/common';

describe('httpError common functions', () => {
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
