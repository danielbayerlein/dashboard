import Dashboard from '../components/dashboard'

// Widgets
import DateTime from '../components/widgets/datetime'
import PageSpeedInsightsScore from '../components/widgets/pagespeed-insights/score'
import PageSpeedInsightsStats from '../components/widgets/pagespeed-insights/stats'
import JiraIssueCount from '../components/widgets/jira/issue-count'
import SonarQube from '../components/widgets/sonarqube'
import Jenkins from '../components/widgets/jenkins'
import BitbucketPullRequestCount from '../components/widgets/bitbucket/pull-request-count'
import ElasticsearchErrorHitCount from '../components/widgets/elasticsearch/hit-count'

// Theme
import lightTheme from '../styles/light-theme'
//import darkTheme from '../styles/dark-theme'

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
      url='https://crossorigin.me/https://sonarqube.com'
      componentKey='com.icegreen:greenmail-parent'
    />

    <Jenkins
      url='https://crossorigin.me/http://ci.jenkins-ci.org'
      jobs={[
        { label: 'jenkins master', path: 'Core/job/jenkins/job/master' },
        { label: 'jenkins stable', path: 'Core/job/jenkins/job/stable-2.7' },
        { label: 'jenkins sshd', path: 'Core/job/sshd-module/job/master' }
      ]}
    />

    <ElasticsearchErrorHitCount
      title='Log Hits'
      url='http://localhost:3001/http://elastic:changeme@localhost:9200'
      auth='Basic ZWxhc3RpYzpjaGFuZ2VtZQ=='
      index='blog'
      query='user:dilbert%20-_type:post'
    />
  </Dashboard>
)
