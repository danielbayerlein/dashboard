export interface ISonarQubeProps {
  url: string;
  componentKey: string;
  interval: number;
  title: string;
  authKey: string;
}

export interface ISonarQubeState {
  measures: Array<any>;
  loading: boolean;
  error: boolean;
}
