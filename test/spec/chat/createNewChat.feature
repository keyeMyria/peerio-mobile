Feature: Create New Chat

    Scenario Outline: User creates a new DM successfully
        When I log in as <new or existing> user
        And I start a new DM with a User
        And I can send a message to the current Chat
    Examples:
    | new or existing |
    | new             |
    | create_dm_test  |

    Scenario Outline: User creates a new Room successfully
        When I log in as <new or existing> user
        And I create a new room
        Then I can send a message to the current Chat
    Examples:
    | new or existing |
    | new             |
    | room_test       |