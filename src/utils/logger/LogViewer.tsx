import styled from "@emotion/styled";

export type LogState = {
  component: string;
  message?: string;
  hook?: string;
  context?: unknown[] | unknown;
};

const LogItem: React.FC<LogState> = ({ component, hook, message, context }) => {
  const stringifyConext =
    (Array.isArray(context) &&
      context
        .map((arg) => {
          if (typeof arg === "object") {
            return JSON.stringify(arg);
          } else {
            return arg.toString();
          }
        })
        .join(", ")) ||
    JSON.stringify(context);
  return (
    <>
      <span className="cmp">{component}:&nbsp;</span>
      <span className="hook">{hook || ""}</span>
      <span className="msg">{message}</span>
      <span className="addl">
        <code>{context && stringifyConext}</code>
      </span>
    </>
  );
};

const LogList = styled("ol")`
  font-size: 10px;
  text-align: left;
  margin-top: 3rem;
  li {
    padding: 3px 2px;
    border-bottom: 1px dashed #a5a2a2;
    > * {
      padding-right: 5px;
    }
    .cmp {
      background-color: #dcf5ff;
      color: #8392ca;
    }
    .hook {
      color: #e93004;
    }
    .msg {
      color: black;
      font-style: italic;
    }
  }
`;

export const LogViewer: React.FC<{
  logs: LogState[];
}> = ({ logs }) => {
  return (
    <LogList>
      {logs.map((log, index) => (
        <li key={index}>
          <LogItem {...log} />
        </li>
      ))}
    </LogList>
  );
};

export default LogViewer;
