import { IThemePalette } from "./theme-model";

const colors = {
  grey400: "#bdbdbd",
  grey700: "#616161",
  grey800: "#424242",
  grey: "#303030",
  white: "#ffffff",
  cyan500: "#00bcd4",
  pinkA200: "#ff4081",
  red500: "#f44336",
  amber500: "#ffc107",
  green500: "#4caf50",
  orange500: "#ff9800",
  lime500: "#cddc39",
};

const palette: IThemePalette = {
  backgroundColor: colors.grey,
  borderColor: colors.grey700,
  textColor: colors.white,
  textInvertColor: colors.grey,
  canvasColor: colors.grey800,
  primaryColor: colors.cyan500,
  accentColor: colors.pinkA200,
  errorColor: colors.red500,
  warnColor: colors.amber500,
  warnSecondaryColor: colors.orange500,
  successColor: colors.green500,
  successSecondaryColor: colors.lime500,
  disabledColor: colors.grey400,
};

export default {
  palette: palette,
};
