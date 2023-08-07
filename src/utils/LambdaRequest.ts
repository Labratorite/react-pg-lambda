import React from "react";
import axios, { AxiosRequestConfig } from "axios";
import { useLogger } from "./logger";

export const apiUrl =
  "https://azyxtmgvfb.execute-api.ap-northeast-1.amazonaws.com";

const headers = {
  "Content-Type": "application/json",
};

type LambdaRequest = <R, D = any>(
  config: AxiosRequestConfig<D>
) => Promise<R | undefined>;

const useLambdaRequest = (): LambdaRequest => {
  const logger = useLogger();
  const request = async <R, D = any>(config: AxiosRequestConfig<D>) => {
    const { url, ...restConfig } = config;
    try {
      const response = await axios
        .request<R>({
          headers,
          url: apiUrl + url,
          ...restConfig,
        })
        .then((res) => res.data);

      logger.write({
        component: "PostCrudCommponent",
        message: "response",
        context: response,
      });
      return response;
    } catch (error) {
      logger.write({
        component: "PostCrudCommponent",
        hook: "catch",
        context: error,
      });
      console.log("error", error);
    }
  };
  return React.useCallback(request, [logger]);
};

export default useLambdaRequest;
