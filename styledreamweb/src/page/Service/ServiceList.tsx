import React from "react";
import { useHistory } from "react-router-dom";

import { makeStyles, Box, TextField, Grid, IconButton, Divider } from "@material-ui/core";
import { Search } from "@material-ui/icons";
import { Typography, Button } from "components/Mui";
import { RatioBox, Image } from "components";

import { service_list } from "data";
import { getFullFilePath } from "common";

const useStyles = makeStyles((theme) => ({}));

export const ServiceList: React.FC = () => {
  const classes = useStyles();
  const history = useHistory();

  return (
    <Box py={2}>
      <Typography variant="h4" fontWeight={300}>
        Service details
      </Typography>

      {service_list.map((item, index) => (
        <React.Fragment key={index}>
          <Box mt={2} mb={6} display="flex" flexDirection="column" alignItems="center" textAlign="center">
            <Image src={getFullFilePath(`/service/${index + 1}.png`)} height="200px" />
            <Typography mt={2} variant="h5" fontWeight={500} fontFamily="Playfair Display">
              {item.title}
            </Typography>
            <Typography mt={1}>{item.desc}</Typography>

            <Button mt={4} py={1} color="secondary" border="solid 1px #000" onClick={() => history.push(item.link)}>
              <Typography fontWeight={500}>상세설명 바로가기</Typography>
            </Button>
          </Box>

          {index !== 3 ? <Divider /> : null}
        </React.Fragment>
      ))}
    </Box>
  );
};
