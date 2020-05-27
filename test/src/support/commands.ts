import { getAs } from '@foci2020/test/api/common-commands';
import { authenticate, unauthenticate } from '@foci2020/test/api/auth/auth-commands';
import {
  requestCreateTeam,
  expectTeamResponse,
  validateTeamDocument,
  requestUpdateTeam,
  requestDeleteTeam,
  requestGetTeam,
  requestGetTeamList,
  saveTeamDocument,
  validateTeamResponse,
  validateTeamDeleted
} from '@foci2020/test/api/team/team-commands';
import {
  expectOkResponse,
  expectBadRequestResponse,
  expectRequiredProperty,
  expectWrongPropertyType,
  expectWrongPropertyFormat,
  expectTooShortProperty,
  expectTooLongProperty,
  expectUnauthorizedResponse,
  expectForbiddenResponse,
  expectNotFoundResponse,
  expectMessage
} from '@foci2020/test/api/expect-commands';
import {
  saveTournamentDocument,
  requestGetTournament,
  requestCreateTournament,
  requestUpdateTournament,
  requestDeleteTournament,
  requestGetTournamentList,
  expectTournamentResponse,
  validateTournamentDocument,
  validateTournamentResponse,
  validateTournamentDeleted
} from '@foci2020/test/api/tournament/tournament-commands';
import {
  requestCreateMatch,
  expectMatchResponse,
  validateMatchDocument,
  requestUpdateMatch,
  requestDeleteMatch,
  requestGetMatch,
  requestGetMatchList,
  saveMatchDocument,
  validateMatchResponse,
  validateMatchDeleted
} from '@foci2020/test/api/match/match-commands';

declare global {
  namespace Cypress {
    interface Chainable {
      getAs<T>(alias: string): Chainable<T>;
      getAs(...aliases: string[]): Chainable<any[]>;
      authenticate: CommandFunction<typeof authenticate>;
      unauthenticate: CommandFunction<typeof unauthenticate>;

      saveTeamDocument: CommandFunction<typeof saveTeamDocument>;
      saveTournamentDocument: CommandFunction<typeof saveTournamentDocument>;
    }

    interface ChainableRequest extends Chainable {
      requestGetTeam: CommandFunctionWithPreviousSubject<typeof requestGetTeam>;
      requestCreateTeam: CommandFunctionWithPreviousSubject<typeof requestCreateTeam>;
      requestUpdateTeam: CommandFunctionWithPreviousSubject<typeof requestUpdateTeam>;
      requestDeleteTeam: CommandFunctionWithPreviousSubject<typeof requestDeleteTeam>;
      requestGetTeamList: CommandFunctionWithPreviousSubject<typeof requestGetTeamList>;

      requestGetTournament: CommandFunctionWithPreviousSubject<typeof requestGetTournament>;
      requestCreateTournament: CommandFunctionWithPreviousSubject<typeof requestCreateTournament>;
      requestUpdateTournament: CommandFunctionWithPreviousSubject<typeof requestUpdateTournament>;
      requestDeleteTournament: CommandFunctionWithPreviousSubject<typeof requestDeleteTournament>;
      requestGetTournamentList: CommandFunctionWithPreviousSubject<typeof requestGetTournamentList>;

      requestGetMatch: CommandFunctionWithPreviousSubject<typeof requestGetMatch>;
      requestCreateMatch: CommandFunctionWithPreviousSubject<typeof requestCreateMatch>;
      requestUpdateMatch: CommandFunctionWithPreviousSubject<typeof requestUpdateMatch>;
      requestDeleteMatch: CommandFunctionWithPreviousSubject<typeof requestDeleteMatch>;
      requestGetMatchList: CommandFunctionWithPreviousSubject<typeof requestGetMatchList>;
    }

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
      expectMessage: CommandFunctionWithPreviousSubject<typeof expectMessage>;

      expectTeamResponse: CommandFunctionWithPreviousSubject<typeof expectTeamResponse>;
      validateTeamDocument: CommandFunctionWithPreviousSubject<typeof validateTeamDocument>;
      validateTeamResponse: CommandFunctionWithPreviousSubject<typeof validateTeamResponse>;
      validateTeamDeleted: CommandFunction<typeof validateTeamDeleted>;

      expectTournamentResponse: CommandFunctionWithPreviousSubject<typeof expectTournamentResponse>;
      validateTournamentDocument: CommandFunctionWithPreviousSubject<typeof validateTournamentDocument>;
      validateTournamentResponse: CommandFunctionWithPreviousSubject<typeof validateTournamentResponse>;
      validateTournamentDeleted: CommandFunction<typeof validateTournamentDeleted>;

      expectMatchResponse: CommandFunctionWithPreviousSubject<typeof expectMatchResponse>;
      validateMatchDocument: CommandFunctionWithPreviousSubject<typeof validateMatchDocument>;
      validateMatchResponse: CommandFunctionWithPreviousSubject<typeof validateMatchResponse>;
      validateMatchDeleted: CommandFunction<typeof validateMatchDeleted>;
    }
  }
}

