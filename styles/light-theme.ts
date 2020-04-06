import { IThemePalette } from "./theme-model";

const colors = {
  grey50: "#fafafa",
  grey200: "#eeeeee",
  grey400: "#bdbdbd",
  grey900: "#212121",
  white: "#ffffff",
  cyan500: "#00bcd4",
  pinkA200: "#ff4081",
  redA700: "#d50000",
  amberA700: "#ffab00",
  greenA700: "#00c853",
  lightGreenA700: "#64dd17",
  orangeA700: "#ff6d00",
};

const palette: IThemePalette = {
  backgroundColor: colors.grey50,
  borderColor: colors.grey200,
  textColor: colors.grey900,
  textInvertColor: colors.grey50,
  canvasColor: colors.white,
  primaryColor: colors.cyan500,
  accentColor: colors.pinkA200,
  errorColor: colors.redA700,
  warnColor: colors.amberA700,
  warnSecondaryColor: colors.orangeA700,
  successColor: colors.greenA700,
  successSecondaryColor: colors.lightGreenA700,
  disabledColor: colors.grey400,
};

export default {
  palette: palette,
};
