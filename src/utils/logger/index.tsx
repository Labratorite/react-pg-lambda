import React from "react";
import LogViewer, { LogState } from "./LogViewer";
import LogClear from "./LogClear";

type LoggerContextType = {
  write: React.Dispatch<LogState>;
  clear: React.Dispatch<void>;
};
export const LoggerContext = React.createContext<LoggerContextType>({
  write: (_: LogState) => {},
  clear: () => {},
});
export const useLogger = () => React.useContext(LoggerContext);

export const LoggerProvider: FCC = ({ children }) => {
  const [logs, setLogs] = React.useState<LogState[]>([]);

  const contextValue = React.useMemo<LoggerContextType>(
    () => ({
      write: (log: LogState) => {
        setLogs((state) => [...state, log]);
      },
      clear: () => setLogs([]),
    }),
    []
  );

  return (
    <>
      <LoggerContext.Provider value={contextValue}>
        <div
          style={{
            padding: "5px",
            position: "fixed",
            background: "rgba(27, 160, 220, 0.45)",
            bottom: 0,
            left: 0,
            right: 0,
          }}
        >
          <LogClear />
        </div>
        {children}
      </LoggerContext.Provider>
      <LogViewer logs={logs} />
    </>
  );
};

export default useLogger;
