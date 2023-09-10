import React, { useEffect } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { isShowPopupState } from "state";

import { styled } from "@material-ui/core/styles";
import { Modal, CircularProgress } from "@material-ui/core";
import { Routes } from "./Routes";

const StyledModal = styled(Modal)({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",

  "& .MuiCircularProgress-root": {
    outline: "none",
  },
});

const App = () => {
  const setIsShowPopup = useSetRecoilState(isShowPopupState);

  useEffect(() => {
    setIsShowPopup(window.localStorage.getItem("sdd_show_popup") !== "false");
  }, []);

  return (
    <>
      <Routes />

      {/* <StyledModal open={!!true}>
        <CircularProgress size={80} />
      </StyledModal> */}
    </>
  );
};

export default App;
