import React from "react";

import Dashboard from "../components/Dashboard";

// Widgets
import DateTime from "../components/widgets/datetime/DateTime";
import PageSpeedInsightsScore from "../components/widgets/pagespeed-insights/PageSpeedInsideScore";
import PageSpeedInsightsStats from "../components/widgets/pagespeed-insights/PageSpeedInsightsStats";
import JiraIssueCount from "../components/widgets/jira/JiraIssueCount";
import SonarQube from "../components/widgets/sonarqube/SonarQube";
import JenkinsJobStatus from "../components/widgets/jenkins/JenkinsJobStatus";
import JenkinsJobHealth from "../components/widgets/jenkins/JenkinsJobHealth";
import JenkinsBuildDuration from "../components/widgets/jenkins/JenkinsBuildBuration";
import BitbucketPullRequestCount from "../components/widgets/bitbucket/BitbucketPullRequestCount";
import ElasticsearchHitCount from "../components/widgets/elasticsearch/ElasticsearchHitCount";
import GitHubIssueCount from "../components/widgets/github/GitHubIssueCount";

// Theme
import lightTheme from "../styles/light-theme";
// import darkTheme from '../styles/dark-theme'

export default () => (
  <Dashboard theme={lightTheme} title={"Dashboard"}>
    <DateTime />

    <PageSpeedInsightsScore url="https://github.com" />

    <PageSpeedInsightsStats url="https://github.com" />

    <JiraIssueCount
      title="JIRA Open Bugs"
      url="https://crossorigin.me/https://jira.atlassian.com"
      query='type=Bug AND project="Bitbucket Server" AND resolution=Unresolved ORDER BY priority DESC,created DESC'
      authKey={"jira"}
    />

    <BitbucketPullRequestCount
      title="Bitbucket Open PR"
      url="https://crossorigin.me/https://bitbucket.typo3.com"
      project="EXT"
      repository="blog"
      authKey={"bitbucket"}
    />

    <SonarQube
      url="https://crossorigin.me/https://sonarcloud.io"
      componentKey="com.icegreen:greenmail-parent"
      authKey={"sonarqube"}
    />

    <JenkinsJobStatus
      url="https://crossorigin.me/https://builds.apache.org"
      jobs={[
        { label: "JMeter", path: "JMeter-trunk", branch: "" },
        { label: "Log4j Kotlin", path: "Log4jKotlin", branch: "master" },
      ]}
      authKey={"jenkins"}
    />

    <JenkinsJobHealth
      url="https://crossorigin.me/https://builds.apache.org"
      jobs={[
        { label: "JMeter", path: "JMeter-trunk", branch: "" },
        { label: "Log4j Kotlin", path: "Log4jKotlin", branch: "master" },
      ]}
      authKey={"jenkins"}
    />

    <JenkinsBuildDuration
      url="https://crossorigin.me/https://builds.apache.org"
      jobs={[
        { label: "JMeter", path: "JMeter-trunk", branch: "" },
        { label: "Log4j Kotlin", path: "Log4jKotlin", branch: "master" },
      ]}
      authKey={"jenkins"}
    />

    <ElasticsearchHitCount
      title="Log Hits"
      url="https://crossorigin.me/http://ec2-34-210-144-223.us-west-2.compute.amazonaws.com:9200"
      index="blog"
      query="user:dilbert"
      authKey={"elasticsearch"}
    />

    <GitHubIssueCount
      owner="danielbayerlein"
      repository="dashboard"
      authKey={""}
    />
  </Dashboard>
);
