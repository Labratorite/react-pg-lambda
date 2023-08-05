import React from "react";
import {
  useFormContext,
  Controller,
  FieldPath,
  SubmitHandler,
  UseControllerProps,
} from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import Button, { ButtonProps } from "@mui/material/Button";
import TargetableButton from "./TargetableButton";

import { useLogger } from "src/utils/logger";
import {
  Box,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  DialogTitle,
  Typography,
} from "@mui/material";
import TextField, { TextFieldProps } from "@mui/material/TextField";
import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import { styled } from "@mui/material/styles";
// import InvalidMessage from "../utils/InvalidMessage";

const ErrorTypography = styled(Typography)(({ theme }) => ({
  color: theme.palette.error.main,
}));

type PostTextFieldProps = TextFieldProps & {
  name: keyof Post; //HookForm["_inputPost"];
  rules?: UseControllerProps["rules"];
};

/**
 * TextField
 */
const PostText: React.FC<PostTextFieldProps> = (props) => {
  const { children, name, rules, ...rest } = props;
  const { control } = useFormContext<HookForm>();
  const formName: FieldPath<HookForm> = `_inputPost.${name}`;

  return (
    <Controller
      control={control}
      name={`_inputPost.${name}`}
      rules={rules}
      render={({ field, fieldState, formState: { errors } }) => {
        return (
          <>
            <TextField required size="small" fullWidth {...rest} {...field}>
              {children}
            </TextField>
            <ErrorMessage
              errors={errors}
              name={`_inputPost.${name}`}
              render={({ message }) => {
                return (
                  <ErrorTypography variant="caption">{message}</ErrorTypography>
                );
              }}
            />
          </>
        );
      }}
    />
  );
};

export const PostEditor: React.FC = () => {
  const logger = useLogger();
  logger.write({ component: "PostEditor", message: "RENDER" });

  const { control } = useFormContext<HookForm>();
  return (
    <Container maxWidth="md">
      <Grid container spacing={2} mt={1}>
        <Grid xs={12} sm={6} md={8}>
          <PostText
            required
            rules={{
              required: "This is required.",
              maxLength: { value: 20, message: "20桁まで" },
            }}
            label="title"
            name="title"
          />
        </Grid>
        <Grid xs={12} sm={6} md={4}>
          <PostText
            required
            rules={{
              required: "This is required.",
              maxLength: { value: 20, message: "20桁まで" },
            }}
            label="name"
            name="author"
          />
        </Grid>
        <Grid xs={12}>
          <PostText
            required
            rules={{
              required: "This is required.",
              maxLength: { value: 30, message: "30桁まで" },
            }}
            label="content"
            name="content"
            multiline
            maxRows={3}
          />
        </Grid>
      </Grid>
    </Container>
  );
};

export type PostEditorDialogAction = {
  onClose?: React.Dispatch<void>;
  onSubmit?: (values: HookForm) => SubmitHandler<HookForm>;
};

export const PostEditorDialog: React.FC<
  Omit<DialogProps, "onClose" | "onSubmit" | "onClick"> & PostEditorDialogAction
> = ({ children, onClose, onSubmit, ...rest }) => {
  const logger = useLogger();
  logger.write({ component: "PostEditorDialog", hook: "RENDER" });

  const { handleSubmit, trigger } = useFormContext<HookForm>();
  // const lambdaRequest = useLambdaRequest();

  const onCancel = () => {
    logger.write({ component: "PostEditorDialog", hook: "onCancel" });
    onClose && onClose();
  };

  const onOk = async () => {
    const valid = await trigger();
    if (!valid) {
      logger.write({ component: "PostEditorDialog", hook: "validation" });
      return;
    }
    if (!onSubmit) return;

    logger.write({ component: "PostEditorDialog", hook: "onOk" });
    handleSubmit(onSubmit, (errors) => {
      logger.write({
        component: "PostEditorDialog",
        hook: "error",
        context: errors,
      });
    })();
    onClose && onClose();
  };

  return (
    <Dialog {...rest} onClose={onCancel}>
      <DialogTitle>Post</DialogTitle>
      <DialogContent>
        <PostEditor />
      </DialogContent>
      <DialogActions>
        <Button size="small" onClick={onOk}>
          OK
        </Button>
        <Button size="small" onClick={onCancel}>
          cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export const usePostEditorDialog = (params: PostEditorDialogAction) => {
  const { onClose, onSubmit, ...rest } = params;
  const [open, setOpen] = React.useState(false);
  const handleClose = React.useCallback(() => {
    onClose && onClose();
    setOpen(false);
  }, [onClose]);

  return React.useMemo(() => {
    const element = (
      <PostEditorDialog
        open={open}
        onSubmit={onSubmit}
        onClose={handleClose}
        {...rest}
      />
    );
    return {
      setOpen,
      element,
    };
  }, [rest, open, handleClose, onSubmit]);
};

type OpenEditorDialogButtonProps = {
  prepareOpen?: () => void;
  component?: React.ElementType;
} & PostEditorDialogAction;

const OpenEditorDialogButton: FCC<OpenEditorDialogButtonProps> = (params) => {
  const { children, prepareOpen, component, ...rest } = params;
  const ButtonElement = component || Button;

  const { setOpen, element } = usePostEditorDialog(rest);
  const handleClick = () => {
    prepareOpen && prepareOpen();
    setOpen(true);
  };

  return (
    <>
      <ButtonElement size="small" variant="outlined" onClick={handleClick}>
        {children}
      </ButtonElement>
      {element}
    </>
  );
};

export default OpenEditorDialogButton;
