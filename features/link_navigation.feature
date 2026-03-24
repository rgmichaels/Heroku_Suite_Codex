@regression
Feature: Homepage link navigation
  As an SDET
  I want each homepage link to navigate to its destination page
  So that every listed feature remains reachable

  Scenario Outline: Homepage link opens its target page and feature
    Given I am on the homepage
    When I open the "<name>" link from the homepage
    Then I should land on the "<path>" page path
    And the "<name>" page feature should be exercisable

    Examples:
      | name                            | path                  |
      | A/B Testing                     | /abtest               |
      | Add/Remove Elements             | /add_remove_elements/ |
      | Basic Auth                      | /basic_auth           |
      | Broken Images                   | /broken_images        |
      | Challenging DOM                 | /challenging_dom      |
      | Checkboxes                      | /checkboxes           |
      | Context Menu                    | /context_menu         |
      | Digest Authentication           | /digest_auth          |
      | Disappearing Elements           | /disappearing_elements |
      | Drag and Drop                   | /drag_and_drop        |
      | Dropdown                        | /dropdown             |
      | Dynamic Content                 | /dynamic_content      |
      | Dynamic Controls                | /dynamic_controls     |
      | Dynamic Loading                 | /dynamic_loading      |
      | Entry Ad                        | /entry_ad             |
      | Exit Intent                     | /exit_intent          |
      | File Download                   | /download             |
      | File Upload                     | /upload               |
      | Floating Menu                   | /floating_menu        |
      | Forgot Password                 | /forgot_password      |
      | Form Authentication             | /login                |
      | Frames                          | /frames               |
      | Geolocation                     | /geolocation          |
      | Horizontal Slider               | /horizontal_slider    |
      | Hovers                          | /hovers               |
      | Infinite Scroll                 | /infinite_scroll      |
      | Inputs                          | /inputs               |
      | JQuery UI Menus                 | /jqueryui/menu        |
      | JavaScript Alerts               | /javascript_alerts    |
      | JavaScript onload event error   | /javascript_error     |
      | Key Presses                     | /key_presses          |
      | Large & Deep DOM                | /large                |
      | Multiple Windows                | /windows              |
      | Nested Frames                   | /nested_frames        |
      | Notification Messages           | /notification_message_rendered |
      | Redirect Link                   | /redirector           |
      | Secure File Download            | /download_secure      |
      | Shadow DOM                      | /shadowdom            |
      | Shifting Content                | /shifting_content     |
      | Slow Resources                  | /slow                 |
      | Sortable Data Tables            | /tables               |
      | Status Codes                    | /status_codes         |
      | Typos                           | /typos                |
      | WYSIWYG Editor                  | /tinymce              |
