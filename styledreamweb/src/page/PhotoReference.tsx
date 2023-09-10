import React, { useRef, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { getFullFilePath } from "common";

import { makeStyles, Box, Divider, Modal, Fab, IconButton } from "@material-ui/core";
import { Clear, ChevronLeft, ChevronRight } from "@material-ui/icons";
import { Typography, Button } from "components/Mui";
import { RatioBox, Image as NImage } from "components";

import SwiperCore, { Navigation, Pagination } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
SwiperCore.use([Navigation, Pagination]);

import { photo_reference as data } from "data";

const useStyles = makeStyles((theme) => ({
  swiper_wrapper: {
    width: "100%",
    paddingBottom: "40px",

    "& .swiper-pagination": {
      bottom: 20,
      transform: "translateY(50%)",
    },

    '& [class^="swiper-button-"]': {
      display: "none",
    },
  },

  nav_button: {
    position: "absolute",
    zIndex: 10,
    bottom: 20,
    transform: "translateY(50%)",

    borderRadius: 0,
    padding: 0,
  },
  nav_disabled: {
    opacity: "0.5",
    pointerEvents: "none",
  },
}));



export const PhotoReference: React.FC = () => {
  const classes = useStyles();
  const history = useHistory();

  useEffect(() => {
    const imgs = [
      getFullFilePath("/images_1/1.jpg"),
      getFullFilePath("/images_1/2.jpg"),
      getFullFilePath("/images_1/3.jpg"),
      getFullFilePath("/images_1/4.jpg"),
      getFullFilePath("/images_1/5.jpg"),
      getFullFilePath("/images_1/6.jpg"),
      getFullFilePath("/images_1/7.jpg"),
      getFullFilePath("/images_1/8.jpg"),
      getFullFilePath("/images_1/9.jpg"),
      getFullFilePath("/images_1/10.jpg"),
      getFullFilePath("/images_1/11.jpg"),
      getFullFilePath("/images_1/12.jpg"),
      getFullFilePath("/images_1/13.jpg"),
      getFullFilePath("/images_1/14.jpg"),
      getFullFilePath("/images_1/15.jpg"),
      getFullFilePath("/images_1/16.jpg"),
      getFullFilePath("/images_1/17.jpg"),
      getFullFilePath("/images_1/18.jpg"),
      getFullFilePath("/images_1/19.jpg"),
      getFullFilePath("/images_1/20.jpg"),
      getFullFilePath("/images_2/1.jpg"),
      getFullFilePath("/images_2/2.jpg"),
      getFullFilePath("/images_2/3.jpg"),
      getFullFilePath("/images_2/4.jpg"),
      getFullFilePath("/images_2/5.jpg"),
      getFullFilePath("/images_2/6.jpg"),
      getFullFilePath("/images_2/7.jpg"),
      getFullFilePath("/images_2/8.jpg"),
      getFullFilePath("/images_2/9.jpg"),
      getFullFilePath("/images_2/10.jpg"),
      getFullFilePath("/images_2/11.jpg"),
      getFullFilePath("/images_3/1.jpg"),
      getFullFilePath("/images_3/2.jpg"),
      getFullFilePath("/images_3/3.jpg"),
      getFullFilePath("/images_3/4.jpg"),
      getFullFilePath("/images_3/5.jpg"),
      getFullFilePath("/images_3/6.jpg"),
      getFullFilePath("/images_3/7.jpg"),
      getFullFilePath("/images_3/8.jpg"),
      getFullFilePath("/images_4/1.jpg"),
      getFullFilePath("/images_4/2.jpg"),
      getFullFilePath("/images_4/3.jpg"),
      getFullFilePath("/images_4/4.jpg"),
      getFullFilePath("/images_4/5.jpg"),
      getFullFilePath("/images_4/6.jpg"),
      getFullFilePath("/images_4/7.jpg"),
      getFullFilePath("/images_4/8.jpg"),
      getFullFilePath("/images_4/9.jpg"),
      getFullFilePath("/images_4/10.jpg")
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
      <Typography 
        mt={1} mb={3} 
        variant="h3" 
        //fontWeight={300}
      >
        Reference
      </Typography>

      {data.map((item, index) => (
        <Box mb={8} key={index}>
          <Typography 
            variant="h5" 
            //fontWeight={500} fontFamily="Playfair Display"
          >
            {item.title}
          </Typography>

          <Box my={2}>
            <Divider />
          </Box>

          <Typography mb={1} variant="h6" 
            //fontWeight={500}
          >
            {item.desc1}
          </Typography>
          <Typography fontWeight={400} whiteSpace="pre-wrap">
            {item.desc2}
          </Typography>

          <Box my={3} boxShadow={8}>
            <SwiperBox title={item.title} path={item.path} />
          </Box>

          <Typography fontWeight={500}>{item.label1}</Typography>
          <Box my={0.5} py={1}>
            <Divider />
          </Box>
          <Typography fontWeight={500}>{item.label2}</Typography>
          <Box my={0.5} py={1}>
            <Divider />
          </Box>
          <Typography fontWeight={500}>{item.label3}</Typography>
          <Box my={0.5} py={1}>
            <Divider />
          </Box>
        </Box>
      ))}
    </Box>
  );
};

const SwiperBox: React.FC<{ title: string; path: string }> = ({ title, path }) => {
  const classes = useStyles();
  const [startPos, setstartPos] = useState(-1);
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  const img_num: { [index: string]: number } = {
    images_1 : 20,
    images_2 : 11,
    images_3 : 8,
    images_4 : 10
  };

  return (
    <Box mb={2} position="relative" width="100%">
      <IconButton className={classes.nav_button} style={{ left: 20 }} ref={prevRef}>
        <ChevronLeft />
      </IconButton>
      <IconButton className={classes.nav_button} style={{ right: 20 }} ref={nextRef}>
        <ChevronRight />
      </IconButton>

      <Swiper
        spaceBetween={10}
        navigation={{
          prevEl: prevRef.current || undefined,
          nextEl: nextRef.current || undefined,
          disabledClass: classes.nav_disabled,
        }}
        onInit={(swiper) => {
          Object.assign(swiper.params.navigation, {
            prevEl: prevRef.current,
            nextEl: nextRef.current,
          });
          // swiper.navigation?.update();
        }}
        pagination={{ type: "fraction" }}
        className={classes.swiper_wrapper}
      >
        {[...Array(img_num[path])].map((tmp, index) => (
          <SwiperSlide
            style={{ display: "flex", justifyContent: "center" }}
            onClick={() => setstartPos(index)}
            key={index}
          >
            <RatioBox width="100%" ratio={1.5}>
              <NImage src={getFullFilePath(`/${path}/${index + 1}.jpg`)} objectFit="cover" />
            </RatioBox>
          </SwiperSlide>
        ))}
      </Swiper>

      <DetailImageModal
        title={title}
        data={[...Array(img_num[path])].map((tmp, index) => ({
          img_url: getFullFilePath(`/${path}/${index + 1}.jpg`),
        }))}
        startPos={startPos}
        handleClose={() => setstartPos(-1)}
      />
    </Box>
  );
};

type DetailModalProps = {
  title: string;
  data: { img_url: string }[];
  startPos: number;
  handleClose: () => void;
};
const DetailImageModal: React.FC<DetailModalProps> = ({ title, data, startPos, handleClose }) => {
  const classes = useStyles();
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  
  return (
    <Modal
      open={startPos !== -1}
      onClose={handleClose}
      BackdropProps={{ style: { background: "#000" } }}
      disableBackdropClick
    >
      <Box py={4} position="relative" display="flex" flexDirection="column" justifyContent="center" minHeight="100vh">
        <Box mt={6} position="absolute" top={0} left={0}>
          <Typography px={2} color="secondary" variant="h5" fontWeight={700} fontFamily="Playfair Display">
            {title}
          </Typography>
        </Box>

        <Box position="relative">
          <IconButton className={classes.nav_button} style={{ left: 30, color: "#fff" }} ref={prevRef}>
            <ChevronLeft />
          </IconButton>
          <IconButton className={classes.nav_button} style={{ right: 30, color: "#fff" }} ref={nextRef}>
            <ChevronRight />
          </IconButton>

          <Swiper
            spaceBetween={10}
            navigation={{
              prevEl: prevRef.current || undefined,
              nextEl: nextRef.current || undefined,
              disabledClass: classes.nav_disabled,
            }}
            onInit={(swiper) => {
              Object.assign(swiper.params.navigation, {
                prevEl: prevRef.current,
                nextEl: nextRef.current,
              });
              // swiper.navigation?.update();
            }}
            pagination={{ type: "fraction" }}
            className={classes.swiper_wrapper}
            initialSlide={startPos}
            style={{ color: "#fff" }}
          >
            {data.map((item, index) => (
              <SwiperSlide style={{ display: "flex", justifyContent: "center" }} key={index}>
                <RatioBox width="100%" ratio={1.7}>
                  <NImage src={item.img_url || ""} objectFit="cover" />
                </RatioBox>
              </SwiperSlide>
            ))}
          </Swiper>
        </Box>

        <Fab
          style={{ position: "absolute", bottom: "30px", right: "30px" }}
          color="secondary"
          size="small"
          onClick={handleClose}
        >
          <Clear />
        </Fab>
      </Box>
    </Modal>
  );
};
