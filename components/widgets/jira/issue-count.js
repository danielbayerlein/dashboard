import { Component } from 'react'
import fetch from 'isomorphic-unfetch'
import { object, string, number } from 'yup'
import Widget from '../../widget'
import Counter from '../../counter'
import { basicAuthHeader } from '../../../lib/auth'

const schema = object().shape({
  url: string().url().required(),
  query: string().required(),
  interval: number(),
  title: string(),
  authKey: string()
})

export default class JiraIssueCount extends Component {
  static defaultProps = {
    interval: 1000 * 60 * 5,
    title: 'JIRA Issue Count'
  }

  state = {
    count: 0,
    error: false,
    loading: true
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
    const { authKey, url, query } = this.props
    const opts = authKey ? { headers: basicAuthHeader(authKey) } : {}

    try {
      const res = await fetch(`${url}/rest/api/2/search?jql=${query}`, opts)
      const json = await res.json()

      this.setState({ count: json.total, error: false, loading: false })
    } catch (error) {
      this.setState({ error: true, loading: false })
    } finally {
      this.timeout = setTimeout(() => this.fetchInformation(), this.props.interval)
    }
  }

  render () {
    const { count, error, loading } = this.state
    const { title } = this.props
    return (
      <Widget title={title} loading={loading} error={error}>
        <Counter value={count} />
      </Widget>
    )
  }
}
