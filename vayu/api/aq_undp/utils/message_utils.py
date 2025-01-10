messages = {
    114: "Unable to process the request at this time, please try again later.",
    200: "Ok",
    201: "Created.",
    202: "Accepted",
    204: "No Content",
    227: "No such user exists.",
    228: "Password has been sent to your mail.",
    229: "Password changed successfully.",
    400: "Bad request",
    401: "Unauthorized token",
    403: "Forbidden.",
    404: "Not Found.",
    452: "Invalid username or password.",
    453: "Incorrect password.",
    454: "New and old password should be different.",
    455: "Record created successfully.",
    456: "Task Updated successfully.",
    457: "Date and time range must not exceed 24 hours.",
    458: "Capatcha is not verified.",
    459: "recaptcha is required.",
    500: "Internal Server Error.",
}


def get_message(code):
    message = messages[code]
    return message
