import React from "react";
import { FieldValues, useFormState, UseFormReturn } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";

export type InvalidMessageProps<T extends FieldValues = FieldValues> = {
  name: keyof T;
  control: UseFormReturn<T>["control"];
};

const InvalidMessage: React.FC<InvalidMessageProps> = ({ name, control }) => {
  const { errors } = useFormState({ control });
  return <ErrorMessage errors={errors} name={name} />;
};

export default InvalidMessage;
