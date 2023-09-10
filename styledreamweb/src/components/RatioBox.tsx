import React, { forwardRef } from "react";
import { Box, makeStyles, BoxProps } from "@material-ui/core";

const useStyles = makeStyles({
  ratio_box: {
    position: "relative",
    width: ({ width }: ratioboxProps) => width,
    paddingTop: ({ width, ratio }: ratioboxProps) => `calc(${width} / ${ratio})`,

    "& > *": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
    },
  },
});

type ratioboxProps = BoxProps & {
  ratio?: string | number;
};

export const RatioBox: React.FC<ratioboxProps> = ({ width = "100%", ratio = "1", children, ...props }) => {
  const classes = useStyles({ width, ratio });

  return (
    <Box className={classes.ratio_box} {...props}>
      <Box>{children}</Box>
    </Box>
  );
};
