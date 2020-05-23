Feature: Update a team (PUT /team/v1/teams/{teamId})

  Scenario: Updating a team requires authentication
    Given I do not authenticate
    And I have a team request prepared
    And I set "teamId" to a random UUID
    When I update a team
    Then It returns unauthorized error

  Scenario: Players are not allowed to update a team
    Given I log in as "player1"
    And I have a team request prepared
    And I set "teamId" to a random UUID
    When I update a team
    Then It returns forbidden error

  Scenario: Admins can update a team
    Given There is a team already created
    And I log in as "admin1"
    And I have a team request prepared
    When I update a team
    Then It returns ok response
    And Saved team is the same that I sent

  Scenario: Admins can update a team without image
    Given There is a team already created
    And I log in as "admin1"
    And I have a team request prepared
    But I remove "image" property from "team"
    When I update a team
    Then It returns ok response
    And Saved team is the same that I sent

  Scenario: Any home match of updated team is also updated

  Scenario: Any away match of updated team is also updated

  Scenario: A team's name must be set
    Given I log in as "admin1"
    And I have a team request prepared
    And I set "teamId" to a random UUID
    And I remove "teamName" property from "team"
    When I update a team
    Then It returns bad request error
    And It tells me that "teamName" property is missing from "body"

  Scenario: A team's name must be a text
    Given I log in as "admin1"
    And I have a team request prepared
    And I set "teamId" to a random UUID
    And I change "teamName" property value to 123 in "team"
    When I update a team
    Then It returns bad request error
    And It tells me that "teamName" property is not "string" type in "body"

  Scenario: A team's image must be a text
    Given I log in as "admin1"
    And I have a team request prepared
    And I set "teamId" to a random UUID
    And I change "image" property value to 123 in "team"
    When I update a team
    Then It returns bad request error
    And It tells me that "image" property is not "string" type in "body"

  Scenario: A team's image must be a URL
    Given I log in as "admin1"
    And I have a team request prepared
    And I set "teamId" to a random UUID
    And I change "image" property value to "not-URL" in "team"
    When I update a team
    Then It returns bad request error
    And It tells me that "image" property is not "uri" format in "body"

  Scenario: A team's short name must be set
    Given I log in as "admin1"
    And I have a team request prepared
    And I set "teamId" to a random UUID
    And I remove "shortName" property from "team"
    When I update a team
    Then It returns bad request error
    And It tells me that "shortName" property is missing from "body"

  Scenario: A team's short name must be a text
    Given I log in as "admin1"
    And I have a team request prepared
    And I set "teamId" to a random UUID
    And I change "shortName" property value to 123 in "team"
    When I update a team
    Then It returns bad request error
    And It tells me that "shortName" property is not "string" type in "body"

  Scenario: A team's short name cannot be shorter than 3 characters
    Given I log in as "admin1"
    And I have a team request prepared
    And I set "teamId" to a random UUID
    And I change "shortName" property value to "HU" in "team"
    When I update a team
    Then It returns bad request error
    And It tells me that "shortName" property is shorter than 3 characters in "body"

  Scenario: A team's short name cannot be longer than 3 characters
    Given I log in as "admin1"
    And I have a team request prepared
    And I set "teamId" to a random UUID
    And I change "shortName" property value to "HUNG" in "team"
    When I update a team
    Then It returns bad request error
    And It tells me that "shortName" property is longer than 3 characters in "body"

  Scenario: A team's Id is a UUID
    Given I log in as "admin1"
    And I have a team request prepared
    And I set "teamId" to a non-UUID value
    When I update a team
    Then It returns bad request error
    And It tells me that "teamId" property is not "uuid" format in "pathParameters"

  Scenario: Updating non existing team results in error
    Given I log in as "admin1"
    And I have a team request prepared
    And I set "teamId" to a random UUID
    When I update a team
    Then It returns not found error