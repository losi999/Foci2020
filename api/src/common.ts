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
