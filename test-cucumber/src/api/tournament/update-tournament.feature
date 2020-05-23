Feature: Update a tournament (PUT /tournament/v1/tournaments/{tournamentId})

  Scenario: Updating a tournament requires authentication
    Given I do not authenticate
    And I have a tournament request prepared
    And I set "tournamentId" to a random UUID
    When I update a tournament
    Then It returns unauthorized error

  Scenario: Players are not allowed to update a tournament
    Given I log in as "player1"
    And I have a tournament request prepared
    And I set "tournamentId" to a random UUID
    When I update a tournament
    Then It returns forbidden error

  Scenario: Admins can update a tournament
    Given There is a tournament already created
    And I log in as "admin1"
    And I have a tournament request prepared
    When I update a tournament
    Then It returns ok response
    And Saved tournament is the same that I sent

  Scenario: Any match of updated tournament is also updated

  Scenario: A tournament's name must be set
    Given I log in as "admin1"
    And I have a tournament request prepared
    And I set "tournamentId" to a random UUID
    And I remove "tournamentName" property from "tournament"
    When I update a tournament
    Then It returns bad request error
    And It tells me that "tournamentName" property is missing from "body"

  Scenario: A tournament's name must be a text
    Given I log in as "admin1"
    And I have a tournament request prepared
    And I set "tournamentId" to a random UUID
    And I change "tournamentName" property value to 123 in "tournament"
    When I update a tournament
    Then It returns bad request error
    And It tells me that "tournamentName" property is not "string" type in "body"

  Scenario: A tournament's Id is a UUID
    Given I log in as "admin1"
    And I have a tournament request prepared
    And I set "tournamentId" to a non-UUID value
    When I update a tournament
    Then It returns bad request error
    And It tells me that "tournamentId" property is not "uuid" format in "pathParameters"

  Scenario: Updating non existing tournament results in error
    Given I log in as "admin1"
    And I have a tournament request prepared
    And I set "tournamentId" to a random UUID
    When I update a tournament
    Then It returns not found error