import { Component } from 'react'
import fetch from 'isomorphic-unfetch'
import Progress from '../../progress'
import Widget from '../../widget'

export default class PageSpeedInsights extends Component {
  static defaultProps = {
    filter_third_party_resources: true,
    locale: 'de_DE',
    strategy: 'desktop'
  }

  state = {
    score: 0,
    loading: true,
    error: null
  }

  componentDidMount () {
    this.loadInformation()
  }

  async loadInformation () {
    this.setState({ loading: true, error: null })

    const { url, filter_third_party_resources, locale, strategy } = this.props

    const searchParams = [
      `url=${url}`,
      `filter_third_party_resources=${filter_third_party_resources}`,
      `locale=${locale}`,
      `strategy=${strategy}`,
    ]

    try {
      const res = await fetch(`https://www.googleapis.com/pagespeedonline/v2/runPagespeed?${searchParams.join('&')}`)
      const json = await res.json()

      this.setState({
        loading: false,
        score: json.ruleGroups.SPEED.score
      })
    } catch (_) {
      this.setState({
        loading: false,
        error: 'failed to load information'
      })
    }
  }

  render () {
    const { error, loading, score } = this.state
    return (
      <Widget title='PageSpeed Score' loading={loading} error={error}>
        <Progress value={score} />
      </Widget>
    )
  }
}
