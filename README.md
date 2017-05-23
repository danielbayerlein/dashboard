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
  * [ElasticsearchHitCount](#elasticsearchhitcount)
    * [Example](#example-7)
    * [props](#props-7)
* [Available Themes](#available-themes)
  * [light](#light)
    * [Example](#example-7)
    * [Preview](#preview)
  * [dark](#dark)
    * [Example](#example-8)
    * [Preview](#preview-1)
* [Cross-Origin Resource Sharing (CORS)](#cross-origin-resource-sharing-cors)
  * [Proxy](#proxy)
    * [Server](#server-1)
    * [Dashboard](#dashboard)
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
  url='http://ci.jenkins-ci.org'
  jobs={[
    { label: 'jenkins master', path: 'Core/job/jenkins/job/master' },
    { label: 'jenkins stable', path: 'Core/job/jenkins/job/stable-2.7'},
    { label: 'jenkins sshd', path: 'Core/job/sshd-module/job/master' },
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
  url='https://jira.atlassian.com'
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

### [PageSpeed Insights Score](./components/widgets/pagespeed-insights/score.js)

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

### [PageSpeed Insights Stats](./components/widgets/pagespeed-insights/stats.js)

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

### [SonarQube](./components/widgets/sonarqube/index.js)

#### Example

```javascript
import SonarQube from '../components/widgets/sonarqube'

<SonarQube
  url='https://sonarqube.com'
  componentKey='com.icegreen:greenmail-parent'
/>
```

#### props

* `title`: Widget title (Default: `SonarQube`)
* `interval`: Refresh interval in milliseconds (Default: `300000`)
* `url`: SonarQube URL
* `componentKey`: SonarQube project key

### [ElasticsearchHitCount](./components/widgets/elasticsearch/hit-count.js)

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

## Available Themes

### [light](./styles/light-theme.js)

#### Example

```javascript
import lightTheme from '../styles/light-theme'

<Dashboard theme={lightTheme}>
  ...
</Dashboard>
```

#### Preview

![dashboard-light](https://cloud.githubusercontent.com/assets/457834/26214930/8c065dce-3bfe-11e7-9da0-2d6ebba2dfb8.png)

### [dark](./styles/dark-theme.js)

#### Example

```javascript
import darkTheme from '../styles/dark-theme'

<Dashboard theme={darkTheme}>
  ...
</Dashboard>
```

#### Preview

![dashboard-dark](https://cloud.githubusercontent.com/assets/457834/26214954/a668dc50-3bfe-11e7-8c19-7a0c7dd260e7.png)

## Cross-Origin Resource Sharing (CORS)

[Cross-Origin Resource Sharing](https://www.w3.org/TR/cors/) (CORS) is a W3C
spec that allows cross-domain communication from the browser. By building on
top of the XMLHttpRequest object, CORS allows developers to work with the same
idioms as same-domain requests.

### Proxy

You can use a proxy (e.g. [hapi-rest-proxy](https://github.com/chrishelgert/hapi-rest-proxy) or [cors-anywhere](https://github.com/Rob--W/cors-anywhere))
to enable CORS request for any website.

#### Server

```bash
docker pull chrishelgert/hapi-rest-proxy
docker run -d -p 3001:8080 chrishelgert/hapi-rest-proxy
```

#### Dashboard

```javascript
<SonarQube
  url='http://localhost:3001?url=https://sonarqube.com'
  componentKey='com.icegreen:greenmail-parent'
/>
```

### Resources

* https://www.w3.org/TR/cors/
* https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS
* https://enable-cors.org
* https://en.wikipedia.org/wiki/Cross-origin_resource_sharing

## License

Copyright (c) 2017 Daniel Bayerlein. See [LICENSE](./LICENSE.md) for details.
