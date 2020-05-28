export const expectOkResponse = (response: Cypress.Response) => {
  expect(response.status).to.equal(200);
  return response.body as Cypress.ChainableResponseBody;
};

export const expectBadRequestResponse = (response: Cypress.Response) => {
  expect(response.status).to.equal(400);
  return response.body as Cypress.ChainableResponseBody;
};

export const expectUnauthorizedResponse = (response: Cypress.Response) => {
  expect(response.status).to.equal(401);
  return response.body as Cypress.ChainableResponseBody;
};

export const expectForbiddenResponse = (response: Cypress.Response) => {
  expect(response.status).to.equal(403);
  return response.body as Cypress.ChainableResponseBody;
};

export const expectNotFoundResponse = (response: Cypress.Response) => {
  expect(response.status).to.equal(404);
  return response.body as Cypress.ChainableResponseBody;
};

export const expectMessage = (body: any, message: string) => {
  expect(body).to.equal(message);
};

export const expectRequiredProperty = (body: any, propertyName: string, requestPart: string) => {
  expect(body[requestPart]).to.contain(propertyName).to.contain('required');
};

export const expectWrongPropertyType = (body: any, propertyName: string, propertyType: string, requestPart: string) => {
  expect(body[requestPart]).to.contain(propertyName).to.contain(propertyType);
};

export const expectWrongPropertyFormat = (body: any, propertyName: string, propertyFormat: string, requestPart: string) => {
  expect(body[requestPart]).to.contain(propertyName).to.contain('format').to.contain(propertyFormat);
};

export const expectTooShortProperty = (body: any, propertyName: string, minLength: number, requestPart: string) => {
  expect(body[requestPart]).to.contain(propertyName).to.contain('shorter').to.contain(minLength);
};

export const expectTooLongProperty = (body: any, propertyName: string, maxLength: number, requestPart: string) => {
  expect(body[requestPart]).to.contain(propertyName).to.contain('longer').to.contain(maxLength);
};

export const expectTooSmallNumberProperty = (body: any, propertyName: string, minimum: number, requestPart: string) => {
  expect(body[requestPart]).to.contain(propertyName).to.contain('>=').to.contain(minimum);
};

export const expectTooLargeNumberProperty = (body: any, propertyName: string, maximum: number, requestPart: string) => {
  expect(body[requestPart]).to.contain(propertyName).to.contain('<=').to.contain(maximum);
};
