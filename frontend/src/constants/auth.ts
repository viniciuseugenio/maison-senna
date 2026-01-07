export const registerFormErrors = {
  firstLastNameEqual: "First name and last name cannot be the same",
  blankFirstName: "First name is required",
  blankLastName: "Last name is required",
  emailUnique: "This e-mail is already in use",
  blankEmail: "E-mail is required",
  invalidEmail: "Please, provide a valid e-mail",
  blankPassword: "Password is required",
  shortPassword: "Password must be at least 8 characters long",
  passwordMismatch: "Please ensure both password fields are equal",
  blankTerms: "You must agree to the terms and conditions",
  formError: "Please, check all the fields of the form",
  shortFirstName: "The firs name must contain at least 3 characters",
  shortLastName: "The last name must contain at least 3 characters",
};

export const errorNotifications = {
  logoutError: {
    title: "Sign-Out Incomplete",
    description: "We encountered a momentary issue. Please, try again later",
  },
  socialLoginError: {
    title: "Something Went Wrong",
    description:
      "We encountered a momentary issue with the social login. Please, try again later",
    access_denied:
      "It appears you've declined the Google login. Should you wish to proceed, you're invited to try again",
  },
  resetPasswordTokens: {
    title: "Something Went Wrong",
    description:
      "The token or the UID is missing from the URL. Please, request another password reset link",
  },
  resetPasswordValidation: {
    title: "Something is Wrong",
    description: "Please, check all requirements and submit again",
  },
};

export const ACCESS_TOKEN_LIFETIME = 15 * 60 * 1000;
