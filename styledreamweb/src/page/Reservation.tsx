import React, { useEffect, useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { useForm, FormProvider, useFormContext, Controller, UseControllerReturn } from "react-hook-form";

import { makeStyles, Box, TextField, Grid, IconButton, FormControlLabel, Checkbox } from "@material-ui/core";
import { Search } from "@material-ui/icons";
import { Typography, Button } from "components/Mui";
import { RatioBox, Image, LoadingModal } from "components";

import { contact_list } from "data";
import { MANAGER_EMAIL_ADDR } from "env";

const useStyles = makeStyles((theme) => ({}));

type ReserveValues = {
  name: string;
  phone: string;
  place: string;
  family: string;
  area_size: string;
  budget: string;
  location: string;
  date: string;
  date_negotiable: boolean;
  inquiry: string;

  [prop: string]: any;
};

export const Reservation: React.FC = () => {
  const classes = useStyles();
  const history = useHistory();
  const methods = useForm<ReserveValues>();
  const { isDirty, isValid } = methods.formState;
  const [isLoading, setIsLoading] = useState<boolean>(false);

  function formText(label: string, content: string) {
    return `
        <h3 style="margin-bottom: 0px">${label}</h3>
        <div style="white-space:pre-wrap; min-height: 50px; padding: 14px;">${content}</div>`;
  }

  async function handleReserve(formData: ReserveValues) {
    if (formData.date_negotiable) {
      formData.date = `${formData.date} (날짜협의가능)`;
    }

    const form_accessor = [
      {
        key: "place",
        label: "바꿀 공간",
      },
      {
        key: "family",
        label: "가족 구성원",
      },
      {
        key: "area_size",
        label: "분양평수",
      },
      {
        key: "budget",
        label: "예산",
      },
      {
        key: "location",
        label: "거주지역",
      },
      {
        key: "date",
        label: "희망 서비스일",
      },
      {
        key: "inquiry",
        label: "문의사항",
      },
    ];

    let title = `[스타일드림]예약이 접수되었습니다`;
    let message = `
  <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
  <html xmlns="http://www.w3.org/1999/xhtml">
  <head>
      <meta charset='utf-8'>
  </head>
  <body>
    <table border="0" cellpadding="0" cellspacing="0" width="600">
      <tbody>
      <tr>
      <td width="100%">
        <div style="display:flex; flex-direction: column; align-items: stretch; justify-content: center; max-width: 600px; margin: auto; padding: 20px 20px 20px 20px">
          <div style="display:flex; align-items: center;">
            <img src="https://s3.ap-northeast-2.amazonaws.com/www.sadadream.com/image/email_logo.png" alt="스다일드림 로고" width="40" height="40" />
            <p style="font-size: 22px; margin-left: 14px; font-weight: 700">스다일드림 홈스타일링 예약정보</p>
          </div>
    
          <hr style="margin: 10px 10px 0 0" />
          <h2>[고객정보]</h2>
          ${formText("이름", formData.name)}
          ${formText("전화번호", formData.phone)}
          <br />
          <hr style="margin: 10px 10px 0 ;" />
          <br />

          <h2>[문의내용]</h2>
          ${form_accessor.map(({ key, label }) => formText(label, formData[key])).join("\n")}
          <hr style="margin: 10px 10px 0 0" />
        </div>
      </td>
      </tr>
    </table>
  </body>
  </html>
  `;

    try {
      setIsLoading(true);
      let resp = await axios.post("https://xamwftqgaa.execute-api.us-east-1.amazonaws.com/default/devSendEmail", {
        toAddress: MANAGER_EMAIL_ADDR,
        title: title,
        msg: message.trim(),
        type: "HTML",
      });

      if (resp.status !== 200) {
        throw new Error();
      }

      setIsLoading(false);
      history.replace({
        pathname: "/reservation_complete",
        state: formData,
      });
    } catch (e) {
      setIsLoading(false);
      alert("문의 답변을 발송하는데 오류가 발생했습니다");
      console.log({ e });
    }
  }

  return (
    <Box py={2}>
      <Typography variant="h4" fontWeight={300}>
        예약(Reservation)
      </Typography>

      <FormProvider {...methods}>
        <Typography mt={4} fontWeight={500}>
          #개인정보 입력
        </Typography>
        <RHFTextField name="name" placeholder="이름" />
        <RHFTextField name="phone" placeholder="연락처" type="tel" />
        {/* /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i */}

        <Typography mt={4} fontWeight={500}>
          #홈스타일링 상담 내용
        </Typography>
        <Typography mt={2} color="textSecondary" fontWeight={500}>
          1. 어떤 공간을 바꾸고 싶나요?
        </Typography>
        <RHFTextField name="place" placeholder="ex. 거실, 드레스룸" />

        <Typography mt={2} color="textSecondary" fontWeight={500}>
          2. 가족 구성원이 어떻게 되나요?
        </Typography>
        <RHFTextField name="family" placeholder="ex. 성인 3" />

        <Typography mt={2} color="textSecondary" fontWeight={500}>
          3. 분양평수를 입력해주세요.
        </Typography>
        <RHFTextField name="area_size" placeholder="ex. 20평" />

        <Typography mt={2} color="textSecondary" fontWeight={500}>
          4. 예산을 입력해주세요.
        </Typography>
        <RHFTextField name="budget" placeholder="ex. 150만원 이하" />

        <Typography mt={2} color="textSecondary" fontWeight={500}>
          5. 거주지역을 입력해주세요.
        </Typography>
        <RHFTextField name="location" placeholder="ex. 서울특별시 강남구 대치동" />

        <Box mt={2} display="flex" justifyContent="space-between" alignItems="center">
          <Typography display="inline" variant="body2" color="textSecondary" fontWeight={500}>
            6. 희망 서비스일을 입력해주세요.
          </Typography>

          <Controller
            render={({ field: { value, onChange } }) => (
              <FormControlLabel
                style={{ marginRight: 0 }}
                control={<Checkbox color="primary" size="small" />}
                onChange={(e, checked) => onChange(checked)}
                checked={value}
                label={
                  <Typography color="textSecondary" variant="body2">
                    날짜 협의가능
                  </Typography>
                }
              />
            )}
            control={methods.control}
            name="date_negotiable"
            defaultValue={false}
          />
        </Box>
        <RHFTextField name="date" placeholder="ex. 2021.01.01" />

        <Typography mt={2} color="textSecondary" fontWeight={500}>
          7. 스타일링 관련 문의사항을 알려주세요.
        </Typography>
        <RHFTextField
          name="inquiry"
          placeholder="상담 신청서를 작성해 주시면 친절한 상담과 추천으로 홈스타일링을 진행해 드립니다."
          multiline={true}
          rows={10}
        />
      </FormProvider>

      <Box mt={2}>
        <Typography variant="body2" fontWeight={700}>
          스타일리스트는, 시공 견적 및 제품 제안을 진행합니다.
        </Typography>
        <Typography variant="body2">
          프로젝트의 범위나 규모에 따라 공간 활용안, 전체 컨셉 도출, 마감재 선택, 가구 재배치, 제품의 제안, 세팅에
          관여하여 프로세스를 완성합니다.
        </Typography>
      </Box>

      <Box mt={4}>
        <Grid container>
          {contact_list.map((item, index) => (
            <Grid
              container
              alignItems="center"
              item
              xs={index === 4 ? 12 : 6}
              style={{ marginBottom: "10px" }}
              key={index}
            >
              <Image src={item.img_url} width="20px" height="20px" borderRadius="2px" />
              <Typography ml={1} style={{ fontSize: "0.6rem" }} onClick={() => window.open(item.link)}>
                {item.content}
              </Typography>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Button
        fullWidth
        color="primary"
        mt={6}
        py={2}
        onClick={() => {
          methods.handleSubmit(handleReserve)();
          if (!isValid) {
            alert("폼 작성을 완료해주세요");return;
          }
        }}
      >
        <Typography fontWeight={700}>상담예약</Typography>
      </Button>

      <LoadingModal isLoading={isLoading} />
    </Box>
  );
};

type RHFTextFieldProps = {
  name: string;
  placeholder: string;
  multiline?: boolean;
  rows?: number;
  mb?: number;
  type?: string;
  rules?: any;
};
const RHFTextField: React.FC<RHFTextFieldProps> = ({ name, placeholder, multiline, rows, mb, type, rules }) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  return (
    <Box mt={1} mb={mb}>
      <TextField
        fullWidth
        type={type}
        multiline={multiline}
        rows={rows}
        placeholder={placeholder}
        error={errors?.[name]}
        {...register(name, { required: true, ...rules })}
        // {...register(name)}
      />
    </Box>
  );
};
