import Dashboard from '../components/dashboard'

// Widgets
import DateTime from '../components/widgets/datetime'
import PageSpeedInsightsScore from '../components/widgets/pagespeed-insights/score'
import PageSpeedInsightsStats from '../components/widgets/pagespeed-insights/stats'
import JiraIssueCount from '../components/widgets/jira/issue-count'
import SonarQube from '../components/widgets/sonarqube'
import JenkinsJobStatus from '../components/widgets/jenkins/job-status'
import JenkinsJobHealth from '../components/widgets/jenkins/job-health'
import JenkinsBuildDuration from '../components/widgets/jenkins/build-duration'
import BitbucketPullRequestCount from '../components/widgets/bitbucket/pull-request-count'
import ElasticsearchHitCount from '../components/widgets/elasticsearch/hit-count'
import GitHubIssueCount from '../components/widgets/github/issue-count'

// Theme
import lightTheme from '../styles/light-theme'
// import darkTheme from '../styles/dark-theme'

export default () => (
  <Dashboard theme={lightTheme}>
    <DateTime />

    <PageSpeedInsightsScore url='https://github.com' />

    <PageSpeedInsightsStats url='https://github.com' />

    <JiraIssueCount
      title='JIRA Open Bugs'
      url='https://crossorigin.me/https://jira.atlassian.com'
      query='type=Bug AND project="Bitbucket Server" AND resolution=Unresolved ORDER BY priority DESC,created DESC'
    />

    <BitbucketPullRequestCount
      title='Bitbucket Open PR'
      url='https://crossorigin.me/https://bitbucket.typo3.com'
      project='EXT'
      repository='blog'
    />

    <SonarQube
      url='https://crossorigin.me/https://sonarcloud.io'
      componentKey='com.icegreen:greenmail-parent'
    />

    <JenkinsJobStatus
      url='https://crossorigin.me/https://builds.apache.org'
      jobs={[
        { label: 'JMeter', path: 'JMeter-trunk' },
        { label: 'Log4j Kotlin', path: 'Log4jKotlin', branch: 'master' }
      ]}
    />

    <JenkinsJobHealth
      url='https://crossorigin.me/https://builds.apache.org'
      jobs={[
        { label: 'JMeter', path: 'JMeter-trunk' },
        { label: 'Log4j Kotlin', path: 'Log4jKotlin', branch: 'master' }
      ]}
    />

    <JenkinsBuildDuration
      url='https://crossorigin.me/https://builds.apache.org'
      jobs={[
        { label: 'JMeter', path: 'JMeter-trunk' },
        { label: 'Log4j Kotlin', path: 'Log4jKotlin', branch: 'master' }
      ]}
    />

    <ElasticsearchHitCount
      title='Log Hits'
      url='https://crossorigin.me/http://ec2-34-210-144-223.us-west-2.compute.amazonaws.com:9200'
      index='blog'
      query='user:dilbert'
    />

    <GitHubIssueCount
      owner='danielbayerlein'
      repository='dashboard'
    />
  </Dashboard>
)
