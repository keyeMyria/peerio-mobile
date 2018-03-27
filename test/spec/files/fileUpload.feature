Feature: File Upload

    Scenario Outline: User uploads a file to Files succesfully
        When I log in as <new or existing> user
        Then I upload a file from gallery to Files
        And I can download the file from Files
    Examples:
        | new or existing |
        | new             |
        | upload_to_files |

    Scenario Outline: User uploads a file to a Room succesfully
        When I log in as <new or existing> user
        Then I create a new room
        And I upload a file from gallery to the current Chat
        When I exit the current Chat
        Then I can download the file from Files
    Examples:
        | new or existing |
        | new             |
        | upload_to_chat  |