import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useRecoilState } from "recoil";
import { isShowPopupState } from "state";
import { getFullFilePath } from "common";

import { makeStyles, Box, Divider, Grid, IconButton, Modal, Checkbox, FormControlLabel } from "@material-ui/core";
import { Close, Search } from "@material-ui/icons";
import { Typography, Button } from "components/Mui";
import { RatioBox, Image } from "components";

import { profile } from "data";

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

export const Profile: React.FC = () => {
  const classes = useStyles();
  const history = useHistory();
  const { register, handleSubmit } = useForm<{ search_word: string }>();

  function handleSearch({ search_word }: { search_word: string }) {
    history.push(`/search?search_word=${search_word}`);
  }

  return (
    <Box py={2}>
      <Typography variant="h5" fontWeight={500} mb={5}>
        Who we are
      </Typography>
      <Box component="span" pt={20}>
        <Image src={getFullFilePath(`/profile/1.png`)} height="100px" />        
      </Box>
      <Box mt={6}> 
        <Image src={getFullFilePath(`/profile/2.png`)} height="50px" />
      </Box>
      <Box display="flex" flexDirection="column" alignItems="center" textAlign="center" >
        <Typography variant="h5" fontWeight={600}>
          {profile?.title1}
        </Typography>
      </Box>
      <Box justifyContent="center" alignItems="center">
        <Box display="flex" flexDirection="row" justifyContent="center" alignItems="center">
          <Typography variant="h6" fontWeight={'normal'}>
            {profile?.subTitle1}
          </Typography>
          <Typography  pl={1} variant="h6" fontWeight={600}>{"  "}{profile?.subTitle2}</Typography>
        </Box>
      </Box>
      <Box my={2}>
        <Divider />
      </Box>
      <Typography mt={6} style={{ fontSize: "0.9rem",fontWeight:'bold' }} fontWeight={500}>
        {profile?.title2}
      </Typography>
      <Box display="flex" flexDirection="row" >
        <Typography mt={0} style={{ fontSize: "0.9rem",fontWeight:'bold',color:'#ff0000' }} fontWeight={500}>{profile?.title3}</Typography>
        <Typography mt={0} style={{ fontSize: "0.9rem",fontWeight:'bold' , color:'#000000' }} fontWeight={500}>{profile?.title4}</Typography>
      </Box>
      
      <Typography mt={1} variant="body2" whiteSpace="pre-wrap">
        {profile?.content2}
      </Typography>
      <Box display="flex" justifyContent="flex-end" alignItems="center">
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
      </Box>
    </Box>
  );
};
