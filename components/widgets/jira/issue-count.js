import { Component } from 'react'
import fetch from 'isomorphic-unfetch'
import { array, object, string, number } from 'yup'
import Widget from '../../widget'
import Counter from '../../counter'
import { basicAuthHeader } from '../../../lib/auth'
import { severity, NONE } from '../../../lib/alert'

const schema = object().shape({
  url: string().url().required(),
  query: string().required(),
  interval: number(),
  title: string(),
  authKey: string(),
  alert: array(object({
    severity: string().required(),
    value: number().required()
  }))
})

export default class JiraIssueCount extends Component {
  static defaultProps = {
    interval: 1000 * 60 * 5,
    title: 'JIRA Issue Count'
  }

  state = {
    count: 0,
    hasError: false,
    isLoading: true,
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
    const { authKey, url, query, alert } = this.props
    const opts = authKey ? { headers: basicAuthHeader(authKey) } : {}

    try {
      const res = await fetch(`${url}/rest/api/2/search?jql=${query}`, opts)
      const json = await res.json()
      const total = json.total

      this.setState({
        count: total,
        hasError: false,
        isLoading: false,
        alertSeverity: severity(total, alert)
      })
    } catch (err) {
      this.setState({ hasError: true, isLoading: false, alertSeverity: NONE })
    } finally {
      this.timeout = setTimeout(() => this.fetchInformation(), this.props.interval)
    }
  }

  render () {
    const { count, hasError, isLoading, alertSeverity } = this.state
    const { title } = this.props

    return (
      <Widget title={title} isLoading={isLoading} hasError={hasError} alertSeverity={alertSeverity}>
        <Counter value={count} />
      </Widget>
    )
  }
}
