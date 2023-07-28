import React from "react";
import { useLogger } from ".";

const LogClear: React.FC = () => {
  const logger = useLogger();
  return <button onClick={() => logger.clear()}>ログclear</button>;
};
export default LogClear;
