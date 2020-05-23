Feature: List teams (GET /team/v1/teams)

  Scenario: Listing team requires authentication
    Given I do not authenticate
    When I list teams
    Then It returns unauthorized error

  Scenario: Players are not allowed to list teams
    Given I log in as "player1"
    When I list teams
    Then It returns forbidden error

  Scenario: Admins can retrieve a team list
    Given I log in as "admin1"
    When I list teams
    Then It returns ok response
    And It returns a valid list of teams

