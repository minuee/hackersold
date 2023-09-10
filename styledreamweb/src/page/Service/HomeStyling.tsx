import React from "react";
import { useHistory } from "react-router-dom";

import { makeStyles, Box, TextField, Grid, IconButton, Divider } from "@material-ui/core";
import { Search } from "@material-ui/icons";
import { Typography, Button } from "components/Mui";
import { RatioBox, Image, Span } from "components";

import { service_list } from "data";
import { getFullFilePath } from "common";

const useStyles = makeStyles((theme) => ({}));

const process_list = ["상담신청서 작성", "현장 미팅", "기획/디자인", "시공/제품구매", "서비스 큐레이션"];

export const HomeStyling: React.FC = () => {
  const classes = useStyles();
  const history = useHistory();

  return (
    <Box py={2}>
      <Typography mb={2} variant="h4" fontWeight={500} fontFamily="Playfair Display">
        Home Styling
      </Typography>
      <Divider />

      <Typography mt={2} variant="h5">
        스타일 드림에서 새로운
      </Typography>
      <Typography variant="h5">라이프 스타일을 시작해 보세요.</Typography>

      <Typography mt={4} mb={2} variant="h6">
        <Span bold>누구</Span>
        에게 필요한 서비스인가요?
      </Typography>

      <Typography fontWeight={700}>멋진 집에서 나도 살고 싶다!</Typography>
      <Typography>
        고객이 편한 서비스 신규 입주 , 이사, 집단장, 레노베이션, 신혼부부 기타, 나의 예산과 새로운 스타일은 제안해
        드리는 홈스타일링 케어 서비스입니다.
      </Typography>

      <RatioBox my={4} ratio={1.25}>
        <Image src={getFullFilePath("/service/home_styling.png")} />
      </RatioBox>

      <Typography mt={4} mb={2} variant="h6">
        <Span bold>어떤</Span>
        것을 도와주시나요?
      </Typography>
      <Typography>
        <Span style={{ textDecoration: "underline" }}>필요한 것은 무엇이든 도와드립니다.</Span> 우선, 고객님의 예산과
        목적에 맞춰, 전체적인 홈스타일링 컨설팅을 해드리며, 그에 맞는 공간 스타일링, 필요한 전반적인 가구, 가전, 소품,
        패브릭 및 커튼 구매까지 순차적으로 진행합니다. 고객님 들의 니즈에 따라서 다양한 컨설팅을 진행합니다. 고객님 들이
        고민하고 계신 부분을 문의 하시면 스타일리스트가 상세히 설명해 드립니다.
      </Typography>

      <Typography mt={4} mb={2} variant="h6">
        <Span bold>비용</Span>과 <Span bold>기간</Span>은 어느정도 소요되나요?
      </Typography>
      <Typography>
        비용은 고객님의 예산에 맞춰 진행됩니다. 예산이 적으면 가성비를 고려한 상품들 구매와 스타일링을 진행하며 기간
        역시 공간의 크기와 규모에 맞추어 진행됩니다. 굳이 공사가 필요 없으시면, 간단한 가전, 소품 교체로 스타일링만
        진행합니다.
      </Typography>

      <Typography mt={4} mb={2} variant="h6">
        구체적으로 <Span bold>어떻게 진행</Span>되나요?
      </Typography>
      <Typography>
        상담 신청서를 작성해주시면 친절한 상담과 추천으로 홈스타일링을 진행 후, 시공 견적 및 제품 제안을 진행하게
        됩니다.
      </Typography>
      <Typography mt={2}>
        스타일드림은 시공 시, 안심하고 좋은 서비스를 받을 수 있도록 전 인테리어 과정을 케어하고 인프라를 지원합니다.
      </Typography>

      <Box display="flex" flexDirection="column" alignItems="center">
        {process_list.map((txt, index) => (
          <React.Fragment key={index}>
            <Box textAlign="center">
              <Image src={getFullFilePath(`/service/process_${index + 1}.png`)} width="200px" height="200px" />
              <Typography>{`${index + 1}. ${txt}`}</Typography>
            </Box>

            {index !== 4 ? <Image my={2} src="/image/arrow_down_red.png" width="25px" height="25px" /> : null}
          </React.Fragment>
        ))}
      </Box>

      <Typography mt={8} variant="h6" fontWeight={700}>
        # 기존의 가구 배치에 따라
      </Typography>
      <Typography mt={2}>
        동선 설계를 기준으로 기존 가구만 사용해 배치만 다시 한다면 저렴한 비용으로 홈스타일링을 할 수 있습니다. 상의를
        통해 현재의 공간에 최상의 가구 배치를 찾아보세요!
      </Typography>

      <Typography mt={4} variant="h6" fontWeight={700}>
        # 가구 구매에 따라
      </Typography>
      <Typography mt={2}>
        원하는 스타일과 공간 계획이 있다면 자세히 도와주실 수 있어요. 컨셉에 맞춰 추가로 가구나 소품을 구매하고 배치할
        경우 추가 비용이 발생할 수 있어요.
      </Typography>

      <Typography mt={4} variant="h6" fontWeight={700}>
        # 부분 수리와 리모델링이 필요한 경우
      </Typography>
      <Typography mt={2}>
        간단한 시공(벽지, 페인트, 몰딩, 바닥재 교체 등)이 필요한 곳을 작업을 할 때 비용이 추가로 발생합니다. 원하는
        디자인 스타일과 공간 계획이 있다면 미리 말씀해보세요.
      </Typography>

      <Typography mt={4} variant="h6" fontWeight={700}>
        # 고객 준비 사항
      </Typography>
      <Typography mt={2}>
        나에게 맞는 효율적/합리적인 예산 활용을 위해서는 고객님의 가용 예산에 대한 고민이 선행되어야 합니다.
      </Typography>
      <Typography mt={2}>
        사용 가능한 전체 에산을 정하는 것은 디자이너가 임의로 설정할 수 없으므로 최소/최대 예산 범위를 정하고, 가전을
        위한 금액은 별도로 구분해서 예산을 계획하세요.
      </Typography>

      <Box mt={6} mb={3} textAlign="right">
        <Button px={2} py={1.3} color="primary" borderRadius="25px" onClick={() => history.push("/reservation")}>
          <Typography fontWeight={500}>상담예약 &rarr;</Typography>
        </Button>
      </Box>
    </Box>
  );
};
