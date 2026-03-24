@smoke @regression
Feature: Homepage inventory
  As a QA engineer
  I want to validate the homepage inventory of examples
  So that broken or missing routes are caught early

  Scenario: Homepage shows all expected links
    Given I am on the homepage
    Then all homepage links from fixture should be visible
    And homepage links should exactly match the fixture list
