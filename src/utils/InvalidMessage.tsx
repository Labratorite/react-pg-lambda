import React from "react";
import {
  Control,
  FieldErrors,
  FieldValues,
  FieldPath,
  useFormContext,
  useFormState,
  UseFormReturn,
} from "react-hook-form";
import { Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { ErrorMessage } from "@hookform/error-message";
import { useLogger } from "./logger";

const ErrorTypography = styled(Typography)(({ theme }) => ({
  color: theme.palette.error.main,
}));

/*
type Cast<T, P> = T extends P ? T : P;

type X<T> = G<F<T> extends infer A ? A : never>;
type X<T> = G<F<T> extends infer A ? Cast<A, any[]> : never>;
*/

export type InvalidMessageProps2<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TError extends FieldErrors<TFieldValues> = FieldErrors<TFieldValues>
> = {
  name: TName;
  //  control: Control<TFieldValues>;
  errors: TError;
};

export type InvalidMessageProps = {
  name: FieldPath<HookForm>;
};

const InvalidMessage: React.FC<InvalidMessageProps> = ({ name }) => {
  const { control } = useFormContext<HookForm>();
  const { errors } = useFormState<HookForm>({ control });
  const logger = useLogger();
  if (Object.keys(errors).length > 0) {
    logger.write({
      component: `InvalidMessage${name}`,
      message: "render",
      context: errors,
    });
  }
  return (
    <ErrorMessage
      errors={errors}
      name={name}
      render={({ message }) => (
        <ErrorTypography variant="caption">{message}</ErrorTypography>
      )}
    />
  );
};

export default InvalidMessage;
