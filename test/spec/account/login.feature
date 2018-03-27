Feature: Login

    Scenario: User signs up successfully
        When I choose the create account option
        And  I input my personal info
        Then I am presented with my passcode
        And  I confirm that I saved my passcode
        Then I am taken to the home tab

    @noCacheReset
    Scenario: Autologin
        Given I have signed up
        And   I close Peerio
        When  I open Peerio
        Then  I am taken to the home tab