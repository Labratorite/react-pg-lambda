import React from "react";
import { useForm, FormProvider, useWatch } from "react-hook-form";

import styled from "@emotion/styled";
import { DateTime } from "luxon";
import MuiButton, { ButtonProps } from "@mui/material/Button";
import { Box } from "@mui/material";
import { useLogger } from "src/utils/logger";
import useLambdaRequest from "src/utils/LambdaRequest";
import PostTable from "./PostTable";
import AddPostButton from "./PostEditor";

const url = "https://azyxtmgvfb.execute-api.ap-northeast-1.amazonaws.com";

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

const TargetableButton = (props: ButtonProps): JSX.Element | null => {
  const { children, ...rest } = props;
  const selected = useWatch<HookForm>({ name: "_selectedPost" });
  return (
    <MuiButton size="small" variant="outlined" disabled={!selected} {...rest}>
      {children}
    </MuiButton>
  );
};

const ActionButton = styled.div((props) => {
  console.log("props", props);
  return {
    display: "flex"
  };
});

const PostCrudCommponent: React.FC = () => {
  const logger = useLogger();
  console.log("PostCrudCommponent");
  //logger.write({ component: "TryLambdaUrlButton", message: "RENDER" });

  const methods = useForm<HookForm>();
  const { handleSubmit } = methods;
  const [posts, setPosts] = React.useState<Post[]>([]);
  const lambdaRequest = useLambdaRequest();

  const getItems = React.useCallback(async () => {
    const posts = await lambdaRequest<Post[]>({
      url: url + "/items"
    });
    setPosts(posts || []);
  }, [lambdaRequest]);

  React.useEffect(() => {
    getItems();
  }, [getItems]);

  const onclick = async () => {
    logger.write({ component: "PostCrudCommponent", hook: "onClick" });
    getItems();
  };

  const onGetItemClick = async () => {
    logger.write({ component: "PostCrudCommponent", hook: "onGetItemClick" });
    const post = await lambdaRequest<Post>({
      url: url + "/items/test"
    });
    console.log(post?.id);
  };

  const onDeleteClick = (): void => {
    logger.write({ component: "PostCrudCommponent", hook: "onDeleteClick" });
    lambdaRequest({
      method: "DELETE",
      url: url + "/items/test4"
    });
  };

  const onPutPostClick = async () => {
    logger.write({ component: "PostCrudCommponent", hook: "onPutPostClick" });
    const post = await lambdaRequest<Post>({
      method: "PUT",
      url: url + "/items",
      data: generatePost("test4")
    });
    if (!post) return;

    setPosts((state) => [...state, post]);
  };

  const onSubmit = React.useCallback(() => {
    console.log("onSubmit");
  }, []);
  const onAddPostClick = React.useCallback(async () => {
    await handleSubmit(onSubmit, (errors, e) => console.log("errors", errors));
    console.log("ADD");
    logger.write({ component: "PostCrudCommponent", hook: "onAddPostClick" });
    // navigation("/post", { replace: true });
  }, [handleSubmit, logger, onSubmit]);
  return (
    <>
      <FormProvider {...methods}>
        <div>
          <MuiButton size="small" variant="outlined" onClick={onclick}>
            items再取得
          </MuiButton>
          <MuiButton size="small" variant="outlined" onClick={onPutPostClick}>
            put
          </MuiButton>
          <Box mt={1} sx={{ display: "flex", justifyContent: "right" }}>
            <AddPostButton onOk={onAddPostClick} />
            <TargetableButton onClick={onGetItemClick}>
              get item
            </TargetableButton>
            <TargetableButton onClick={onDeleteClick}>delete</TargetableButton>
          </Box>
        </div>
        <PostTable posts={posts} />
      </FormProvider>
    </>
  );
};

export default PostCrudCommponent;
