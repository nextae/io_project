type Result<T> =
  | { isError: true; error: string; data?: never }
  | { isError: false; error?: never; data: T };

type OperationResult<Data> = {
  data?: Data;
  error?: {
    message: string;
  };
};

export function propagateError<Data, Valid extends object>(
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

  return { isError: true, error: "Unknown error" };
}
