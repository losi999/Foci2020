export const expectOk = (status: number) => {
  expect(status).to.equal(200);
};

export const expectBadRequest = (status: number) => {
  expect(status).to.equal(400);
};

export const expectUnauthorized = (status: number) => {
  expect(status).to.equal(401);
};

export const expectForbidden = (status: number) => {
  expect(status).to.equal(403);
};

export const expectNotFound = (status: number) => {
  expect(status).to.equal(404);
};

export const expectRequiredProperty = (propertyName: string, requestPart: string) => (data: any) => {
  expect(data[requestPart]).to.contain(propertyName).to.contain('required');
};

export const expectWrongPropertyType = (propertyName: string, propertyType: string, requestPart: string) => (data: any) => {
  expect(data[requestPart]).to.contain(propertyName).to.contain(propertyType);
};

export const expectWrongPropertyFormat = (propertyName: string, propertyFormat: string, requestPart: string) => (data: any) => {
  expect(data[requestPart]).to.contain(propertyName).to.contain('format').to.contain(propertyFormat);
};

export const expectTooShortProperty = (propertyName: string, minLength: number, requestPart: string) => (data: any) => {
  expect(data[requestPart]).to.contain(propertyName).to.contain('shorter').to.contain(minLength);
};

export const expectTooLongProperty = (propertyName: string, maxLength: number, requestPart: string) => (data: any) => {
  expect(data[requestPart]).to.contain(propertyName).to.contain('longer').to.contain(maxLength);
};
