export interface IBitbucketPullRequestCountProps {
  interval: number;
  title: string;
  users: Array<string>;
  authKey: string;
  url: string;
  project: string;
  repository: string;
}

export interface IBitbucketPullRequestCountState {
  count: number;
  error: boolean;
  loading: boolean;
}
