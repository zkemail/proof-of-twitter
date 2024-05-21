import { useState } from "react";
import { Button, OutlinedButton } from "./Button";

const EmailInputMethod = ({ onClickGoogle, onClickEMLFile }) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: 16,
        alignItems: "center",
      }}
    >
      <Button onClick={onClickGoogle}>Sign in with Google</Button>
      or
      <OutlinedButton
        onClick={() => {
          onClickEMLFile();
        }}
      >
        Upload email .eml file{" "}
      </OutlinedButton>
    </div>
  );
};

export default EmailInputMethod;
