import React from "react";
import { useHistory } from "react-router-dom";

import { makeStyles, Box, TextField, Grid, IconButton, Divider } from "@material-ui/core";
import { Search } from "@material-ui/icons";
import { Typography, Button } from "components/Mui";
import { RatioBox, Image, Span } from "components";

import { service_list } from "data";
import { getFullFilePath } from "common";

const useStyles = makeStyles((theme) => ({}));

export const PersonalShopper: React.FC = () => {
  const classes = useStyles();
  const history = useHistory();

  return (
    <Box py={2}>
      <Typography mb={2} variant="h5" fontWeight={500} fontFamily="Playfair Display">
        Personal Shopper Service
      </Typography>
      <Divider />

      <Typography mt={4} variant="h6">
        <Span bold>누구</Span>
        에게 필요한 서비스인가요?
      </Typography>
      <Typography mt={2} fontWeight={700}>
        아무리 찾아봐도 내가 좋아하는, 우리집에 어울리는 제품들을 찾지 못해 고민하시는 분들께 도움을 드립니다.
      </Typography>

      <RatioBox my={4} ratio={1.25}>
        <Image src={getFullFilePath("/service/personal_shopper.png")} />
      </RatioBox>

      <Typography mt={4} variant="h6">
        <Span bold>어떤</Span>
        것을 도와주시나요?
      </Typography>
      <Typography mt={2}>
        <Span style={{ textDecoration: "underline" }}>필요한 것은 무엇이든 다 쇼핑 해 드립니다.</Span>
        가구 부터 가전,소품 패브릭, 미술품, 해외 상품까지 쇼핑서비스를 해드립니다.
      </Typography>

      <Typography mt={4} mb={2} variant="h6">
        <Span bold>비용</Span>과 <Span bold>기간</Span>은 어느정도 소요되나요?
      </Typography>
      <Typography>
        비용은 고객님의 예산에 맞춰 진행됩니다. 예산이 적으면 가성비를 고려한 상품들 구매와 스타일링을 진행하며 기간
        역시 공간의 크기와 규모에 맞추어 진행됩니다. 굳이 공사가 필요 없으시면, 간단한 가전, 소품 교체로 스타일링만
        진행합니다.
      </Typography>

      <Box mt={6} mb={3} textAlign="right">
        <Button px={2} py={1.3} color="primary" borderRadius="25px" onClick={() => history.push("/reservation")}>
          <Typography fontWeight={500}>상담예약 &rarr;</Typography>
        </Button>
      </Box>
    </Box>
  );
};
