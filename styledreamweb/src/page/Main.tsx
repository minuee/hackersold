import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useRecoilState } from "recoil";
import { isShowPopupState } from "state";
import { getFullFilePath } from "common";

import { makeStyles, Box, TextField, Grid, IconButton, Modal, Checkbox, FormControlLabel } from "@material-ui/core";
import { Close, Search } from "@material-ui/icons";
import { Typography, Button } from "components/Mui";
import { RatioBox, Image } from "components";

import { main } from "data";

const useStyles = makeStyles((theme) => ({
  search: {
    margin: theme.spacing(2, 0, 4),
    borderRadius: theme.spacing(4),
    boxShadow: theme.shadows[4],

    "& .MuiInputBase-root": {
      fontSize: "0.8rem",
      "& > input": {
        paddingLeft: theme.spacing(3),
      },
    },
    "& fieldset": {
      border: 0,
    },
  },
}));

export const Main: React.FC = () => {
  const classes = useStyles();
  const history = useHistory();
  const { register, handleSubmit } = useForm<{ search_word: string }>();

  function handleSearch({ search_word }: { search_word: string }) {
    history.push(`/search?search_word=${search_word}`);
  }

  return (
    <Box py={2}>
      <Typography variant="h4" fontWeight={300}>
        Want it?
      </Typography>

      <TextField
        {...register("search_word")}
        fullWidth
        placeholder="쇼핑대행 레퍼런스를 확인해보세요"
        className={classes.search}
        onKeyDown={(e) => e.key === "Enter" && handleSubmit(handleSearch)()}
        InputProps={{
          endAdornment: (
            <IconButton edge="end" onClick={handleSubmit(handleSearch)}>
              <Search color="primary" />
            </IconButton>
          ),
        }}
      />

      <Grid container spacing={1}>
        {[...Array(7)].map((tmp, index) => {
          const is_wide: boolean = [2, 5, 6].includes(index);
          return (
            <Grid item xs={is_wide ? 12 : 6} key={index}>
              <RatioBox ratio={1.3}>
                <Image src={getFullFilePath(`/main/${index + 1}.png`)} objectFit="cover" />
              </RatioBox>
            </Grid>
          );
        })}
      </Grid>

      <Typography mt={2} variant="h6" fontWeight={500}>
        {main?.title1}
      </Typography>
      <Typography mt={1} variant="body2" whiteSpace="pre-wrap">
        {main?.content1}
      </Typography>

      <Typography mt={6} variant="h6" fontWeight={500}>
        {main?.title2}
      </Typography>
      <Typography mt={1} variant="body2" whiteSpace="pre-wrap">
        {main?.content2}
      </Typography>

      <Button
        mt={6}
        mb={4}
        px={2}
        py={1.3}
        color="primary"
        borderRadius="25px"
        onClick={() => history.push("/reservation")}
      >
        <Typography variant="body2" fontWeight={500}>
          상담예약 &rarr;
        </Typography>
      </Button>

      {/*<PopupModal />*/}
    </Box>
  );
};

const PopupModal = () => {
  const [isShowPopup, setIsShowPopup] = useRecoilState(isShowPopupState);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isDoNotShow, setIsDoNotShow] = useState<boolean>(false);

  function handleClose() {
    if (isDoNotShow) {
      window.localStorage.setItem("sdd_show_popup", "false");
    }
    setIsShowPopup(false);
  }

  useEffect(() => {
    setIsOpen(isShowPopup);
  }, [isShowPopup]);

  return (
    <Modal open={isOpen} onClose={() => setIsOpen(false)}>
      <Box p={4} display="flex" flexDirection="column" justifyContent="center" height="100vh">
        <Box px={2} py={1} bgcolor="#fff" borderRadius="5px" boxShadow={3}>
          <Box mb={1} display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" fontWeight={500}>
              News
            </Typography>
            <IconButton edge="end" onClick={handleClose}>
              <Close fontSize="large" />
            </IconButton>
          </Box>

          <RatioBox ratio={1.3}>
            <Image src="/image/banner.png" objectFit="cover" />
          </RatioBox>

          <Typography mt={2} variant="h6" fontWeight={700}>
            [공지] 기흥 까사미아 아울렛 오픈!
          </Typography>
          <Typography mt={1}>공지 텍스트 공지 텍스트 공지 텍스트 공지 텍스트 공지 텍스트 공지 텍스트</Typography>

          <Box pt={2}>
            <FormControlLabel
              control={<Checkbox color="primary" />}
              value={isDoNotShow}
              onChange={(e, checked) => setIsDoNotShow(checked)}
              label={<Typography fontWeight={500}>다시보지않기</Typography>}
            />
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};
