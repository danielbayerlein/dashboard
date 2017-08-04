import { Component } from 'react'
import fetch from 'isomorphic-unfetch'
import yup from 'yup'
import Widget from '../../widget'
import Counter from '../../counter'
import { basicAuthHeader } from '../../../lib/auth'

const schema = yup.object().shape({
  url: yup.string().url().required(),
  query: yup.string().required(),
  interval: yup.number(),
  title: yup.string(),
  authKey: yup.string()
})

export default class JiraIssueCount extends Component {
  static defaultProps = {
    interval: 1000 * 60 * 5,
    title: 'JIRA Issue Count'
  }

  state = {
    count: 0,
    hasError: false,
    isLoading: true
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
    const { authKey, url, query } = this.props
    const opts = authKey ? { headers: basicAuthHeader(authKey) } : {}

    try {
      const res = await fetch(`${url}/rest/api/2/search?jql=${query}`, opts)
      const json = await res.json()

      this.setState({ count: json.total, hasError: false, isLoading: false })
    } catch (err) {
      this.setState({ hasError: true, isLoading: false })
    } finally {
      this.interval = setInterval(() => this.fetchInformation(), this.props.interval)
    }
  }

  render () {
    const { count, hasError, isLoading } = this.state
    const { title } = this.props
    return (
      <Widget title={title} isLoading={isLoading} hasError={hasError}>
        <Counter value={count} />
      </Widget>
    )
  }
}
