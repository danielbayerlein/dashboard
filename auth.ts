import { IAuthModel } from "./lib/auth-model";

const bitbucket: IAuthModel = {
  username: process.env.BITBUCKET_USER,
  password: process.env.BITBUCKET_PASS,
};

const elasticsearch: IAuthModel = {
  username: process.env.ELASTICSEARCH_USER,
  password: process.env.ELASTICSEARCH_PASS,
};

const jenkins: IAuthModel = {
  username: process.env.JENKINS_USER,
  password: process.env.JENKINS_PASS,
};

const jira: IAuthModel = {
  username: process.env.JIRA_USER,
  password: process.env.JIRA_PASS,
};

const sonarqube: IAuthModel = {
  username: process.env.SONARQUBE_USER,
  password: process.env.SONARQUBE_PASS,
};

const github: IAuthModel = {
  username: process.env.GITHUB_USER,
  password: process.env.GITHUB_PASS,
};

export default {
  bitbucket: bitbucket,
  elasticsearch: elasticsearch,
  jenkins: jenkins,
  jira: jira,
  sonarqube: sonarqube,
  github: github,
};
