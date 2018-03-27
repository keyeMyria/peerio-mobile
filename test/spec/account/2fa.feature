@noCacheReset
Feature: 2 Factor Authentication

    Background:
        Given I have signed up

    Scenario: Enable 2FA for the first time
        Given I enable 2FA
        And   I enter the correct token
        Then  I close Peerio
        And   I open Peerio
        Then  I am prompted to enter a 2FA token
        And   I am taken to the home tab

    Scenario: Enable 2FA on trusted device
        Given I enable 2FA on a trusted device
        And   I sign out
        When  I open Peerio
        And   I sign in
        Then  I am taken to the home tab

    Scenario: Enable 2FA on untrusted device
        Given I enable 2FA on an untrusted device
        And   I sign out
        When  I open Peerio
        And   I sign in
        Then  I am prompted to enter a 2FA token
        And   I am taken to the home tab