type CommandReturn<T> = T extends Promise<infer U> ? Cypress.Chainable<U> : T extends Cypress.Chainable<any> ? T : Cypress.Chainable<T>;
type RemoveFirstFromTuple<T extends any[]> = T['length'] extends 0 ? undefined : (((...b: T) => any) extends (a: any, ...b: infer I) => any ? I : []);
type CommandFunctionWithPreviousSubject<T extends (...args: any) => any> = (...args: RemoveFirstFromTuple<Parameters<T>>) => CommandReturn<ReturnType<T>>;
type CommandFunction<T extends (...args: any) => any> = (...args: Parameters<T>) => CommandReturn<ReturnType<T>>;

Cypress.Commands.add('getAs', getAs);
Cypress.Commands.add('authenticate', authenticate);
Cypress.Commands.add('unauthenticate', unauthenticate);

Cypress.Commands.add('requestCreateTeam', { prevSubject: true }, requestCreateTeam);
Cypress.Commands.add('requestUpdateTeam', { prevSubject: true }, requestUpdateTeam);
Cypress.Commands.add('requestDeleteTeam', { prevSubject: true }, requestDeleteTeam);
Cypress.Commands.add('requestGetTeam', { prevSubject: true }, requestGetTeam);
Cypress.Commands.add('requestGetTeamList', { prevSubject: true }, requestGetTeamList);

Cypress.Commands.add('saveTeamDocument', saveTeamDocument);

Cypress.Commands.add('validateTeamDocument', { prevSubject: true }, validateTeamDocument);
Cypress.Commands.add('validateTeamResponse', { prevSubject: true }, validateTeamResponse);
Cypress.Commands.add('validateTeamDeleted', validateTeamDeleted);

Cypress.Commands.add('expectTeamResponse', { prevSubject: true }, expectTeamResponse);

Cypress.Commands.add('requestCreateTournament', { prevSubject: true }, requestCreateTournament);
Cypress.Commands.add('requestUpdateTournament', { prevSubject: true }, requestUpdateTournament);
Cypress.Commands.add('requestDeleteTournament', { prevSubject: true }, requestDeleteTournament);
Cypress.Commands.add('requestGetTournament', { prevSubject: true }, requestGetTournament);
Cypress.Commands.add('requestGetTournamentList', { prevSubject: true }, requestGetTournamentList);

Cypress.Commands.add('saveTournamentDocument', saveTournamentDocument);

Cypress.Commands.add('validateTournamentDocument', { prevSubject: true }, validateTournamentDocument);
Cypress.Commands.add('validateTournamentResponse', { prevSubject: true }, validateTournamentResponse);
Cypress.Commands.add('validateTournamentDeleted', validateTournamentDeleted);

Cypress.Commands.add('expectTournamentResponse', { prevSubject: true }, expectTournamentResponse);

Cypress.Commands.add('requestCreateMatch', { prevSubject: true }, requestCreateMatch);
Cypress.Commands.add('requestUpdateMatch', { prevSubject: true }, requestUpdateMatch);
Cypress.Commands.add('requestDeleteMatch', { prevSubject: true }, requestDeleteMatch);
Cypress.Commands.add('requestGetMatch', { prevSubject: true }, requestGetMatch);
Cypress.Commands.add('requestGetMatchList', { prevSubject: true }, requestGetMatchList);

Cypress.Commands.add('saveMatchDocument', saveMatchDocument);

Cypress.Commands.add('validateMatchDocument', { prevSubject: true }, validateMatchDocument);
Cypress.Commands.add('validateMatchResponse', { prevSubject: true }, validateMatchResponse);
Cypress.Commands.add('validateMatchDeleted', validateMatchDeleted);

Cypress.Commands.add('expectMatchResponse', { prevSubject: true }, expectMatchResponse);

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
Cypress.Commands.add('expectMessage', { prevSubject: true }, expectMessage);
