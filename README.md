<p align="center">
  <img src="https://cloud.githubusercontent.com/assets/457834/25781812/a981cf5a-333e-11e7-938e-378de1589b20.png" width="250" alt="Dashboard">
</p>

<h1 align="center">
  Dashboard
</h1>

<p align="center">
  Create your own team dashboard with custom widgets.
</p>

<p align="center">
  <a href="https://github.com/danielbayerlein/vallox-api/actions">
    <img alt="Actions Status" src="https://github.com/danielbayerlein/dashboard/workflows/CI/badge.svg">
  </a>
  <a href="https://standardjs.com">
    <img alt="JavaScript Style Guide" src="https://img.shields.io/badge/code_style-standard-brightgreen.svg">
  </a>
  <a href="https://dependabot.com">
    <img alt="Dependabot Status" src="https://api.dependabot.com/badges/status?host=github&repo=danielbayerlein/dashboard">
  </a>
  <a href="https://deploy.now.sh/?repo=https://github.com/danielbayerlein/dashboard">
    <img alt="Deploy to now" src="https://deploy.now.sh/static/button.svg" height="20">
  </a>
</p>

## Table of Contents

* [Installation](#installation)
* [Server](#server)
  * [Development](#development)
  * [Production](#production)
  * [Docker](#docker)
* [Create a Dashboard](#create-a-dashboard)
* [Available Widgets](#available-widgets)
  * [DateTime](#datetime)
  * [Jenkins Job Status](#jenkins-job-status)
  * [Jenkins Job Health](#jenkins-job-health)
  * [Jenkins Build Duration](#jenkins-build-duration)
  * [JIRA Issue Count](#jira-issue-count)
  * [JIRA Sprint Days Remaining](#jira-sprint-days-remaining)
  * [Bitbucket PullRequest Count](#bitbucket-pullrequest-count)
  * [PageSpeed Insights Score](#pagespeed-insights-score)
  * [PageSpeed Insights Stats](#pagespeed-insights-stats)
  * [SonarQube](#sonarqube)
  * [Elasticsearch Hit Count](#elasticsearch-hit-count)
  * [GitHub Issue Count](#github-issue-count)
  * [Title](#title)
* [Available Themes](#available-themes)
  * [light](#light)
  * [dark](#dark)
* [Authentication](#authentication)
* [Cross-Origin Resource Sharing (CORS)](#cross-origin-resource-sharing-cors)
  * [Proxy](#proxy)
  * [Resources](#resources)
* [License](#license)

## Installation

1. [Download](../../archive/master.zip) or clone the repository.
2. Install the dependencies with `npm install`.

## Server

### Development

Run `npm run dev` and go to http://localhost:3000.

### Production

Build your dashboard for production with `npm run build` and then start the
server with `npm start`.

### Docker

1. Build your dashboard for production with `npm run build`
2. Build the image with `docker build -t dashboard .`
3. Start the container with `docker run -d -p 8080:3000 dashboard`
4. Go to http://localhost:8080

## Create a Dashboard

You can create multiple dashboards.
For example populate `pages/team-unicorn.js` inside your project:

```javascript
import Dashboard from '../components/dashboard'
import DateTime from '../components/widgets/datetime'
import lightTheme from '../styles/light-theme'

export default () => (
  <Dashboard theme={lightTheme} name='Unicorn Dashboard'>
    <DateTime />
  </Dashboard>
)
```

This dashboard is available at http://localhost:3000/team-unicorn.

For an example, see [pages/index.js](./pages/index.js).

## Available Widgets

### [DateTime](components/widgets/datetime/DateTime.tsx)

#### Example

```javascript
import DateTime from '../components/widgets/datetime'

<DateTime interval={10000} />
```

#### props

* `interval`: Refresh interval in milliseconds (Default: `10000`)

### [Jenkins Job Status](components/widgets/jenkins/JenkinsJobStatus.tsx)

#### Example

```javascript
import JenkinsJobStatus from '../components/widgets/jenkins/job-status'

<JenkinsJobStatus
  url='https://builds.apache.org'
  jobs={[
    { label: 'JMeter', path: 'JMeter-trunk' },
    { label: 'Log4j Kotlin', path: 'Log4jKotlin', branch: 'master' }
  ]}
/>
```

For Jenkins multibranch projects add `branch` to the object.

#### props

* `title`: Widget title (Default: `Job Status`)
* `interval`: Refresh interval in milliseconds (Default: `300000`)
* `url`: Jenkins URL
* `jobs`: List of all jobs
* `authKey`: Credential key, defined in [auth.js](./auth.js)

### [Jenkins Job Health](components/widgets/jenkins/JenkinsJobHealth.tsx)

#### Example

```javascript
import JenkinsJobHealth from '../components/widgets/jenkins/job-health'

<JenkinsJobHealth
  url='https://builds.apache.org'
  jobs={[
    { label: 'JMeter', path: 'JMeter-trunk' },
    { label: 'Log4j Kotlin', path: 'Log4jKotlin', branch: 'master' }
  ]}
/>
```

For Jenkins multibranch projects add `branch` to the object.

#### props

* `title`: Widget title (Default: `Job Health`)
* `interval`: Refresh interval in milliseconds (Default: `300000`)
* `url`: Jenkins URL
* `jobs`: List of all jobs
* `authKey`: Credential key, defined in [auth.js](./auth.js)


### [Jenkins Build Duration](components/widgets/jenkins/JenkinsBuildBuration.tsx)

#### Example

```javascript
import JenkinsBuildDuration from '../components/widgets/jenkins/build-duration'

<JenkinsBuildDuration
  url='https://builds.apache.org'
  jobs={[
    { label: 'JMeter', path: 'JMeter-trunk' },
    { label: 'Log4j Kotlin', path: 'Log4jKotlin', branch: 'master' }
  ]}
/>
```

For Jenkins multibranch projects add `branch` to the object.

#### props

* `title`: Widget title (Default: `Build Duration`)
* `interval`: Refresh interval in milliseconds (Default: `300000`)
* `url`: Jenkins URL
* `jobs`: List of all jobs
* `authKey`: Credential key, defined in [auth.js](./auth.js)

### [JIRA Issue Count](components/widgets/jira/JiraIssueCount.tsx)

#### Example

```javascript
import JiraIssueCount from '../components/widgets/jira/issue-count'

<JiraIssueCount
  title='JIRA Open Bugs'
  url='https://jira.atlassian.com'
  query='type=Bug AND project="Bitbucket Server" AND resolution=Unresolved ORDER BY priority DESC,created DESC'
/>
```

For Jenkins multibranch projects add `branch` to the object.

#### props

* `title`: Widget title (Default: `JIRA Issue Count`)
* `interval`: Refresh interval in milliseconds (Default: `300000`)
* `url`: JIRA Server URL
* `query`: JIRA search query (`jql`)
* `authKey`: Credential key, defined in [auth.js](./auth.js)

### [JIRA Sprint Days Remaining](components/widgets/jira/JiraSprintDaysRemaining.tsx)

#### Example

```javascript
import JiraSprintDaysRemaining from '../components/widgets/jira/sprint-days-remaining'

<JiraSprintDaysRemaining
  title='Sprint Days'
  url='https://jira.atlassian.com'
  boardId={42}
/>
```

#### props

* `title`: Widget title (Default: `JIRA Sprint Days Remaining`)
* `interval`: Refresh interval in milliseconds (Default: `3600000`)
* `url`: JIRA Server URL
* `boardId`: JIRA board id
* `authKey`: Credential key, defined in [auth.js](./auth.js)

### [Bitbucket PullRequest Count](components/widgets/bitbucket/BitbucketPullRequestCount.tsx)

#### Example

```javascript
import BitbucketPullRequestCount from '../components/widgets/bitbucket/pull-request-count'

<BitbucketPullRequestCount
  title='Bitbucket Open PR'
  url='https://bitbucket.typo3.com'
  project='EXT'
  repository='blog'
  users={['stekal', 'marleg', 'denhub']}
/>
```

#### props

* `title`: Widget title (Default: `Bitbucket PR Count`)
* `interval`: Refresh interval in milliseconds (Default: `300000`)
* `url`: Bitbucket Server URL
* `project`: Bitbucket project key
* `repository`: Bitbucket repository slug
* `users`: Bitbucket user slugs as an array
* `authKey`: Credential key, defined in [auth.js](./auth.js)

### [PageSpeed Insights Score](components/widgets/pagespeed-insights/PageSpeedInsideScore.tsx)

#### Example

```javascript
import PageSpeedInsightsScore from '../components/widgets/pagespeed-insights/score'

<PageSpeedInsightsScore url='https://github.com' />
```

#### props

* `title`: Widget title (Default: `PageSpeed Score`)
* `interval`: Refresh interval in milliseconds (Default: `43200000`)
* `url`: URL to fetch and analyze
* `strategy`: Analysis strategy (Default: `desktop`)
  * Acceptable values: `desktop` | `mobile`
* `filterThirdPartyResources`: Indicates if third party resources should be filtered out (Default: `false`)

### [PageSpeed Insights Stats](components/widgets/pagespeed-insights/PageSpeedInsightsStats.tsx)

#### Example

```javascript
import PageSpeedInsightsStats from '../components/widgets/pagespeed-insights/stats'

<PageSpeedInsightsStats url='https://github.com' />
```

#### props

* `title`: Widget title (Default: `PageSpeed Stats`)
* `interval`: Refresh interval in milliseconds (Default: `43200000`)
* `url`: URL to fetch and analyze
* `strategy`: Analysis strategy (Default: `desktop`)
  * Acceptable values: `desktop` | `mobile`
* `filterThirdPartyResources`: Indicates if third party resources should be filtered out (Default: `false`)

### [SonarQube](components/widgets/sonarqube/SonarQube.tsx)

#### Example

```javascript
import SonarQube from '../components/widgets/sonarqube'

<SonarQube
  url='https://sonarcloud.io'
  componentKey='com.icegreen:greenmail-parent'
/>
```

#### props

* `title`: Widget title (Default: `SonarQube`)
* `interval`: Refresh interval in milliseconds (Default: `300000`)
* `url`: SonarQube URL
* `componentKey`: SonarQube project key
* `authKey`: Credential key, defined in [auth.js](./auth.js)

### [Elasticsearch Hit Count](components/widgets/elasticsearch/ElasticsearchHitCount.tsx)

#### Example

```javascript
import ElasticsearchHitCount from '../components/widgets/elasticsearch/hit-count'

<ElasticsearchHitCount
  title='Log Hits'
  url='http://ec2-34-210-144-223.us-west-2.compute.amazonaws.com:9200'
  index='blog'
  query='user:dilbert'
/>
```

#### props

* `title`: Widget title (Default: `Elasticsearch Hit Count`)
* `interval`: Refresh interval in milliseconds (Default: `300000`)
* `url`: Elasticsearch URL
* `index`: Elasticsearch index to search in
* `query`: Elasticsearch query
* `authKey`: Credential key, defined in [auth.js](./auth.js)

### [GitHub Issue Count](components/widgets/github/GitHubIssueCount.tsx)

#### Example

```javascript
import GitHubIssueCount from '../components/widgets/github/issue-count'

<GitHubIssueCount
  owner='danielbayerlein'
  repository='dashboard'
/>
```

#### props

* `title`: Widget title (Default: `GitHub Issue Count`)
* `interval`: Refresh interval in milliseconds (Default: `300000`)
* `owner`: Owner of the repository
* `repository`: Name of the repository
* `authKey`: Credential key, defined in [auth.js](./auth.js)

### [Title](components/widgets/title/Title.tsx)

#### Example

```javascript
import Title from '../components/widgets/title'

<Title>API Status</Title>
```

## Available Themes

### [light](styles/light-theme.ts)

#### Example

```javascript
import lightTheme from '../styles/light-theme'

<Dashboard theme={lightTheme}>
  ...
</Dashboard>
```

#### Preview

![dashboard-light](https://cloud.githubusercontent.com/assets/457834/26214930/8c065dce-3bfe-11e7-9da0-2d6ebba2dfb8.png)

### [dark](styles/dark-theme.ts)

#### Example

```javascript
import darkTheme from '../styles/dark-theme'

<Dashboard theme={darkTheme}>
  ...
</Dashboard>
```

#### Preview

![dashboard-dark](https://cloud.githubusercontent.com/assets/457834/26214954/a668dc50-3bfe-11e7-8c19-7a0c7dd260e7.png)

## Authentication

Any widget can authenticate itself, should your server expect this. We use
[basic authentication](https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication).

1. Define your credential key in [auth.js](./auth.js). For example:
   ```javascript
   jira: {
     username: process.env.JIRA_USER,
     password: process.env.JIRA_PASS
   }
   ```
2. Give the defined credential key `jira` via prop `authKey` to the widget.
   For example:
   ```javascript
   <JiraIssueCount
     authKey='jira'
     url='https://jira.atlassian.com'
     query='type=Bug AND project="Bitbucket Server" AND resolution=Unresolved ORDER BY priority DESC,created DESC'
   />
   ```
3. Create a `.env` file or rename `.env.example` to `.env` in the root directory of your project. Add
   environment-specific variables on new lines in the form of `NAME=VALUE`.
   For example:
   ```dosini
   JIRA_USER=root
   JIRA_PASS=s1mpl3
   ```

## Cross-Origin Resource Sharing (CORS)

[Cross-Origin Resource Sharing](https://www.w3.org/TR/cors/) (CORS) is a W3C
spec that allows cross-domain communication from the browser. By building on
top of the XMLHttpRequest object, CORS allows developers to work with the same
idioms as same-domain requests.

### Proxy

You can use a proxy (e.g. [hapi-rest-proxy](https://github.com/chrishelgert/hapi-rest-proxy))
to enable CORS request for any website.

#### Server

```bash
docker pull chrishelgert/hapi-rest-proxy
docker run -d -p 3001:8080 chrishelgert/hapi-rest-proxy
```

#### Dashboard

```javascript
<SonarQube
  url='http://127.0.0.1:3001/?url=https://sonarcloud.io'
  componentKey='com.icegreen:greenmail-parent'
/>
```

### Resources

* https://www.w3.org/TR/cors/
* https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS
* https://enable-cors.org
* https://en.wikipedia.org/wiki/Cross-origin_resource_sharing

## License

Copyright (c) 2017-present Daniel Bayerlein. See [LICENSE](./LICENSE.md) for details.
