Feature: Get a tournament by Id (GET /tournament/v1/tournaments/{tournamentId})

  Scenario: Getting a tournament by Id requires authentication
    Given I do not authenticate
    And I set "tournamentId" to a random UUID
    When I request a tournament by tournamentId
    Then It returns unauthorized error

  Scenario: Players are not allowed to retrieve a tournament by Id
    Given I log in as "player1"
    And I set "tournamentId" to a random UUID
    When I request a tournament by tournamentId
    Then It returns forbidden error

  Scenario: Admins can retrieve a tournament by Id
    Given There is a tournament already created
    And I log in as "admin1"
    When I request a tournament by tournamentId
    Then It returns ok response
    And It returns a valid tournament

  Scenario: A tournament's Id is a UUID
    Given I log in as "admin1"
    And I set "tournamentId" to a non-UUID value
    When I request a tournament by tournamentId
    Then It returns bad request error
    And It tells me about "tournamentId" property is not "uuid" format in "pathParameters"

  Scenario: Requesting non existing tournament results in error
    Given I log in as "admin1"
    And I set "tournamentId" to a random UUID
    When I request a tournament by tournamentId
    Then It returns not found error
