import Dashboard from '../components/dashboard'

// Widgets
import DateTime from '../components/widgets/datetime'
import PageSpeedScore from '../components/widgets/psi'
import JiraIssueCount from '../components/widgets/jira-issue-count'
import SonarQube from '../components/widgets/sonarqube'
import Jenkins from '../components/widgets/jenkins'

// Theme
import lightTheme from '../styles/light-theme'
// import darkTheme from '../styles/dark-theme'

export default () => (
  <Dashboard theme={lightTheme}>
    <DateTime />

    <PageSpeedScore url='https://github.com/' />

    <JiraIssueCount
      title='JIRA Open Bugs'
      url='https://crossorigin.me/https://jira.atlassian.com/'
      query='type=Bug AND project="Bitbucket Server" AND resolution=Unresolved ORDER BY priority DESC,created DESC'
    />

    <SonarQube
      url='https://crossorigin.me/https://sonarqube.com/'
      componentKey='com.icegreen:greenmail-parent'
    />

    <Jenkins
      url="https://crossorigin.me/http://ci.jenkins-ci.org"
      jobs={[
        { label: 'jenkins master', path: 'Core/job/jenkins/job/master/' },
        { label: 'jenkins stable', path: 'Core/job/jenkins/job/stable-2.7/'},
        { label: 'jenkins sshd', path: 'Core/job/sshd-module/job/master/' },
      ]}
    />
  </Dashboard>
)
