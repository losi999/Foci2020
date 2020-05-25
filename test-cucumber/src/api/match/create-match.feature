Feature: Create a match (POST /match/v1/matches)

  Background:
    Given Id set

  # Scenario: Creating a match requires authentication
  #   Given I do not authenticate
  #   And I have a match request prepared
  #   When I create a match
  #   Then It returns unauthorized error

  Scenario: Players are not allowed to create a match
    Given I log in as "player1"
    And I have a match request prepared
    When I create a match
    Then It returns forbidden error

Scenario: Admins can create a match
  Given There is a team already created as "homeTeam"
  And There is a team already created as "awayTeam"
  And There is a tournament already created
  And I log in as "admin1"
  And I have a match request prepared
  When I create a match
  Then It returns ok response
  And It returns created match id
  And Saved match is the same that I sent

# Scenario: A match's home team must be set
#   Given I log in as "admin1"
#   And I have a match request prepared
#   And I remove "homeTeamId" property from "match"
#   When I create a match
#   Then It returns bad request error
#   And It tells me that "homeTeamId" property is missing from "body"

# Scenario: A match's home team Id must be a text
#   Given I log in as "admin1"
#   And I have a match request prepared
#   And I change "homeTeamId" property value to 123 in "match"
#   When I create a match
#   Then It returns bad request error
#   And It tells me that "homeTeamId" property is not "string" type in "body"

# Scenario: A match's home team Id must be a UUID
#   Given I log in as "admin1"
#   And I have a match request prepared
#   And I change "homeTeamId" property value to "not-uuid" in "match"
#   When I create a match
#   Then It returns bad request error
#   And It tells me that "homeTeamId" property is not "uuid" format in "body"

# Scenario: A match's home team Id must yield a team
#   Given I log in as "admin1"
#   And I have a match request prepared
#   When I create a match
#   Then It returns bad request error
#   And It tells me that "Home team not found"

# Scenario: A match's away team must be set
#   Given I log in as "admin1"
#   And I have a match request prepared
#   And I remove "awayTeamId" property from "match"
#   When I create a match
#   Then It returns bad request error
#   And It tells me that "awayTeamId" property is missing from "body"

# Scenario: A match's away team Id must be a text
#   Given I log in as "admin1"
#   And I have a match request prepared
#   And I change "awayTeamId" property value to 123 in "match"
#   When I create a match
#   Then It returns bad request error
#   And It tells me that "awayTeamId" property is not "string" type in "body"

# Scenario: A match's away team Id must be a UUID
#   Given I log in as "admin1"
#   And I have a match request prepared
#   And I change "awayTeamId" property value to "not-uuid" in "match"
#   When I create a match
#   Then It returns bad request error
#   And It tells me that "awayTeamId" property is not "uuid" format in "body"

# Scenario: A match's away team Id must yield a team
#   Given I log in as "admin1"
#   And I have a match request prepared
#   When I create a match
#   Then It returns bad request error
#   And It tells me that "Away team not found"

# Scenario: A match's home and away teams must be different
#   Given I log in as "admin1"
#   And I have a match request prepared
#   And I change "matchName" property value to 123 in "match"
#   When I create a match
#   Then It returns bad request error
#   And It tells me that "matchName" property is not "string" type in "body"

# Scenario: A match's tournament must be set
#   Given I log in as "admin1"
#   And I have a match request prepared
#   And I remove "tournamentId" property from "match"
#   When I create a match
#   Then It returns bad request error
#   And It tells me that "tournamentId" property is missing from "body"

# Scenario: A match's tournament Id must be a text
#   Given I log in as "admin1"
#   And I have a match request prepared
#   And I change "tournamentId" property value to 123 in "match"
#   When I create a match
#   Then It returns bad request error
#   And It tells me that "tournamentId" property is not "string" type in "body"

# Scenario: A match's tournament Id must be a UUID
#   Given I log in as "admin1"
#   And I have a match request prepared
#   And I change "tournamentId" property value to "not-uuid" in "match"
#   When I create a match
#   Then It returns bad request error
#   And It tells me that "tournamentId" property is not "uuid" format in "body"

# Scenario: A match's tournament Id must yield a team
#   Given I log in as "admin1"
#   And I have a match request prepared
#   When I create a match
#   Then It returns bad request error
#   And It tells me that "Tournament not found"

# Scenario: A match's group must be set
#   Given I log in as "admin1"
#   And I have a match request prepared
#   And I remove "group" property from "match"
#   When I create a match
#   Then It returns bad request error
#   And It tells me that "group" property is missing from "body"

# Scenario: A match's group must be a text
#   Given I log in as "admin1"
#   And I have a match request prepared
#   And I change "group" property value to 123 in "match"
#   When I create a match
#   Then It returns bad request error
#   And It tells me that "group" property is not "string" type in "body"

# Scenario: A match's start time must be set
#   Given I log in as "admin1"
#   And I have a match request prepared
#   And I remove "startTime" property from "match"
#   When I create a match
#   Then It returns bad request error
#   And It tells me that "startTime" property is missing from "body"

# Scenario: A match's start time must be a text
#   Given I log in as "admin1"
#   And I have a match request prepared
#   And I change "startTime" property value to 123 in "match"
#   When I create a match
#   Then It returns bad request error
#   And It tells me that "startTime" property is not "string" type in "body"

# Scenario: A match's start time must be in date and time format
#   Given I log in as "admin1"
#   And I have a match request prepared
#   And I change "startTime" property value to "not-date-time" in "match"
#   When I create a match
#   Then It returns bad request error
#   And It tells me that "startTime" property is not "date-time" format in "body"

# Scenario: A match's start time must be at least 5 minutes from now
#   Given I log in as "admin1"
#   And I have a match request prepared
#   And I change "startTime" property value to a date in the past in "match"
#   When I create a match
#   Then It returns bad request error
#   And It tells me that "Start time has to be at least 5 minutes from now"
