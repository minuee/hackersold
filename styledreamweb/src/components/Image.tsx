import React from "react";
import { makeStyles, Box, BoxProps } from "@material-ui/core";

const useStyles = makeStyles({
  img: {
    backgroundImage: ({ src }: imageProps) => `url(${src})`,
    backgroundSize: ({ objectFit }: imageProps) => objectFit,
    backgroundPosition: ({ objectPosition }: imageProps) => objectPosition,
    backgroundRepeat: "no-repeat",
    backgroundOrigin: "content-box",
  },
});

type imageProps = BoxProps & {
  src: string;
  objectFit?: string;
  objectPosition?: string;
};

export const Image = ({ src, objectFit = "contain", objectPosition = "center", ...props }: imageProps) => {
  const classes = useStyles({
    src,
    objectFit,
    objectPosition,
  });

  return <Box className={classes.img} width="100%" height="100%" {...props} />;
};
