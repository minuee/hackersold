import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";

import { makeStyles, Box, TextField, Grid } from "@material-ui/core";
import { Typography, Button } from "components/Mui";
import { RatioBox, Image } from "components";

import { contact_list } from "data";

const useStyles = makeStyles((theme) => ({}));

export const ReservationComplete: React.FC = () => {
  const classes = useStyles();
  const history = useHistory();
  const { state }: any = history.location;

  useEffect(() => {
    if (!state?.name) {
      history.replace("/");
    }
  }, [state]);

  return (
    <Box py={2} display="flex" flexDirection="column" alignItems="center">
      <Image src="/image/reserve_complete.png" width="300px" height="300px" borderRadius="2px" />

      <Image src="/image/check.png" width="40px" height="40px" mt={4} />
      <Typography mt={1} variant="h4">
        상담예약 완료
      </Typography>
      <Typography mt={4} variant="h6">{`${state?.name}(${state?.phone})님,`}</Typography>
      <Typography variant="h6">스타일드림에서 곧 연락드리겠습니다.</Typography>

      <Box mt={8} ml={2} mr={2}>
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

      <Button fullWidth color="primary" mt={6} py={2} onClick={() => history.push("/")}>
        <Typography fontWeight={700}>메인으로 돌아가기</Typography>
      </Button>
    </Box>
  );
};
