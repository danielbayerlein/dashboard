export interface IJenkinsJob {
  label: string;
  path: string;
  branch: string;
}

export interface IJenkinsBuild {
  name: string;
  url: string;
  duration: number;
}

export interface IJenkinsBuildBurationProps {
  url: string;
  jobs: Array<IJenkinsJob>;
  interval: number;
  title: string;
  authKey: string;
}

export interface IJenkinsBuildBurationState {
  loading: boolean;
  error: boolean;
  builds: Array<IJenkinsBuild>;
}

export interface IJenkinsJobHealthProps {
  url: string;
  jobs: Array<IJenkinsJob>;
  interval: number;
  title: string;
  authKey: string;
}

export interface IJenkinsJobHealthState {
  loading: boolean;
  error: boolean;
  builds: Array<IJenkinsBuild>;
}

export interface IJenkinsJobStatusProps {
  url: string;
  jobs: Array<IJenkinsJob>;
  interval: number;
  title: string;
  authKey: string;
}

export interface IJenkinsJobStatusState {
  loading: boolean;
  error: boolean;
  builds: Array<IJenkinsBuild>;
}
