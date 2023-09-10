import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";

import { makeStyles, Box, TextField, Grid } from "@material-ui/core";
import { Typography, Button } from "components/Mui";
import { RatioBox, Image } from "components";

import { contact_list } from "data";

const useStyles = makeStyles((theme) => ({}));

export const Contactus : React.FC = () => {
  const classes = useStyles();
  const history = useHistory();
  
  return (
    <Box py={2} display="flex" flexDirection="column" alignItems="center">
      <Image src="/image/iamge.png" width="300px" height="300px" borderRadius="2px" />
      <Typography mt={5} style={{ fontSize: "1rem" }} >상담신청서를 작성해주시면 고객이 원하는 스타일링을 친절하게 상담해 드리며 적합한 상품구성 및 홈스타일링을 조언해 드립니다.</Typography>

      <Box mt={5} ml={2} mr={2}>
        <Grid container>
          {contact_list.map((item, index) => (
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

      <Button fullWidth color="primary" mt={6} py={2} onClick={() => history.push("/reservation")}>
        <Typography fontWeight={700}>예약하기</Typography>
      </Button>
    </Box>
  );
};
