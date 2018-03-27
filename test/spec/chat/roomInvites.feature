@noCacheReset
Feature: Room invites

   As a user, I can invite other users to rooms.
   If I get invited to a room, I can:
   - accept the invite and join the room
   - decline the invite

   Scenario: Accept a room invite
        Given I log in as room_test user
        And   I create a new room
        When  I invite someone to join the room
        And   I sign out
        Then  they log in
        And   they accept the room invite
   
   Scenario: Decline a room invite
        Given I log in as room_test user
        And   I create a new room
        When  I invite someone to join the room
        And   I sign out
        Then  they log in
        And   they decline the room invite

   Scenario: Invite someone to join a room but cancel
        Given I log in as room_test user
        And   I create a new room
        When  I invite someone to join the room
        And   I cancel the invite
        And   I sign out
        Then  they log in
        And   they do not have any room invites

   Scenario: Invite someone to rejoin a room after leaving
        Given I log in as room_test user
        And   I create a new room
        When  I invite someone to join the room
        And   I sign out
        Then  they log in
        And   they accept the room invite
        And   they leave the room
        And   they sign out
        And   I log in as room_test user
        And   I invite someone to join the room
        And   I sign out
        Then  they log in
        And   they accept the room invite
   