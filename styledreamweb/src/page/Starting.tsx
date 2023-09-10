import React from "react";
import { useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import { getFullFilePath } from "common";

import { makeStyles, Box, TextField, Grid, IconButton } from "@material-ui/core";
import { Search } from "@material-ui/icons";
import { Typography, Button } from "components/Mui";
import { RatioBox, Image } from "components";

import SwiperCore, { Pagination } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
SwiperCore.use([Pagination]);

const useStyles = makeStyles((theme) => ({
  swiper_wrapper: {
    width: "100%",
    paddingBottom: "40px",

    "& .swiper-pagination": {
      bottom: 10,
      transform: "translateY(50%)",
    },

    "& .swiper-pagination-bullet-active": {
      backgroundColor: "#000",
    },
  },
}));

export const Starting: React.FC = () => {
  const classes = useStyles();
  return (
    <Box minHeight="100vh" pt={4} pb={2} display="flex" flexDirection="column" justifyContent="center" bgcolor="#fff">
      <Box px={1} textAlign="right">
        <Typography variant="body2">당신의 스타일을 쇼핑해 드립니다.</Typography>
        <Typography variant="h4" fontWeight={700} fontFamily="Arial-black">
          STYLE DREAM
        </Typography>
        <Typography color="textSecondary">Shop your style, Fit your style</Typography>
      </Box>

      <Box my={4}>
        <Swiper spaceBetween={10} pagination className={classes.swiper_wrapper}>
          <SwiperSlide>
            <OnBoardStart />
          </SwiperSlide>

          <SwiperSlide>
            <OnBoardVideo />
          </SwiperSlide>

          {[...Array(4)].map((tmp, index) => (
            <SwiperSlide key={index}>
              <OnBoardPage index={index} />
            </SwiperSlide>
          ))}
        </Swiper>
      </Box>
    </Box>
  );
};

const OnBoardStart: React.FC = () => {
  return (
    <Box display="flex" justifyContent="space-between" alignItems="center">
      <RatioBox width="50%" ratio={0.62}>
        <Image src={getFullFilePath("/onboard/start.png")} objectFit="160%" objectPosition="70% 100%" />
      </RatioBox>
      <Box display="table" position="relative">
        <Box position="absolute" top={-10} left={-10}>
          <RatioBox width="30px" ratio={1.25}>
            <Image src="/image/double_quote.png" />
          </RatioBox>
        </Box>
        <Typography pr={2} fontWeight={700} whiteSpace="pre-wrap">
          {`당신의 스타일을
쇼핑해 드립니다.`}
        </Typography>
      </Box>
    </Box>
  );
};

const OnBoardVideo: React.FC = () => {
  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <RatioBox width="100%" ratio={1.78}>
        <video src={getFullFilePath("/onboarding.mp4")} muted={false} controls autoPlay={false} loop style={{ width: "100%", height: "100%" }} />
      </RatioBox>
    </Box>
  );
};

const OnBoardPage: React.FC<{ index: number }> = ({ index }) => {
  const page_data = [
    {
      title: "Home Styling",
      desc: `공간에 디자인을 담아 드리는
      홈스타일링 컨시어지 서비스입니다.`,
    },
    {
      title: "Personal Shopper Service",
      desc: `디자인이 필요한 공간 
      가구, 가전, 소품,  패브릭을 쇼핑해 드립니다.`,
    },
    {
      title: "Group Purchasing",
      desc: `(해외)가구,가전,소품, 패브릭,식기 등 리빙 관련 상품을
      합리적인 가격으로 공동 구매 해드리는 서비스입니다.`,
    },
    {
      title: `Personal Stylist Group 
Purchasing for luxury goods`,
      desc: `패션 트랜드 스타일링, 해외 명품, 의류 잡화
      공동구매를 해드립니다.`,
    },
  ];

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <RatioBox width="100%" ratio={1.78}>
        <Image src={getFullFilePath(`/onboard/page_${index + 1}.png`)} objectFit="cover" />
      </RatioBox>
      <Typography mt={4} variant="h5" fontWeight={700} textAlign="center" whiteSpace="pre-line">
        {page_data[index]?.title}
      </Typography>
      <Box my={2} width="20px" height="3px" bgcolor="#cfcfcf" />
      <Typography textAlign="center" whiteSpace="pre-line">
        {page_data[index]?.desc}
      </Typography>
    </Box>
  );
};
