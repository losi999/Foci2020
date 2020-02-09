export const httpError = (statusCode: number, message: string) => ({
  statusCode,
  message,
});

export const addMinutes = (minutes: number, dateFrom?: Date): Date => {
  if (dateFrom) {
    return new Date(dateFrom.getTime() + minutes * 60 * 1000);
  }
  return new Date(Date.now() + minutes * 60 * 1000);
};

export const chunk = (input: any[], count: number): any[][] => {
  const chunked: any[][] = [];
  for (let i = 0; i < input.length; i += count) {
    chunked.push(input.slice(i, i + count));
  }
  return chunked;
};

export type Mock<T> = {
  service: T;
  functions: {
    // @ts-ignore works as expected but shows error, re-investigate later
    [P in keyof T]?: jest.Mock<ReturnType<T[P]>, any[]>;
  };
};

/* istanbul ignore next */
export const createMockService = <T>(...functionsToMock: (keyof T)[]): Mock<T> => {
  const functions = functionsToMock.reduce((accumulator, currentValue) => ({
    ...accumulator,
    [currentValue]: jest.fn()
  }), {});

  return {
    functions,
    service: jest.fn<Partial<T>, undefined[]>(() => functions)() as T
  };
};

/* istanbul ignore next */
export const validateError = (message: string, statusCode?: number) => (error: any) => {
  expect(error.message).toEqual(message);
  if (statusCode) {
    expect(error.statusCode).toEqual(statusCode);
  }
};

export const awsResolvedValue = (data?: any) => ({
  promise: () => Promise.resolve(data)
}) as any;

export const awsRejectedValue = (data?: any) => ({
  promise: () => Promise.reject(data)
}) as any;
