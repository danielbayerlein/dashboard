import { Component } from 'react'
import fetch from 'isomorphic-unfetch'
import yup from 'yup'
import Widget from '../../widget'
import Counter from '../../counter'
import { basicAuthHeader } from '../../../lib/auth'
import { severity, NONE } from '../../../lib/alert'

const schema = yup.object().shape({
  url: yup.string().url().required(),
  query: yup.string().required(),
  interval: yup.number(),
  title: yup.string(),
  authKey: yup.string(),
  alert: yup.array(yup.object({
    severity: yup.string().required(),
    value: yup.number().required()
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
    clearInterval(this.interval)
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
      this.interval = setInterval(() => this.fetchInformation(), this.props.interval)
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
