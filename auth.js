export default {
  bitbucket: {
    username: process.env.BITBUCKET_USER,
    password: process.env.BITBUCKET_PASS
  },
  jenkins: {
    username: process.env.JENKINS_USER,
    password: process.env.JENKINS_PASS
  },
  jira: {
    username: process.env.JIRA_USER,
    password: process.env.JIRA_PASS
  },
  sonarqube: {
    username: process.env.SONARQUBE_USER,
    password: process.env.SONARQUBE_PASS
  }
}
