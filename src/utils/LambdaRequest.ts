import React from "react";
import axios, { AxiosRequestConfig } from "axios";
import { useLogger } from "./logger";

const headers = {
  "Content-Type": "application/json"
};

type LambdaRequest = <R, D = any>(
  config: AxiosRequestConfig<D>
) => Promise<R | undefined>;

const useLambdaRequest = (): LambdaRequest => {
  const logger = useLogger();
  const request = async <R, D = any>(config: AxiosRequestConfig<D>) => {
    try {
      const response = await axios
        .request<R>({
          headers,
          ...config
        })
        .then((res) => res.data);

      logger.write({
        component: "PostCrudCommponent",
        message: "response",
        context: response
      });
      return response;
    } catch (error) {
      console.log("error", error);
      logger.write({
        component: "PostCrudCommponent",
        hook: "catch",
        context: error
      });
    }
  };
  return React.useCallback(request, [logger]);
};

export default useLambdaRequest;
