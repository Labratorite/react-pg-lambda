import React from "react";
import { useNavigate } from "react-router-dom";
import { DateTime } from "luxon";
import {
  useFormContext,
  Controller,
  UseControllerProps
} from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import styled from "@emotion/styled";
import Button from "@mui/material/Button";

import { useLogger } from "src/utils/logger";
import useLambdaRequest from "src/utils/LambdaRequest";
import {
  Box,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  DialogTitle
} from "@mui/material";
import TextField, { TextFieldProps } from "@mui/material/TextField";
import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import InvalidMessage from "../utils/InvalidMessage";

const generatePost = (id: string): Post => {
  return {
    id: DateTime.local().toMillis().toString(),
    _type: "post",
    parent_id: "post",
    title: "title_" + id,
    author: "nanashi",
    content: "honn"
  };
};

const PostText = (
  props: TextFieldProps & {
    name: keyof Post;
    rules?: UseControllerProps["rules"];
  }
): JSX.Element | null => {
  const { children, name, rules, ...rest } = props;
  const { control } = useFormContext<HookForm>();

  const logger = useLogger();
  logger.write({ component: `PostText${name}`, message: "RENDER" });
  return (
    <Controller
      control={control}
      name={`_inputPost.${name}`}
      rules={rules}
      render={({ field, fieldState, formState: { errors } }) => (
        <>
          <TextField required size="small" fullWidth {...rest} {...field}>
            {children}
          </TextField>
          <ErrorMessage errors={errors} name={name} />
        </>
      )}
    />
  );
};

const PostEditor: React.FC = () => {
  const logger = useLogger();
  console.log("PostEditor");
  logger.write({ component: "PostEditor", message: "RENDER" });

  const { control } = useFormContext<HookForm>();
  const lambdaRequest = useLambdaRequest();

  const onPutPostClick = async () => {
    logger.write({ component: "PostCrudCommponent", hook: "onPutPostClick" });
    const post = await lambdaRequest<Post>({
      method: "PUT",
      //url: url + "/items",
      data: generatePost("test4")
    });
    if (!post) return;

    //setPosts((state) => [...state, post]);
  };

  return (
    <Container maxWidth="md">
      <Grid container spacing={2} mt={1}>
        <Grid xs={12} sm={6} md={8}>
          <PostText
            required
            rules={{ required: true }}
            label="title"
            name="title"
          />
        </Grid>
        <Grid xs={12} sm={6} md={4}>
          <PostText
            required
            rules={{ required: true }}
            label="name"
            name="author"
          />
        </Grid>
        <Grid xs={12}>
          <PostText
            required
            rules={{ required: true }}
            label="title"
            name="content"
            multiline
            maxRows={3}
          />
          <InvalidMessage name="content" control={control} />
        </Grid>
      </Grid>
    </Container>
  );
};

export type PostEditorDialogAction = {
  onClose?: React.Dispatch<void>;
  onOk?: React.Dispatch<void>;
};

export const PostEditorDialog: React.FC<
  DialogProps & PostEditorDialogAction
> = ({ children, onOk, ...rest }) => {
  const logger = useLogger();
  logger.write({ component: "PostEditorDialog", hook: "RENDER" });
  return (
    <Dialog {...rest}>
      <DialogTitle>Post</DialogTitle>
      <DialogContent>
        <PostEditor />
      </DialogContent>
      <DialogActions>
        <Button size="small" onClick={() => onOk && onOk()}>
          OK
        </Button>
        <Button size="small" onClick={() => rest.onClose && rest.onClose()}>
          cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export const usePostEditorDialog = (params: PostEditorDialogAction) => {
  const { onClose, ...rest } = params;
  const [open, setOpen] = React.useState(false);
  const handleClose = () => {
    onClose && onClose();
    setOpen(false);
  };

  React.useEffect(() => {
    console.log("open", open);
  }, [open]);

  return {
    // open,
    setOpen,
    element: <PostEditorDialog open={open} onClose={handleClose} {...rest} />
  };
};

const AddPostButton: React.FC<PostEditorDialogAction> = (params) => {
  const navigation = useNavigate();
  const { setOpen, element } = usePostEditorDialog(params);
  const onAddPostClick = () => {
    // navigation("/post", { replace: true });
    setOpen(true);
  };

  return (
    <>
      <Button size="small" variant="outlined" onClick={onAddPostClick}>
        Add post
      </Button>
      {element}
    </>
  );
};

export default AddPostButton;
