Feature: Logout

    Background:
        Given I have signed up

    @noCacheReset
    Scenario: User logs out successfully
        When I sign out
        And I close Peerio
        When I open Peerio
        Then I am taken to the Login Start screen