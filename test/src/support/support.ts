import { usernames } from '../api/constants';

Cypress.Cookies.defaults({
  whitelist: Object.keys(usernames)
});
