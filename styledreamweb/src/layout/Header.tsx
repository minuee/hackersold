import React, { useState } from "react";
import { useLocation, useHistory } from "react-router-dom";

import { makeStyles, AppBar, Box, IconButton } from "@material-ui/core";
import { Menu, ArrowBack } from "@material-ui/icons";
import { Typography, Button } from "components/Mui";
import { Image, Link } from "components";

const useStyles = makeStyles((theme) => ({}));

type headerProps = {
  handleOpen(): void;
};

export const Header: React.FC<headerProps> = ({ handleOpen }) => {
  const classes = useStyles();
  const { pathname } = useLocation();
  const history = useHistory();

  let isMain = pathname == "/";

  return (
    <AppBar color="secondary" elevation={1}>
      <Box px={2} height="70px" display="flex" justifyContent="space-between" alignItems="center">
        {!isMain && (
          <IconButton
            edge="start"
            onClick={() => {
              let idx = pathname.lastIndexOf("/");
              //history.push(idx ? pathname.substring(0, idx) : "/");
              history.goBack()
            }}
          >
            <ArrowBack fontSize="large" color="primary" />
          </IconButton>
        )}
        { isMain ?
        <Typography mx={1} color="primary" variant="h6" fontWeight="700" fontFamily="Arial-black">
          STYLE DREAM
        </Typography>
        :
        <Typography mx={1} color="primary" variant="h6" fontWeight="700" fontFamily="Arial-black" align="right">
          STYLE DREAM
        </Typography>
        }
        {//isMain && (
          <IconButton edge="end" onClick={handleOpen}>
            <Menu fontSize="large" color="primary" />
          </IconButton>
        //)
        }
      </Box>

      <Box display="flex" height="30px" fontSize="10px" bgcolor="#f6f6f6">
        <Typography margin="auto" fontSize="inherit">
          당신의 스타일을 쇼핑해 드립니다. Shop your style, Fit your style!
        </Typography>
      </Box>
    </AppBar>
  );
};
