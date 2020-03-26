export interface IJiraIssueCountProps {
  url: string;
  query: string;
  interval: number;
  title: string;
  authKey: string;
}

export interface IJiraIssueCountState {
  count: number;
  error: boolean;
  loading: boolean;
}

export interface IJiraSprintDaysRemainingProps {
  url: string;
  boardId: number;
  interval: number;
  title: string;
  authKey: string;
}

export interface IJiraSprintDaysRemainingState {
  days: number;
  error: boolean;
  loading: boolean;
}
