import { Component } from 'react'
import { URL } from 'universal-url'
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

    const urlObj = new URL('https://www.googleapis.com/pagespeedonline/v2/runPagespeed')
    urlObj.searchParams.append('url', url)
    urlObj.searchParams.append('filter_third_party_resources', filter_third_party_resources)
    urlObj.searchParams.append('locale', locale)
    urlObj.searchParams.append('strategy', strategy)

    try {
      const res = await fetch(urlObj.toString())
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
