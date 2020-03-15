export type Mock<T> = {
  service: T;
  functions: {
    // @ts-ignore works as expected but shows error, re-investigate later
    [P in keyof T]?: jest.Mock<ReturnType<T[P]>, Parameters<T[P]>>;
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

export const expectFunctionsNotHaveBeenCalled = (...functions: jest.Mock[]): void => {
  functions.forEach((func) => {
    expect(func).not.toHaveBeenCalled();
  });
};

export const expectFunctionHaveBeenCalledWith = <T extends (...args: any) => any>(func: T, ...args: Parameters<T>): void => {
  expect(func).toHaveBeenCalledWith(...args);
};

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
