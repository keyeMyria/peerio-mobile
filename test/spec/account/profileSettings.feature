Feature: Edit Profile Settings

    Scenario Outline: I change my first name
        When I log in as <new or existing> user
        And I go to public profile settings
        Then I change my first name
    Examples:
    | new or existing |
    | new             |
    | profile_test    |

    Scenario Outline: User changes last name
        When I log in as <new or existing> user
        And I go to public profile settings
        Then I change my last name
    Examples:
    | new or existing |
    | new             |
    | profile_test    |

    Scenario Outline: User uploads a new avatar
        When I log in as <new or existing> user
        And I go to public profile settings
        Then I upload a new avatar
    Examples:
    | new or existing |
    | new             |
    | profile_test    |

    Scenario Outline: User changes existing avatar
        When I log in as <new or existing> user
        And I go to public profile settings
        Then I change my existing avatar
    Examples:
    | new or existing |
    | profile_test    |