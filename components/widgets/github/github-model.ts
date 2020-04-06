export interface IGitHubIssueCountProps {
  interval: number;
  title: string;
  authKey: string;
  owner: string;
  repository: string;
}

export interface IGitHubIssueCountState {
  count: number;
  error: boolean;
  loading: boolean;
}
