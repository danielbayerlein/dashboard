export interface IElasticsearchHitCountProps {
  interval: number;
  title: string;
  authKey: string;
  index: string;
  query: string;
  url: string;
}

export interface IElasticsearchHitCountState {
  count: number;
  error: boolean;
  loading: boolean;
}
