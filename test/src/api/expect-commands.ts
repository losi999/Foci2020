import { CommandFunctionWithPreviousSubject } from '@foci2020/test/api/types';

const expectOkResponse = (response: Cypress.Response) => {
  expect(response.status).to.equal(200);
  return response.body as Cypress.ChainableResponseBody;
};

const expectBadRequestResponse = (response: Cypress.Response) => {
  expect(response.status).to.equal(400);
  return response.body as Cypress.ChainableResponseBody;
};

const expectUnauthorizedResponse = (response: Cypress.Response) => {
  expect(response.status).to.equal(401);
  return response.body as Cypress.ChainableResponseBody;
};

const expectForbiddenResponse = (response: Cypress.Response) => {
  expect(response.status).to.equal(403);
  return response.body as Cypress.ChainableResponseBody;
};

const expectNotFoundResponse = (response: Cypress.Response) => {
  expect(response.status).to.equal(404);
  return response.body as Cypress.ChainableResponseBody;
};

const expectMessage = (body: any, message: string) => {
  expect(body).to.equal(message);
};

const expectRequiredProperty = (body: any, propertyName: string, requestPart: string) => {
  expect(body[requestPart]).to.contain(propertyName).to.contain('required');
};

const expectWrongPropertyType = (body: any, propertyName: string, propertyType: string, requestPart: string) => {
  expect(body[requestPart]).to.contain(propertyName).to.contain(propertyType);
};

const expectWrongPropertyFormat = (body: any, propertyName: string, propertyFormat: string, requestPart: string) => {
  expect(body[requestPart]).to.contain(propertyName).to.contain('format').to.contain(propertyFormat);
};

const expectTooShortProperty = (body: any, propertyName: string, minLength: number, requestPart: string) => {
  expect(body[requestPart]).to.contain(propertyName).to.contain('shorter').to.contain(minLength);
};

const expectTooLongProperty = (body: any, propertyName: string, maxLength: number, requestPart: string) => {
  expect(body[requestPart]).to.contain(propertyName).to.contain('longer').to.contain(maxLength);
};

const expectTooSmallNumberProperty = (body: any, propertyName: string, minimum: number, requestPart: string) => {
  expect(body[requestPart]).to.contain(propertyName).to.contain('>=').to.contain(minimum);
};

const expectTooLargeNumberProperty = (body: any, propertyName: string, maximum: number, requestPart: string) => {
  expect(body[requestPart]).to.contain(propertyName).to.contain('<=').to.contain(maximum);
};

export const setExpectCommands = () => {
  Cypress.Commands.add('expectOkResponse', { prevSubject: true }, expectOkResponse);
  Cypress.Commands.add('expectBadRequestResponse', { prevSubject: true }, expectBadRequestResponse);
  Cypress.Commands.add('expectUnauthorizedResponse', { prevSubject: true }, expectUnauthorizedResponse);
  Cypress.Commands.add('expectForbiddenResponse', { prevSubject: true }, expectForbiddenResponse);
  Cypress.Commands.add('expectNotFoundResponse', { prevSubject: true }, expectNotFoundResponse);

  Cypress.Commands.add('expectRequiredProperty', { prevSubject: true }, expectRequiredProperty);
  Cypress.Commands.add('expectWrongPropertyType', { prevSubject: true }, expectWrongPropertyType);
  Cypress.Commands.add('expectWrongPropertyFormat', { prevSubject: true }, expectWrongPropertyFormat);
  Cypress.Commands.add('expectTooShortProperty', { prevSubject: true }, expectTooShortProperty);
  Cypress.Commands.add('expectTooLongProperty', { prevSubject: true }, expectTooLongProperty);
  Cypress.Commands.add('expectTooSmallNumberProperty', { prevSubject: true }, expectTooSmallNumberProperty);
  Cypress.Commands.add('expectTooLargeNumberProperty', { prevSubject: true }, expectTooLargeNumberProperty);
  Cypress.Commands.add('expectMessage', { prevSubject: true }, expectMessage);
};

declare global {
  namespace Cypress {
    interface ChainableResponse extends Chainable {
      expectOkResponse: CommandFunctionWithPreviousSubject<typeof expectOkResponse>;
      expectBadRequestResponse: CommandFunctionWithPreviousSubject<typeof expectBadRequestResponse>;
      expectUnauthorizedResponse: CommandFunctionWithPreviousSubject<typeof expectUnauthorizedResponse>;
      expectForbiddenResponse: CommandFunctionWithPreviousSubject<typeof expectForbiddenResponse>;
      expectNotFoundResponse: CommandFunctionWithPreviousSubject<typeof expectNotFoundResponse>;
    }

    interface ChainableResponseBody extends Chainable {
      expectRequiredProperty: CommandFunctionWithPreviousSubject<typeof expectRequiredProperty>;
      expectWrongPropertyType: CommandFunctionWithPreviousSubject<typeof expectWrongPropertyType>;
      expectWrongPropertyFormat: CommandFunctionWithPreviousSubject<typeof expectWrongPropertyFormat>;
      expectTooShortProperty: CommandFunctionWithPreviousSubject<typeof expectTooShortProperty>;
      expectTooLongProperty: CommandFunctionWithPreviousSubject<typeof expectTooLongProperty>;
      expectTooSmallNumberProperty: CommandFunctionWithPreviousSubject<typeof expectTooSmallNumberProperty>;
      expectTooLargeNumberProperty: CommandFunctionWithPreviousSubject<typeof expectTooLargeNumberProperty>;
      expectMessage: CommandFunctionWithPreviousSubject<typeof expectMessage>;
    }
  }
}
