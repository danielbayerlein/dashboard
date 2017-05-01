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
    score: 0
  }

  async componentDidMount () {
    const { url, filter_third_party_resources, locale, strategy } = this.props

    const urlObj = new URL('https://www.googleapis.com/pagespeedonline/v2/runPagespeed')
    urlObj.searchParams.append('url', url)
    urlObj.searchParams.append('filter_third_party_resources', filter_third_party_resources)
    urlObj.searchParams.append('locale', locale)
    urlObj.searchParams.append('strategy', strategy)

    const res = await fetch(urlObj.toString()) // eslint-disable-line no-undef
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
