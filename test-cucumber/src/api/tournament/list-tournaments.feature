Feature: List tournaments (GET /tournament/v1/tournaments)

  Scenario: Listing tournament requires authentication
    Given I do not authenticate
    When I list tournaments
    Then It returns unauthorized error

  Scenario: Players are not allowed to list tournaments
    Given I log in as "player1"
    When I list tournaments
    Then It returns forbidden error

  Scenario: Admins can retrieve a tournament list
    Given I log in as "admin1"
    When I list tournaments
    Then It returns ok response
    And It returns a valid list of tournaments

