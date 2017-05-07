import { Component } from 'react'
import fetch from 'isomorphic-unfetch'
import CircleProgress from '../../circle-progress'
import Widget from '../../widget'

export default class PageSpeedInsights extends Component {
  static defaultProps = {
    filterThirdPartyResources: true,
    locale: 'de_DE',
    strategy: 'desktop',
    title: 'PageSpeed Score'
  }

  state = {
    score: 0
  }

  async componentDidMount () {
    const { url, filterThirdPartyResources, locale, strategy } = this.props

    const searchParams = [
      `url=${url}`,
      `filter_third_party_resources=${filterThirdPartyResources}`,
      `locale=${locale}`,
      `strategy=${strategy}`
    ]

    const res = await fetch(`https://www.googleapis.com/pagespeedonline/v2/runPagespeed?${searchParams.join('&')}`)
    const json = await res.json()

    this.setState({ score: json.ruleGroups.SPEED.score })
  }

  render () {
    const { score } = this.state
    const { title } = this.props
    return (
      <Widget title={title}>
        <CircleProgress value={score} />
      </Widget>
    )
  }
}
