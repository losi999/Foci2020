Feature: Create a tournament (POST /tournament/v1/tournaments)

  Scenario: Creating a tournament requires authentication
    Given I do not authenticate
    And I have a tournament request prepared
    When I create a tournament
    Then It returns unauthorized error

  Scenario: Players are not allowed to create a tournament
    Given I log in as "player1"
    And I have a tournament request prepared
    When I create a tournament
    Then It returns forbidden error

  Scenario: Admins can create a tournament
    Given I log in as "admin1"
    And I have a tournament request prepared
    When I create a tournament
    Then It returns ok response
    And It returns created tournament id
    And Saved tournament is the same that I sent

  Scenario: A tournament's name must be set
    Given I log in as "admin1"
    And I have a tournament request prepared
    And I remove "tournamentName" property from "tournament"
    When I create a tournament
    Then It returns bad request error
    And It tells me that "tournamentName" property is missing from "body"

  Scenario: A tournament's name must be a text
    Given I log in as "admin1"
    And I have a tournament request prepared
    And I change "tournamentName" property value to 123 in "tournament"
    When I create a tournament
    Then It returns bad request error
    And It tells me that "tournamentName" property is not "string" type in "body"