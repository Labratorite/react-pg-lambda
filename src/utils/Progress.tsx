import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Backdrop, { BackdropProps } from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

const Progress: React.FC<BackdropProps> = (props) => {
  return (
    <Backdrop
      sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      {...props}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  );
};
export default Progress;

type ProgressContextType = {
  progress: React.Dispatch<boolean>;
};
export const ProgressContext = React.createContext<ProgressContextType>({
  progress: (_: boolean) => {},
});
export const useProgress = () => React.useContext(ProgressContext);

export const ProgressProvider: React.FC = (props) => {
  const [open, setOpen] = React.useState(false);

  const contextValue = React.useMemo<ProgressContextType>(
    () => ({
      progress: (isShow: boolean) => setOpen(isShow),
    }),
    []
  );

  const location = useLocation();

  React.useLayoutEffect(() => {
    console.log("Location changed!", location);
    setOpen(true);
  }, [location]);
  return (
    <>
      <Progress open={open} />
      <ProgressContext.Provider value={contextValue}>
        <Outlet />
      </ProgressContext.Provider>
    </>
  );
};
