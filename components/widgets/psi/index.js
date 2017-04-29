import { Component } from 'react'
import 'isomorphic-fetch'

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
    let url = 'https://www.googleapis.com/pagespeedonline/v2/runPagespeed'
    url += `?url=${this.props.url}`
    url += `&filter_third_party_resources=${this.props.filter_third_party_resources}`
    url += `&locale=${this.props.locale}`
    url += `&strategy=${this.props.strategy}`

    const res = await fetch(url) // eslint-disable-line no-undef
    const json = await res.json()

    this.setState({ score: json.ruleGroups.SPEED.score })
  }

  render () {
    return (
      <div>
        <h3>PageSpeed Score</h3>
        <p>{this.state.score}</p>
      </div>
    )
  }
}
