import MuiTypography from "@material-ui/core/Typography";
import { compose, style, typography, spacing } from "@material-ui/system";
import { styled } from "@material-ui/styles";

const whiteSpace = style({
  prop: "whiteSpace",
  cssProperty: "whiteSpace",
});
const wordBreak = style({
  prop: "wordBreak",
  cssProperty: "wordBreak",
});
const fontFamily = style({
  prop: "fontFamily",
  cssProperty: "fontFamily",
  transform: (value) => `${value}, sans-serif`,
});

export const Typography = styled(MuiTypography)(compose(typography, spacing, whiteSpace, wordBreak, fontFamily));
