export type ValidateErrorJSON = {
  message: "Validation failed";
  details: { [name: string]: unknown };
};
