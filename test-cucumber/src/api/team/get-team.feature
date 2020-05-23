Feature: Get a team by Id (GET /team/v1/teams/{teamId})

  Scenario: Getting a team by Id requires authentication
    Given I do not authenticate
    And I set "teamId" to a random UUID
    When I request a team by teamId
    Then It returns unauthorized error

  Scenario: Players are not allowed to retrieve a team by Id
    Given I log in as "player1"
    And I set "teamId" to a random UUID
    When I request a team by teamId
    Then It returns forbidden error

  Scenario: Admins can retrieve a team by Id
    Given There is a team already created
    And I log in as "admin1"
    When I request a team by teamId
    Then It returns ok response
    And It returns a valid team

  Scenario: A team's Id is a UUID
    Given I log in as "admin1"
    And I set "teamId" to a non-UUID value
    When I request a team by teamId
    Then It returns bad request error
    And It tells me that "teamId" property is not "uuid" format in "pathParameters"

  Scenario: Requesting non existing team results in error
    Given I log in as "admin1"
    And I set "teamId" to a random UUID
    When I request a team by teamId
    Then It returns not found error
