import { styled } from "@material-ui/core/styles";
import { Modal, CircularProgress } from "@material-ui/core";

const StyledModal = styled(Modal)({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",

  "& .MuiCircularProgress-root": {
    outline: "none",
  },
});

export const LoadingModal: React.FC<{ isLoading: boolean }> = ({ isLoading }) => {
  return (
    <StyledModal open={isLoading}>
      <CircularProgress />
    </StyledModal>
  );
};
