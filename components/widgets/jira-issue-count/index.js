import { Component } from 'react'
import fetch from 'isomorphic-unfetch'
import Widget from '../../widget'
import Counter from '../../counter'

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
    this.fetchInformation()
  }

  componentWillUnmount () {
    if (this.interval !== undefined) {
      clearInterval(this.interval)
    }
  }

  async fetchInformation () {
    const { url, query } = this.props

    try {
      const res = await fetch(`${url}rest/api/2/search?jql=${query}`)
      const json = await res.json()

      this.setState({ loading: false, count: json.total })
    } catch (error) {
      this.setState({ loading: false, error: true })
    } finally {
      this.interval = setInterval(() => this.fetchInformation(), this.props.interval)
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
