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
  <a href="https://travis-ci.org">
    <img alt="Travis build status" src="https://travis-ci.org/danielbayerlein/dashboard.svg?branch=master">
  </a>
  <a href="https://standardjs.com">
    <img alt="JavaScript Style Guide" src="https://img.shields.io/badge/code_style-standard-brightgreen.svg">
  </a>
  <a href="https://greenkeeper.io/">
    <img alt="Greenkeeper badge" src="https://badges.greenkeeper.io/danielbayerlein/dashboard.svg">
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
    * [Example](#example)
    * [props](#props)
  * [Jenkins](#jenkins)
    * [Example](#example-1)
    * [props](#props-1)
  * [JIRA Issue Count](#jira-issue-count)
    * [Example](#example-2)
    * [props](#props-2)
  * [Bitbucket PullRequest Count](#bitbucket-pullrequest-count)
    * [Example](#example-3)
    * [props](#props-3)
  * [PageSpeed Insights Score](#pagespeed-insights-score)
    * [Example](#example-4)
    * [props](#props-4)
  * [PageSpeed Insights Stats](#pagespeed-insights-stats)
    * [Example](#example-5)
    * [props](#props-5)
  * [SonarQube](#sonarqube)
    * [Example](#example-6)
    * [props](#props-6)
* [Available Themes](#available-themes)
  * [light](#light)
  * [dark](#dark)
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
  <Dashboard theme={lightTheme}>
    <DateTime />
  </Dashboard>
)
```

This dashboard is available at http://localhost:3000/team-unicorn.

For an example, see [pages/index.js](./pages/index.js).

## Available Widgets

### [DateTime](./components/widgets/datetime/index.js)

#### Example

```javascript
import DateTime from '../components/widgets/datetime'

<DateTime interval={10000} />
```

#### props

* `interval`: Refresh interval in milliseconds (Default: `10000`)

### [Jenkins](./components/widgets/jenkins/index.js)

#### Example

```javascript
import Jenkins from '../components/widgets/jenkins'

<Jenkins
  url="https://crossorigin.me/http://ci.jenkins-ci.org"
  jobs={[
    { label: 'jenkins master', path: 'Core/job/jenkins/job/master/' },
    { label: 'jenkins stable', path: 'Core/job/jenkins/job/stable-2.7/'},
    { label: 'jenkins sshd', path: 'Core/job/sshd-module/job/master/' },
  ]}
/>
```

#### props

* `title`: Widget title (Default: `Jenkins`)
* `interval`: Refresh interval in milliseconds (Default: `300000`)
* `url`: Jenkins URL
* `jobs`: List of all jobs

### [JIRA Issue Count](./components/widgets/jira/issue-count.js)

#### Example

```javascript
import JiraIssueCount from '../components/widgets/jira/issue-count'

<JiraIssueCount
  title='JIRA Open Bugs'
  url='https://jira.atlassian.com/'
  query='type=Bug AND project="Bitbucket Server" AND resolution=Unresolved ORDER BY priority DESC,created DESC'
/>
```

#### props

* `title`: Widget title (Default: `JIRA Issue Count`)
* `interval`: Refresh interval in milliseconds (Default: `300000`)
* `url`: JIRA Server URL
* `query`: JIRA search query (`jql`)

### [Bitbucket PullRequest Count](./components/widgets/bitbucket/pull-request-count.js)

#### Example

```javascript
import BitbucketPullRequestCount from '../components/widgets/bitbucket/pull-request-count'

<BitbucketPullRequestCount
  title='Bitbucket Open PR'
  url='https://bitbucket.typo3.com/'
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

### [PageSpeed Insights Score](./components/widgets/pagespeed-insights/score.js)

#### Example

```javascript
import PageSpeedInsightsScore from '../components/widgets/pagespeed-insights/score'

<PageSpeedInsightsScore url='https://github.com/' />
```

#### props

* `title`: Widget title (Default: `PageSpeed Score`)
* `interval`: Refresh interval in milliseconds (Default: `43200000`)
* `url`: URL to fetch and analyze
* `strategy`: Analysis strategy (Default: `desktop`)
  * Acceptable values: `desktop` | `mobile`
* `filterThirdPartyResources`: Indicates if third party resources should be filtered out (Default: `false`)

### [PageSpeed Insights Stats](./components/widgets/pagespeed-insights/stats.js)

#### Example

```javascript
import PageSpeedInsightsStats from '../components/widgets/pagespeed-insights/stats'

<PageSpeedInsightsStats url='https://github.com/' />
```

#### props

* `title`: Widget title (Default: `PageSpeed Stats`)
* `interval`: Refresh interval in milliseconds (Default: `43200000`)
* `url`: URL to fetch and analyze
* `strategy`: Analysis strategy (Default: `desktop`)
  * Acceptable values: `desktop` | `mobile`
* `filterThirdPartyResources`: Indicates if third party resources should be filtered out (Default: `false`)

### [SonarQube](./components/widgets/sonarqube/index.js)

#### Example

```javascript
import SonarQube from '../components/widgets/sonarqube'

<SonarQube
  url='https://sonarqube.com/'
  componentKey='com.icegreen:greenmail-parent'
/>
```

#### props

* `title`: Widget title (Default: `SonarQube`)
* `interval`: Refresh interval in milliseconds (Default: `300000`)
* `url`: SonarQube URL
* `componentKey`: SonarQube project key

## Available Themes

### [light](./styles/light-theme.js)

```javascript
import lightTheme from '../styles/light-theme'

<Dashboard theme={lightTheme}>
  ...
</Dashboard>
```

### [dark](./styles/dark-theme.js)

```javascript
import darkTheme from '../styles/dark-theme'

<Dashboard theme={darkTheme}>
  ...
</Dashboard>
```

## License

Copyright (c) 2017 Daniel Bayerlein. See [LICENSE](./LICENSE.md) for details.
