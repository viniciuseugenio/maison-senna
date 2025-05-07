export const REGISTER_FORM_ERRORS = {
  FIRST_LAST_NAME_EQUAL: "First name and last name cannot be the same.",
  BLANK_FIRST_NAME: "First name is required.",
  BLANK_LAST_NAME: "Last name is required.",
  EMAIL_UNIQUE: "This e-mail is already in use.",
  BLANK_EMAIL: "E-mail is required.",
  INVALID_EMAIL: "Please, provide a valid e-mail.",
  BLANK_PASSWORD: "Password is required.",
  SHORT_PASSWORD: "Password must be at least 8 characters long.",
  PASSWORD_MISMATCH: "Please ensure both password fields are equal.",
  BLANK_TERMS: "You must agree to the terms and conditions.",
  FORM_ERROR: "Please, check all the fields of the form.",
  SHORT_FIRST_NAME: "The firs name must contain at least 3 characters.",
  SHORT_LAST_NAME: "The last name must contain at least 3 characters.",
};

export const SUCCESS_NOTIFICATIONS = {
  REGISTER_SUCCESS: {
    title: "Welcome To Maison Senna",
    description:
      "Your account has been created successfully. Please sign in to continue.",
    social_register:
      "Your account has been created successfully. Enjoy our curated collections!",
  },
  LOGIN_SUCCESS: {
    title: "Welcome Back",
    description: "You're now signed in. Glad to have you with us again.",
  },
  LOGOUT_SUCCESS: {
    title: "You've Signed Out",
    description:
      "You’ve been securely signed out. We look forward to welcoming you back.",
  },
};

export const ERROR_NOTIFICATIONS = {
  LOGOUT_ERROR: {
    title: "Sign-Out Incomplete",
    description: "We encountered a momentary issue. Please, try again later.",
  },
  SOCIAL_LOGIN_ERROR: {
    title: "Something Went Wrong",
    description:
      "We encountered a momentary issue with the social login. Please, try again later.",
    access_denied:
      "It appears you've declined the Google login. Should you wish to proceed, you're invited to try again.",
  },
};
