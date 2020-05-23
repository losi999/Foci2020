Feature: Delete a team by Id (DELETE /team/v1/teams/{teamId})

  Scenario: Deleting a team by Id requires authentication
    Given I do not authenticate
    And I set "teamId" to a random UUID
    When I delete a team
    Then It returns unauthorized error

  Scenario: Players are not allowed to delete a team by Id
    Given I log in as "player1"
    And I set "teamId" to a random UUID
    When I delete a team
    Then It returns forbidden error

  Scenario: Admins can delete a team by Id
    Given There is a team already created
    And I log in as "admin1"
    When I delete a team
    Then It returns ok response

  Scenario: A team's Id is a UUID
    Given I log in as "admin1"
    And I set "teamId" to a non-UUID value
    When I delete a team
    Then It returns bad request error
    And It tells me that "teamId" property is not "uuid" format in "pathParameters"

  Scenario: Any home match of deleted team is also deleted

  Scenario: Any away match of deleted team is also deleted