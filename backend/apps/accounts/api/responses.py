from typing import NamedTuple


class Message(NamedTuple):
    detail: str
    description: str


SUCCESS_MESSAGES = {
    "LOGIN": Message(
        detail="Welcome back, {}!",
        description="You're now signed in. Glad to have you with us again.",
    ),
    "LOGOUT": Message(
        detail="You've Signed Out",
        description="You’ve been securely signed out. We look forward to welcoming you back.",
    ),
    "SIGNUP": Message(
        detail="Welcome to Maison Senna",
        description="Your account has been created successfully. Please sign in to continue.",
    ),
    "SIGNUP_SOCIAL": Message(
        detail="Welcome to Maison Senna",
        description="Your account has been created successfully. Enjoy our curated collections!",
    ),
    "PASSWORD_REQUEST_RESET": Message(
        detail="Password Reset Email Sent",
        description="If an account with this email exists, a password reset link  has been sent to the provided address.",
    ),
    "PASSWORD_RESET": Message(
        detail="Password Reset Successful",
        description="Your password has been reset successfully. You can now log in with your new password.",
    ),
}

ERROR_MESSAGES = {
    "INCORRECT_CREDENTIALS": Message(
        detail="Login Failed", description="Invalid email or password."
    ),
    "PASSWORD_RESET_INVALID": Message(
        detail="Invalid Request",
        description="Please provide a valid email address.",
    ),
    "PASSWORD_RESET_CONFIRM": Message(
        detail="Invalid Request",
        description="Please ensure all required fields are correctly filled out.",
    ),
    "PASSWORD_RESET_USER_ID": Message(
        detail="Invalid User Identification",
        description="We could not identify your account. The reset link may be incorrect or outdated.",
    ),
    "PASSWORD_RESET_TOKEN": Message(
        detail="Invalid or Expired Token",
        description="The password reset link is invalid or has expired. Please request a new one.",
    ),
}


def get_success_message(key, *args) -> dict:
    try:
        msg = SUCCESS_MESSAGES[key]
        return {
            "detail": msg.detail.format(*args) if args else msg.detail,
            "description": msg.description,
        }
    except KeyError:
        raise ValueError(f"Missing SUCCESS_MESSAGES entry for key: {key}")


def get_error_message(key: str) -> dict:
    try:
        msg = ERROR_MESSAGES[key]
        return msg._asdict()
    except KeyError:
        raise ValueError(f"Missing ERROR_MESSAGES entry for key: {key}")
