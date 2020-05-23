Feature: Delete a tournament by Id (DELETE /tournament/v1/tournaments/{tournamentId})

  Scenario: Deleting a tournament by Id requires authentication
    Given I do not authenticate
    And I set "tournamentId" to a random UUID
    When I delete a tournament
    Then It returns unauthorized error

  Scenario: Players are not allowed to delete a tournament by Id
    Given I log in as "player1"
    And I set "tournamentId" to a random UUID
    When I delete a tournament
    Then It returns forbidden error

  Scenario: Admins can delete a tournament by Id
    Given There is a tournament already created
    And I log in as "admin1"
    When I delete a tournament
    Then It returns ok response

  Scenario: A tournament's Id is a UUID
    Given I log in as "admin1"
    And I set "tournamentId" to a non-UUID value
    When I delete a tournament
    Then It returns bad request error
    And It tells me that "tournamentId" property is not "uuid" format in "pathParameters"

  Scenario: Any match of deleted tournament is also deleted