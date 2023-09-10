import React,{useEffect} from "react";
import { useHistory } from "react-router-dom";

import { makeStyles, Box, TextField, Grid, IconButton, Divider } from "@material-ui/core";
import { Search } from "@material-ui/icons";
import { Typography, Button } from "components/Mui";
import { RatioBox, Image as RImage, Span } from "components";

import { service_list } from "data";
import { getFullFilePath } from "common";

const useStyles = makeStyles((theme) => ({}));

export const PersonalStylist: React.FC = () => {
  const classes = useStyles();
  const history = useHistory();
  useEffect(() => {
    const imgs = [
      getFullFilePath("/service/personal_stylist.png"),
    ]
    chacheImages(imgs)
  }, []);

  const chacheImages = async(srcArray:any) => {

    const promises = await srcArray.map((src:any) => {
      return new Promise(function ( resolve,reject) {
        const img = new Image();
        img.onload = () => resolve(src)
        img.onerror = () => reject()
  
        img.src = src
      })
    })
    await Promise.all(promises)
  }


  return (
    <Box py={2}>
      <Typography mb={2} variant="h5">
        Personal Stylist Group Purchasing for luxury goods
      </Typography>
      <Divider />

      <Typography mt={2} variant="h6" fontWeight={700}>
        스타일이 좋아야 성공한다!
      </Typography>
      <Typography variant="h6">멋진 순간 나의 스타일을 찾는다.</Typography>
      <Typography mt={2}>
        이제는 더 이상 연예인만 개인 스타일리스트로 관리 받는 시대가 아닙니다. 누구나 자신만의 스타일을 통해 진정한 나의
        가치와 스타일을 만드는 서비스입니다.
      </Typography>

      <RatioBox my={4} ratio={1.25}>
        <RImage src={getFullFilePath("/service/personal_stylist.png")} />
      </RatioBox>

      <Typography mt={4} mb={2} variant="h6">
        <Span bold>어떤</Span>
        것을 도와주시나요?
      </Typography>
      <Typography>
        당신에게 새로운 스타일을 드립니다. 매 시즌 해외 명품 공동 구매,{" "}
        <Span style={{ textDecoration: "underline" }}>
          특히, 남성복 쇼핑 서비스를 통해 자신만의 스타일을 도와드립니다.
        </Span>
      </Typography>
      <Typography mt={2}>공동구매는 카페나 인스타 공지를 통해 참여 하실 수 있습니다.</Typography>
      <Typography mt={2}>
        고객님의 T.P.O을 (성향/선호도/피부톤/브랜드/가격) 참고해 퍼스널쇼퍼에게 요청사항을 알려주시면 비대면 온라인
        쇼핑서비스 와 동행 쇼핑 서비스를 선택에 따라 진행해 드립니다.
      </Typography>

      <Box mt={6} mb={3} textAlign="right">
        <Button px={2} py={1.3} color="primary" borderRadius="25px" onClick={() => history.push("/reservation")}>
          <Typography fontWeight={500}>상담예약 &rarr;</Typography>
        </Button>
      </Box>
    </Box>
  );
};
