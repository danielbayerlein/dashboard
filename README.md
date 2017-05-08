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
  <a href="https://standardjs.com">
    <img alt="JavaScript Style Guide" src="https://img.shields.io/badge/code_style-standard-brightgreen.svg">
  </a>
  <a href="https://greenkeeper.io/">
    <img alt="Greenkeeper badge" src="https://badges.greenkeeper.io/danielbayerlein/dashboard.svg">
  </a>
</p>

* [Installation](#installation)
* [Server](#server)
  * [Development](#development)
  * [Production](#production)
* [Create a Dashboard](#create-a-dashboard)
* [Available Widgets](#available-widgets)
  * [DateTime](#datetime)
    * [Example](#example)
    * [props](#props)
  * [JIRA Issue Count](#jira-issue-count)
    * [Example](#example-1)
    * [props](#props-1)
  * [Bitbucket PullRequest Count](#bitbucket-pullrequest-count)
    * [Example](#example-2)
    * [props](#props-2)
  * [PageSpeed Insights](#pagespeed-insights)
    * [Example](#example-3)
    * [props](#props-3)
  * [SonarQube](#sonarqube)
    * [Example](#example-4)
    * [props](#props-4)
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

### [JIRA Issue Count](./components/widgets/jira-issue-count/index.js)

#### Example

```javascript
import JiraIssueCount from '../components/widgets/jira-issue-count'

<JiraIssueCount
  title='JIRA Open Bugs'
  url='https://jira.atlassian.com/'
  query='type=Bug AND project="Bitbucket Server" AND resolution=Unresolved ORDER BY priority DESC,created DESC'
/>
```

#### props

* `title`: Widget title (Default: `JIRA Issue Count`)
* `url`: JIRA Server URL
* `query`: JIRA search query (`jql`)

### [Bitbucket PullRequest Count](./components/widgets/bitbucket-pullrequest-count/index.js)

#### Example

```javascript
import BitbucketPullRequestCount from '../components/widgets/bitbucket-pullrequest-count'

<BitbucketPullRequestCount
  title='Bitbucket Open PR'
  url='https://bitbucket.typo3.com/'
  project='EXT'
  repository='blog'
  users="stekal,marleg,denhub"
/>
```

#### props

* `title`: Widget title (Default: `Bitbucket PR Count`)
* `url`: Bitbucket Server URL
* `project`: Bitbucket project key
* `repository`: Bitbucket repository slug
* `users`: Bitbucket user slugs

### [PageSpeed Insights](./components/widgets/psi/index.js)

#### Example

```javascript
import PageSpeedScore from '../components/widgets/psi'

<PageSpeedScore url='https://github.com/' />
```

#### props

* `title`: Widget title (Default: `PageSpeed Score`)
* `url`: URL to fetch and analyze
* `locale`: Locale used to localize formatted results (Default: `de_DE`)
* `strategy`: Analysis strategy (Default: `desktop`)
  * Acceptable values: `desktop` | `mobile`
* `filterThirdPartyResources`: Indicates if third party resources should be filtered out (Default: `true`)

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
