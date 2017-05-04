import { Component } from 'react'
import fetch from 'isomorphic-unfetch'
import CircleProgress from '../../circle-progress'
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

    const searchParams = [
      `url=${url}`,
      `filter_third_party_resources=${filter_third_party_resources}`,
      `locale=${locale}`,
      `strategy=${strategy}`,
    ]

    const res = await fetch(`https://www.googleapis.com/pagespeedonline/v2/runPagespeed?${searchParams.join('&')}`)
    const json = await res.json()

    this.setState({ score: json.ruleGroups.SPEED.score })
  }

  render () {
    const { score } = this.state
    return (
      <Widget title='PageSpeed Score'>
        <CircleProgress value={score} />
      </Widget>
    )
  }
}
