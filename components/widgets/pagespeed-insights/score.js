import { Component } from 'react'
import fetch from 'isomorphic-unfetch'
import { array, object, string, number, boolean } from 'yup'
import CircleProgress from '../../circle-progress'
import Widget from '../../widget'
import { severity, NONE } from '../../../lib/alert'

const schema = object().shape({
  url: string().url().required(),
  filterThirdPartyResources: boolean(),
  interval: number(),
  strategy: string(),
  title: string(),
  alert: array(object({
    severity: string().required(),
    value: number().required()
  }))
})

export default class PageSpeedInsightsScore extends Component {
  static defaultProps = {
    filterThirdPartyResources: false,
    interval: 1000 * 60 * 60 * 12,
    strategy: 'desktop',
    title: 'PageSpeed Score'
  }

  state = {
    score: 0,
    isLoading: true,
    hasError: false,
    alertSeverity: NONE
  }

  componentDidMount () {
    schema.validate(this.props)
      .then(() => this.fetchInformation())
      .catch((err) => {
        console.error(`${err.name} @ ${this.constructor.name}`, err.errors)
        this.setState({ hasError: true, isLoading: false })
      })
  }

  componentWillUnmount () {
    clearTimeout(this.timeout)
  }

  async fetchInformation () {
    const { url, filterThirdPartyResources, strategy, alert } = this.props

    const searchParams = [
      `url=${url}`,
      `filter_third_party_resources=${filterThirdPartyResources}`,
      `strategy=${strategy}`
    ].join('&')

    try {
      const res = await fetch(`https://www.googleapis.com/pagespeedonline/v2/runPagespeed?${searchParams}`)
      const json = await res.json()
      const score = json.ruleGroups.SPEED.score

      this.setState({
        score,
        hasError: false,
        isLoading: false,
        alertSeverity: severity(score, alert)
      })
    } catch (err) {
      this.setState({ hasError: true, isLoading: false, alertSeverity: NONE })
    } finally {
      this.timeout = setTimeout(() => this.fetchInformation(), this.props.interval)
    }
  }

  render () {
    const { hasError, isLoading, score, alertSeverity } = this.state
    const { title } = this.props

    return (
      <Widget title={title} isLoading={isLoading} hasError={hasError} alertSeverity={alertSeverity}>
        <CircleProgress value={score} />
      </Widget>
    )
  }
}
