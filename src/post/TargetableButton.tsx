import React from "react";
import { useWatch } from "react-hook-form";
import MuiButton, { ButtonProps } from "@mui/material/Button";

const TargetableButton: React.FC<ButtonProps> = (props) => {
  const { children, ...rest } = props;
  const selected = useWatch<HookForm>({ name: "_selectedPost" });
  return (
    <MuiButton size="small" variant="outlined" disabled={!selected} {...rest}>
      {children}
    </MuiButton>
  );
};

export default TargetableButton;
