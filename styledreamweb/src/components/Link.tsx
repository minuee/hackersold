import React from "react";
import { useLocation, useHistory } from "react-router-dom";
import { makeStyles, ButtonBase } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  anchor: {
    WebkitTapHighlightColor: "transparent",

    fontWeight: ({ isCur }: any) => (isCur ? 700 : 300),
    textDecoration: ({ isCur }: any) => (isCur ? "underline white" : "none"),
  },
  button: {
    textAlign: "left",
    color: "#fff",
    borderRadius: theme.spacing(0.5),

    width: ({ width }: any) => width,
    height: ({ height }: any) => height,
    fontWeight: ({ isCur }: any) => (isCur ? 700 : 300),

    "& > .MuiBox-root": {
      width: "100%",
    },
  },
}));

type linkProps = {
  href: string;
  width?: number | string | undefined;
  height?: number | string | undefined;
  rippleColor?: string;
  onClick?: () => void;
};

export const Link: React.FC<linkProps> = ({ children, href, width, height, rippleColor, onClick = () => {} }) => {
  const history = useHistory();
  const { pathname } = useLocation();
  const classes = useStyles({ width, height, isCur: pathname == href });

  return (
    <ButtonBase
      onClick={() => {
        history.push(href);
        onClick();
      }}
      className={classes.button}
      TouchRippleProps={{
        style: { color: rippleColor || "#fff" },
      }}
    >
      {children}
    </ButtonBase>

    // <a className={classes.anchor} href={href}>
    //   <ButtonBase
    //     className={classes.button}
    //     onClick={onClick}
    //     TouchRippleProps={{
    //       style: { color: rippleColor || "#fff" },
    //     }}
    //   >
    //     {children}
    //   </ButtonBase>
    // </a>
  );
};
