import React from "react";
import { useNavigate } from "react-router-dom";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";

import styled from "@emotion/styled";
import { DateTime } from "luxon";
import MuiButton, { ButtonProps } from "@mui/material/Button";
import { Box } from "@mui/material";
import { useLogger } from "src/utils/logger";
import useLambdaRequest from "src/utils/LambdaRequest";
import PostTable from "./PostTable";
import TargetableButton from "./TargetableButton";
import OpenEditorDialogButton from "./PostEditor";

export const generatePost = (values?: Partial<Post>): Post => {
  const id = DateTime.local().toMillis().toString();
  return {
    id: id,
    _type: "post",
    parent_id: "post",
    title: "title_" + id,
    author: "nanashi",
    content: "content",
    ...values,
  };
};

/*
const ActionButton = styled.div((props) => {
  console.log("props", props);
  return {
    display: "flex",
  };
});
*/

const PostCrudCommponent: React.FC = () => {
  const logger = useLogger();
  console.log("PostCrudCommponent");
  logger.write({ component: "PostCrudCommponent", message: "RENDER" });

  const navigation = useNavigate();

  const methods = useForm<HookForm>();
  const { handleSubmit, getValues, setValue, reset } = methods;

  const [posts, setPosts] = React.useState<Post[]>([]);

  const lambdaRequest = useLambdaRequest();

  const getItems = React.useCallback(async () => {
    const posts = await lambdaRequest<Post[]>({
      url: "/items",
    });
    setPosts(posts || []);
  }, [lambdaRequest]);

  React.useEffect(() => {
    getItems();
  }, [getItems]);

  const onReloadClick = async () => {
    logger.write({ component: "PostCrudCommponent", hook: "onReloadClick" });
    setPosts([]);
    reset({});
    getItems();
  };

  const prepareEdit = () => {
    const _selectedPost = getValues("_selectedPost");
    if (!_selectedPost) return;

    setValue("_inputPost", _selectedPost);
  };
  const prepareAdd = () => {
    const _selectedPost = getValues("_selectedPost");
    setValue("_inputPost", undefined);
    //navigation("/posts/add", { replace: true });
  };
  /* 特定Item取得 
  const onGetItemClick = async () => {
    logger.write({ component: "PostCrudCommponent", hook: "onGetItemClick" });
    const post = await lambdaRequest<Post>({
      url: "/items/test",
    });
    console.log(post?.id);
  };
  */

  const onDeleteClick = async () => {
    logger.write({ component: "PostCrudCommponent", hook: "onDeleteClick" });

    const post = getValues("_selectedPost");
    if (!post) return;
    const result = await lambdaRequest({
      method: "DELETE",
      url: `/items/${post.id}`,
    });
    if (!result) return;
    setPosts((state) => state.filter((value) => value.id != post.id));
  };

  const onSubmit: SubmitHandler<HookForm> = async (values: HookForm) => {
    logger.write({ component: "PostCrudCommponent", hook: "submit" });

    const { _inputPost } = values;
    const post = await lambdaRequest<Post>({
      method: "PUT",
      url: "/items",
      data: generatePost(_inputPost),
    });
    if (!post) return;

    setPosts((state) => {
      if (values._inputPost?.id && state.every((item) => item.id !== post.id)) {
        return [post, ...state];
      }
      return state.map((item) => (item.id === post.id ? post : item));
    });
  };

  return (
    <>
      <FormProvider {...methods}>
        <div>
          <MuiButton size="small" variant="outlined" onClick={onReloadClick}>
            items再取得
          </MuiButton>

          <Box mt={1} sx={{ display: "flex", justifyContent: "right" }}>
            <OpenEditorDialogButton
              prepareOpen={prepareAdd}
              onSubmit={onSubmit}
            >
              Add post
            </OpenEditorDialogButton>
            <OpenEditorDialogButton
              prepareOpen={prepareEdit}
              onSubmit={onSubmit}
              component={TargetableButton}
            >
              edit
            </OpenEditorDialogButton>
            <TargetableButton onClick={onDeleteClick} color="warning">
              delete
            </TargetableButton>
          </Box>
        </div>
        <PostTable posts={posts} />
      </FormProvider>
    </>
  );
};

export default PostCrudCommponent;
