import { useEffect } from "react";

export type Result<T> =
  | { isError: true; error: string; data?: never }
  | { isError: false; error?: never; data: T };

export type OperationResult<Data> = {
  data?: Data;
  error?: {
    message: string;
  };
};

/**
 * Validates the result of a GraphQL operation.
 * If the operation was successful, the validator function is called to validate the data.
 * Otherwise, the error is returned.
 *
 * @param result GraphQL operation result
 * @param validator returns a string if the data is invalid, otherwise returns the valid data
 */
export function validateResult<Data, Valid extends object>(
  result: OperationResult<Data>,
  validator: (result: Data) => string | Valid
): Result<Valid> {
  if (result.error) {
    console.debug("%o", { error: result.error });
    return { isError: true, error: "Server error: " + result.error.message };
  }

  if (result.data) {
    const validationResult = validator(result.data);
    if (typeof validationResult === "string")
      return { isError: true, error: validationResult };
    return { isError: false, data: validationResult };
  }

  console.debug("unknown error: %o", result);
  return { isError: true, error: "Unknown error" };
}

/**
 * Sets the document title.
 */
export function useDocumentTitle(title: string) {
  useEffect(() => {
    document.title = title;
  }, [title]);
}
