import React from "react";
import { useNavigate } from "react-router-dom";
import {
  useForm,
  useFormContext,
  FormProvider,
  SubmitHandler,
} from "react-hook-form";
import { Container } from "@mui/material";
import Button from "@mui/material/Button";
//import LoadingButton from '@mui/lab/LoadingButton';
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import TextField, { TextFieldProps } from "@mui/material/TextField";
//import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { styled } from "@mui/material/styles";
// import InvalidMessage from "../utils/InvalidMessage";
import { useLogger } from "src/utils/logger";
import { generatePost } from "./PostCrud";
import { PostEditor } from "./PostEditor";
import useLambdaRequest from "src/utils/LambdaRequest";

/***+*
 * ルート変更テスト用　新規作成画面
 ***/

export type PostAddAction = {
  onSubmit?: (values: HookForm) => Promise<void>; //SubmitHandler<HookForm>;
};
export const PostAddPage: React.FC<PostAddAction> = ({ onSubmit }) => {
  const logger = useLogger();
  logger.write({ component: "PostAdd", hook: "RENDER" });

  const navigation = useNavigate();

  const { handleSubmit, trigger } = useFormContext<HookForm>();

  const onBack = () => {
    logger.write({ component: "PostAdd", hook: "onBack" });
    navigation("..", { replace: true });
  };
  const onSave = async () => {
    const valid = await trigger();
    if (!valid) {
      logger.write({ component: "PostAdd", hook: "validation" });
      return;
    }
    if (!onSubmit) return;

    logger.write({ component: "PostAdd", hook: "onOk" });
    handleSubmit(onSubmit, (errors) => {
      logger.write({
        component: "PostAdd",
        hook: "error",
        context: errors,
      });
    })();
  };

  return (
    <Container maxWidth="sm">
      <Card>
        <CardHeader>Post</CardHeader>
        <CardContent>
          <PostEditor />
        </CardContent>
        <CardActions sx={{ justifyContent: "space-between" }}>
          <Button size="small" onClick={onBack}>
            back
          </Button>
          <Button size="small" onClick={onSave} variant="contained">
            save
          </Button>
        </CardActions>
      </Card>
    </Container>
  );
};

const PostAdd: React.FC = () => {
  const logger = useLogger();
  const navigation = useNavigate();
  const lambdaRequest = useLambdaRequest();

  const methods = useForm<HookForm>();
  const { handleSubmit, getValues } = methods;

  const onSubmit: SubmitHandler<HookForm> = async (values: HookForm) => {
    console.log("onSubmit");
    logger.write({ component: "PostCrudCommponent", hook: "submit" });

    const { _inputPost } = values;
    const post = await lambdaRequest<Post>({
      method: "PUT",
      url: "/items",
      data: generatePost(_inputPost),
    });
    if (!post) return;

    navigation("..", { replace: true });
  };
  return (
    <FormProvider {...methods}>
      <PostAddPage onSubmit={onSubmit} />
    </FormProvider>
  );
};
export default PostAdd;
