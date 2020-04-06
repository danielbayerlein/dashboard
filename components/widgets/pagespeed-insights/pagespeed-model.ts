export interface IPageSpeedInsideScoreProps {
  url: string;
  filterThirdPartyResources: boolean;
  interval: number;
  strategy: string;
  title: string;
}

export interface IPageSpeedInsideScoreState {
  score: number;
  loading: boolean;
  error: boolean;
}

export interface IPageSpeedInsightsStatsProps {
  url: string;
  filterThirdPartyResources: boolean;
  interval: number;
  strategy: string;
  title: string;
}

export interface IPageSpeedInsightsStatsState {
  stats: IPageSpeedStats;
  loading: boolean;
  error: boolean;
}

export interface IPageSpeedStats {
  requestSize: number;
  requestCount: number;
  cssCount: number;
  cssSize: number;
  htmlSize: number;
  imageSize: number;
  javascriptCount: number;
  javascriptSize: number;
  otherSize: number;
}
