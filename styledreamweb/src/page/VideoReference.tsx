import React from "react";
import { useHistory } from "react-router-dom";

import { makeStyles, Box, TextField, Grid, IconButton, Divider } from "@material-ui/core";
import { Search } from "@material-ui/icons";
import { Typography, Button } from "components/Mui";
import { RatioBox, Image } from "components";

import { video_reference as data,contact_cafe_list } from "data";
import { getFullFilePath } from "common";

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

export const VideoReference: React.FC = () => {
  const classes = useStyles();
  const history = useHistory();

  return (
    <Box py={2}>
      <Typography mt={1} mb={3} variant="h3" fontWeight={300}>
        Description
      </Typography>

      <Typography variant="h5" fontWeight={400}>
        {data.title}
      </Typography>

      <Box my={2}>
        <Divider />
      </Box>

      <Typography mb={1} variant="h6" fontWeight={500}>
        {data.desc1}
      </Typography>
      <Typography fontWeight={400} whiteSpace="pre-wrap">
        {data.desc2}
      </Typography>

      <Box mb={4}>
        {[...Array(3)].map((tmp, index) => (
          <Box my={2} boxShadow={4} key={index}>
            <RatioBox ratio={1.8}>
              <Image src={getFullFilePath(`/video_reference/${index + 1}.png`)} objectFit="cover" />
            </RatioBox>
          </Box>
        ))}
      </Box>

      <Typography fontWeight={500}>{data.label1}</Typography>
      <Box my={1}>
        <Divider />
      </Box>
      <Typography fontWeight={500}>{data.label2}</Typography>
      <Box my={1}>
        <Divider />
      </Box>
      <Typography fontWeight={500}>{data.label3}</Typography>

      <Typography mt={4} variant="body2" fontWeight={400}>
        스타일 드림 카페로 초대합니다. 다양한 스타일을 체험해 보세요.
      </Typography>
      <Box mt={1}>
        <Grid container>
          {contact_cafe_list.map((item, index) => (
            <Grid
              container
              alignItems="center"
              item
              //xs={index === 4 ? 12 : 6}
              xs={12}
              style={{ marginBottom: "10px" }}
              key={index}
            >
              <Image src={item.img_url} width="20px" height="20px" borderRadius="2px" />
              <Typography ml={1} style={{ fontSize: "0.9rem",fontWeight:'bold' }} onClick={() => window.open(item.link)}>
                {item.content}
              </Typography>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};
