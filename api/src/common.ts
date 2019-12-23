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

export type Mock<T> = {
  service: T;
  functions: {
    // @ts-ignore works as expected but shows error, re-investigate later
    [P in keyof T]?: jest.Mock<ReturnType<T[P]>, any[]>;
  };
};

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
