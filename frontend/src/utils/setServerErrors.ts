import { FieldValues, UseFormSetError } from "react-hook-form";

export const setServerErrors = <T extends FieldValues>(
  setError: UseFormSetError<T>,
  errors: Record<string, string | string[]>,
) => {
  Object.entries(errors).forEach(([key, errorValue]) => {
    if (key !== "variationOptions") {
      const errorMessage =
        errorValue instanceof Array ? errorValue[0] : errorValue;

      setError(key, { message: errorMessage }, { shouldFocus: true });
      return;
    }

    /*
      This seems very complex, but it is necessary because of the way the variationOptions are structured.
      We have the variationOptions array, and inside this array we have objects which are composed by a kind ID, and an array of options.
      For this field, therefore, the back-end returns a dictionary with the key "variationOptions", an index indicator of which variation is,
      and the specifier (whether the error is in the kind or the options)

      Before the first loop, we have this structure: {0: {options: "error-message"}}
      So what we are doing in the first loop is getting the index and the dictionary: {options: "error-message"},
      and in the next loop, we are getting the key ("options") and the message ("error-message")
     */
    Object.entries(errorValue).forEach(([index, fields]) => {
      Object.entries(fields).forEach(
        ([field, messages]: [field: string, messages: string[] | string]) => {
          const message = messages instanceof Array ? messages[0] : messages;

          setError(`variationOptions.${index}.${field}`, {
            message,
          });
        },
      );
    });
  });
};
