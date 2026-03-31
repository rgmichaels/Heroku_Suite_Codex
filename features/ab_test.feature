@smoke @regression
Feature: A/B Testing page
  As a QA engineer
  I want to validate the A/B Testing example page
  So that the route and its core content remain available

  Scenario: Open the A/B Testing page from the homepage
    Given I am on the homepage
    When I open the A/B Testing page from the homepage
    Then the A/B Testing page should be displayed
