import { Component } from 'react'
import 'isomorphic-fetch'
import Progress from '../../progress'
import Widget from '../../widget'

export default class PageSpeedInsights extends Component {
  static defaultProps = {
    filter_third_party_resources: true,
    locale: 'de_DE',
    strategy: 'desktop'
  }

  state = {
    score: 0
  }

  async componentDidMount () {
    const { url, filter_third_party_resources, locale, strategy } = this.props

    let requestUrl = 'https://www.googleapis.com/pagespeedonline/v2/runPagespeed'
    requestUrl += `?url=${url}`
    // eslint-disable-next-line camelcase
    requestUrl += `&filter_third_party_resources=${filter_third_party_resources}`
    requestUrl += `&locale=${locale}`
    requestUrl += `&strategy=${strategy}`

    // eslint-disable-next-line no-undef
    const res = await fetch(requestUrl)
    const json = await res.json()

    this.setState({ score: json.ruleGroups.SPEED.score })
  }

  render () {
    const { score } = this.state
    return (
      <Widget title='PageSpeed Score'>
        <Progress value={score} />
      </Widget>
    )
  }
}
