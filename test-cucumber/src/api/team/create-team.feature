Feature: Create a team (POST /team/v1/teams)

  Scenario: Creating a team requires authentication
    Given I do not authenticate
    And I have a team request prepared
    When I create a team
    Then It returns unauthorized error

  Scenario: Players are not allowed to create a team
    Given I log in as "player1"
    And I have a team request prepared
    When I create a team
    Then It returns forbidden error

  Scenario: Admins can create a team
    Given I log in as "admin1"
    And I have a team request prepared
    When I create a team
    Then It returns ok response
    And It returns created team id
    And Saved team is the same that I sent

  Scenario: Admins can create a team without image
    Given I log in as "admin1"
    And I have a team request prepared
    But I remove "image" property from "team"
    When I create a team
    Then It returns ok response
    And It returns created team id
    And Saved team is the same that I sent

  Scenario: A team's name must be set
    Given I log in as "admin1"
    And I have a team request prepared
    And I remove "teamName" property from "team"
    When I create a team
    Then It returns bad request error
    And It tells me that "teamName" property is missing from "body"

  Scenario: A team's name must be a text
    Given I log in as "admin1"
    And I have a team request prepared
    And I change "teamName" property value to 123 in "team"
    When I create a team
    Then It returns bad request error
    And It tells me that "teamName" property is not "string" type in "body"

  Scenario: A team's image must be a text
    Given I log in as "admin1"
    And I have a team request prepared
    And I change "image" property value to 123 in "team"
    When I create a team
    Then It returns bad request error
    And It tells me that "image" property is not "string" type in "body"

  Scenario: A team's image must be a URL
    Given I log in as "admin1"
    And I have a team request prepared
    And I change "image" property value to "not-URL" in "team"
    When I create a team
    Then It returns bad request error
    And It tells me that "image" property is not "uri" format in "body"

  Scenario: A team's short name must be set
    Given I log in as "admin1"
    And I have a team request prepared
    And I remove "shortName" property from "team"
    When I create a team
    Then It returns bad request error
    And It tells me that "shortName" property is missing from "body"

  Scenario: A team's short name must be a text
    Given I log in as "admin1"
    And I have a team request prepared
    And I change "shortName" property value to 123 in "team"
    When I create a team
    Then It returns bad request error
    And It tells me that "shortName" property is not "string" type in "body"

  Scenario: A team's short name cannot be shorter than 3 characters
    Given I log in as "admin1"
    And I have a team request prepared
    And I change "shortName" property value to "HU" in "team"
    When I create a team
    Then It returns bad request error
    And It tells me that "shortName" property is shorter than 3 characters in "body"

  Scenario: A team's short name cannot be longer than 3 characters
    Given I log in as "admin1"
    And I have a team request prepared
    And I change "shortName" property value to "HUNG" in "team"
    When I create a team
    Then It returns bad request error
    And It tells me that "shortName" property is longer than 3 characters in "body"