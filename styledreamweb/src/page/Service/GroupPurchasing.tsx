import React from "react";
import { useHistory } from "react-router-dom";
import { getFullFilePath } from "common";

import { makeStyles, Box, TextField, Grid, IconButton, Divider } from "@material-ui/core";
import { Search } from "@material-ui/icons";
import { Typography, Button } from "components/Mui";
import { RatioBox, Image, Span } from "components";

import { contact_list } from "data";

const useStyles = makeStyles((theme) => ({}));

export const GroupPurchasing: React.FC = () => {
  const classes = useStyles();
  const history = useHistory();
  
  return (
    <Box py={2}>
      <Typography mb={2} variant="h5">
        Group Purchasing
      </Typography>
      <Divider />

      <Typography mt={4} variant="h6">
        <Span bold>누구</Span>
        에게 필요한 서비스인가요?
      </Typography>
      <Typography mt={2} fontWeight={700}>
        남녀노소 구분이 없습니다. 홈, 리빙 관련 된 다양한 제품등을 주기적으로 합리적인 가격으로 공동 구매 대행해
        드립니다.
      </Typography>

      <RatioBox my={4} ratio={1.25}>
        {/*<Image src={getFullFilePath("/service/group_purchasing.png")} />*/}
        <Image src={getFullFilePath("/group_purchasing/2.png")} />
      </RatioBox>

      <Typography mt={4} variant="h6">
        <Span bold>어떤</Span>
        것을 도와주시나요?
      </Typography>
      <Typography mt={2}>
        <Span style={{ textDecoration: "underline" }}>필요한 것은 무엇이든 도와드립니다.</Span>
        비싸서 구매하지 못했던 제품, 신상품이라서 구하기 쉽지 않았던 제품 등 고객님들이 필요한 제품이 무엇인지 다양한
        의견을 주시면 주기적으로 해당제품에 대한 서치와 공동구매를 오픈하여 합리적인 가격으로 진행합니다.
      </Typography>

      <Typography mt={4} variant="h6">
        <Span bold>공동구매</Span>는 어디서 확인 가능한가요?
      </Typography>
      <Typography mt={2}>Naver Café를 통해서 진행합니다. 하단의 링크를 통해 이용하실 수 있습니다.</Typography>
      <Box py={1}>
        {[contact_list[4],contact_list[3], contact_list[2], contact_list[0], contact_list[1]].map((item, index) => (
          <Box mt={1} display="flex" alignItems="center" key={index}>
            <Image src={item.img_url} width="20px" height="20px" borderRadius="2px" />
            <Typography
              ml={1}
              variant="body2"
              fontWeight={index === 0 ? 700 : 400}
              onClick={() => window.open(item.link)}
            >
              {item.content}
            </Typography>
          </Box>
        ))}
      </Box>

      <Typography mt={4} variant="h6" fontWeight={700}>
        Shop your style, Fit your style!
      </Typography>
      <Typography mt={2}>
        디자인이 필요한 주거공간을 위한 가구 가전, 소품 및 패브릭 등 필요한 상품들을 대신 쇼핑해 드립니다.
      </Typography>

      <Box mt={6} mb={3} textAlign="right">
        <Button px={2} py={1.3} color="primary" borderRadius="25px" onClick={() => history.push("/reservation")}>
          <Typography fontWeight={500}>상담예약 &rarr;</Typography>
        </Button>
      </Box>
    </Box>
  );
};
