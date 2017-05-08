import { Component } from 'react'
import fetch from 'isomorphic-unfetch'
import CircleProgress from '../../circle-progress'
import Widget from '../../widget'

export default class PageSpeedInsights extends Component {
  static defaultProps = {
    filterThirdPartyResources: true,
    interval: 1000 * 60 * 60 * 12,
    locale: 'de_DE',
    strategy: 'desktop',
    title: 'PageSpeed Score'
  }

  state = {
    score: 0,
    loading: true,
    error: false
  }

  componentDidMount () {
    this.fetchInformation()
  }

  componentWillUnmount () {
    if (this.interval !== undefined) {
      clearInterval(this.interval)
    }
  }

  async fetchInformation () {
    const { url, filterThirdPartyResources, locale, strategy } = this.props

    const searchParams = [
      `url=${url}`,
      `filter_third_party_resources=${filterThirdPartyResources}`,
      `locale=${locale}`,
      `strategy=${strategy}`
    ].join('&')

    try {
      const res = await fetch(`https://www.googleapis.com/pagespeedonline/v2/runPagespeed?${searchParams}`)
      const json = await res.json()

      this.setState({ loading: false, score: json.ruleGroups.SPEED.score })
    } catch (error) {
      this.setState({ loading: false, error: true })
    } finally {
      this.interval = setInterval(() => this.fetchInformation(), this.props.interval)
    }
  }

  render () {
    const { error, loading, score } = this.state
    const { title } = this.props
    return (
      <Widget title={title} loading={loading} error={error}>
        <CircleProgress value={score} />
      </Widget>
    )
  }
}
