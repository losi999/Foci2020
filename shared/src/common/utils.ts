export const httpError = (statusCode: number, message: string) => ({
  statusCode,
  message,
});

export const addMinutes = (minutes: number, dateFrom?: Date): Date => {
  return addSeconds(minutes * 60, dateFrom);
};

export const addSeconds = (seconds: number, dateFrom?: Date): Date => {
  if (dateFrom) {
    return new Date(dateFrom.getTime() + seconds * 1000);
  }
  return new Date(Date.now() + seconds * 1000);
};

export const chunk = (input: any[], count: number): any[][] => {
  const chunked: any[][] = [];
  for (let i = 0; i < input.length; i += count) {
    chunked.push(input.slice(i, i + count));
  }
  return chunked;
};

const SEPARATOR = '#';
export const concatenate = (...parts: any[]) => parts.join(SEPARATOR);
