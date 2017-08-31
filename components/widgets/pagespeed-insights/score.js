import { Component } from 'react'
import fetch from 'isomorphic-unfetch'
import yup from 'yup'
import CircleProgress from '../../circle-progress'
import Widget from '../../widget'

const schema = yup.object().shape({
  url: yup.string().url().required(),
  filterThirdPartyResources: yup.boolean(),
  interval: yup.number(),
  strategy: yup.string(),
  title: yup.string()
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
    loading: true,
    error: false
  }

  componentDidMount () {
    schema.validate(this.props)
      .then(() => this.fetchInformation())
      .catch((err) => {
        console.error(`${err.name} @ ${this.constructor.name}`, err.errors)
        this.setState({ error: true, loading: false })
      })
  }

  componentWillUnmount () {
    clearTimeout(this.timeout)
  }

  async fetchInformation () {
    const { url, filterThirdPartyResources, strategy } = this.props

    const searchParams = [
      `url=${url}`,
      `filter_third_party_resources=${filterThirdPartyResources}`,
      `strategy=${strategy}`
    ].join('&')

    try {
      const res = await fetch(`https://www.googleapis.com/pagespeedonline/v2/runPagespeed?${searchParams}`)
      const json = await res.json()

      this.setState({ error: false, loading: false, score: json.ruleGroups.SPEED.score })
    } catch (error) {
      this.setState({ error: true, loading: false })
    } finally {
      this.timeout = setTimeout(() => this.fetchInformation(), this.props.interval)
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
