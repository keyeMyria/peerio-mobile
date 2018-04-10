Feature: Favorite contacts

    Scenario: Add new contact
        Given I have signed up
        When  I add a contact from the contacts tab
        Then  they are in my contacts

    Scenario: Favorites show up first in contacts picker
        Given I have signed up
        And   I have added contacts
        And   I favorite someone
        When  I open the contacts picker
        Then  they show up first in the contacts picker
        When  I unfavorite someone
        And   I open the contacts picker
        Then  they are no longer at the top of the contacts picker

    Scenario: Searching for username does not create contact
        Given I have signed up
        When  I open the contacts picker
        And   I search for someone
        But   do not start a chat with them
        Then  they are not in my contact list