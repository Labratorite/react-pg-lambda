import React from "react";
import axios from "axios";
import { useLogger } from "src/utils/logger";

const TryLambdaUrlButton: React.FC = () => {
  const logger = useLogger();
  console.log("TryLambdaUrlButton");
  //logger.write({ component: "TryLambdaUrlButton", message: "RENDER" });

  const tryLambdaUrl = async () => {
    const url =
      "https://m4pmbtqjq6dzoothvxej2rpmae0uazws.lambda-url.ap-northeast-1.on.aws/";
    try {
      const response = await axios
        .get<string>(url, {
          params: { statuscode: "200" }
        })
        .then((res) => res.data);

      logger.write({
        component: "TryLambdaUrlButton",
        message: "response",
        context: response
      });
    } catch (error) {
      console.log("error", error);
      logger.write({
        component: "TryLambdaUrlButton",
        hook: "catch",
        context: error
      });
    }
  };

  const onclick = (): void => {
    logger.write({ component: "TryLambdaUrlButton", hook: "onClick" });
    // tryLambdaUrl();
    tryLambdaUrl();
  };
  return (
    <>
      <button onClick={onclick}>lambda関数Urlテスト</button>
    </>
  );
};

export default TryLambdaUrlButton;
