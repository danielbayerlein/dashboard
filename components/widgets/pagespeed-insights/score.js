import { Component } from 'react'
import fetch from 'isomorphic-unfetch'
import yup from 'yup'
import CircleProgress from '../../circle-progress'
import Widget from '../../widget'
import { severity, NONE } from '../../../lib/alert'

const schema = yup.object().shape({
  url: yup.string().url().required(),
  filterThirdPartyResources: yup.boolean(),
  interval: yup.number(),
  strategy: yup.string(),
  title: yup.string(),
  alert: yup.array(yup.object({
    severity: yup.string().required(),
    value: yup.number().required()
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
